const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const request = require("request");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const Validator = require("jsonschema").Validator;
require("dotenv").config({ silent: true });

const app = express();

app.use(require("body-parser").json());

app.use(express.static("public"));

app.use((req, res, next) => {
  const proto = req.headers["x-forwarded-proto"];
  if (proto && proto !== "https") {
    return res.redirect(302, `https://${req.hostname}${req.originalUrl}`);
  }

  return next();
});

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

const FileStore = require("session-file-store")(session);

app.use(
  session({
    store: new FileStore(),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: { secure: process.env.NON_SECURE_SESSION !== "true" },
  }),
);

app.set("view engine", "jade");

const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const valid = new Validator();
const discoverySchema = {
  type: "object",
  properties: {
    authorization_endpoint: { type: "string", format: "uri" },
    token_endpoint: { type: "string", format: "uri" },
    userinfo_endpoint: { type: "string", format: "uri" },
    jwks_uri: { type: "string", format: "uri" },
  },
  required: [
    "authorization_endpoint",
    "token_endpoint",
    "userinfo_endpoint",
    "jwks_uri",
  ],
};

app.get("/discover", (req, res) => {
  request.get(req.query.url, (err, resp, body) => {
    if (err) {
      return res.send(err);
    } else {
      if (isJson(body)) {
        const jsonBody = JSON.parse(body);
        const isValid = valid.validate(jsonBody, discoverySchema);
        if (isValid.errors.length < 1) {
          return res.json({
            authorization_endpoint: jsonBody.authorization_endpoint,
            token_endpoint: jsonBody.token_endpoint,
            userinfo_endpoint: jsonBody.userinfo_endpoint,
            jwks_uri: jsonBody.jwks_uri,
          });
        } else {
          return res.status(400).json({
            message: "Discovery document is not valid",
            errors: isValid.errors.map(
              (e) => `The ${e.property.replace("instance.", "")} ${e.message}`,
            ),
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Discovery document is not a JSON file." });
      }
    }
  });
});

app.get("/callback", (req, res) => {
  if (req.query.code) {
    /* eslint-disable no-param-reassign */
    req.session.refresh = false;
    req.session.authCode = req.query.code;
    /* eslint-enable no-param-reassign */
    res.redirect("/");
  }
});

app.get("*", (req, res) => {
  let code = null;
  if (!req.session.refresh && req.session.authCode) {
    code = req.session.authCode;
    /* eslint-disable no-param-reassign */
    req.session.refresh = true;
    /* eslint-enable no-param-reassign */
  }
  res.render("index", {
    code,
    redirect_uri: process.env.REDIRECT_URI,
    state: crypto.randomBytes(20).toString("hex"),
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
});

app.post("/code_to_token", (req, res) => {
  // REQUIRED params: code, clientID, clientSecret, tokenEndpoint, serviceURL
  // step 1: exchange code for token with OIDC server
  // step 2: send back https response from OIDC server
  const result = {};
  const reqData = {
    code: req.body.code,
    client_id: req.body.clientID,
    client_secret: req.body.clientSecret,
    grant_type: "authorization_code",
    redirect_uri: process.env.REDIRECT_URI,
  };

  request.post(
    req.body.tokenEndpoint,
    {
      form: reqData,
    },
    (err, response, body) => {
      result.body = body;
      result.response = response;
      // and add the decoded token
      result.decodedToken = JSON.stringify(
        jwt.decode(result.id_token, { complete: true }),
      );
      res.json(result);
    },
  );
});

app.post("/validate", (req, res) => {
  if (!req.body.idToken) {
    return res.status(400).send("Missing idToken param.");
  }

  const tokenHeader = jwt.decode(req.body.idToken, { complete: true }).header;

  // RS256 = validation with public key
  if (tokenHeader.alg === "RS256") {
    if (!req.body.tokenKeysEndpoint) {
      return res
        .status(400)
        .send(
          `idToken algorithm is ${tokenHeader.alg} but tokenKeysEndpoint param is missing.`,
        );
    }
    if (!tokenHeader.kid) {
      return res
        .status(400)
        .send(
          `idToken algorithm is ${tokenHeader.alg} but kid header is missing.`,
        );
    }

    // fetch public key
    return request.get(
      {
        url: req.body.tokenKeysEndpoint,
        json: true,
      },
      (err, resp, body) => {
        // find key with matching kid
        if (!body || !body.keys || !Array.isArray(body.keys)) {
          return res
            .status(400)
            .send(`No public key found with matching kid '${tokenHeader.kid}'`);
        }

        const key = body.keys.find((k) => k.kid === tokenHeader.kid);
        if (!key) {
          return res
            .status(400)
            .send(`No public key found with matching kid '${tokenHeader.kid}'`);
        }

        const secret = jwkToPem(key);
        return verify(secret);
      },
    );
    // HS256 = validation with client secret
  } else if (tokenHeader.alg === "HS256") {
    if (!req.body.clientSecret) {
      return res
        .status(400)
        .send(
          `idToken algorithm is ${tokenHeader.alg} but clientSecret param is missing.`,
        );
    }

    const secret =
      req.body.server === "Auth0"
        ? new Buffer(req.body.clientSecret, "base64")
        : req.body.clientSecret;
    return verify(secret);
  }
  return res
    .status(400)
    .send(`Unsupported idToken algorithm: ${tokenHeader.alg}`);

  function verify(secret) {
    jwt.verify(req.body.idToken, secret, (err, decoded) => {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json(decoded);
    });
  }
});

app.listen(process.env.PORT || 3000);
