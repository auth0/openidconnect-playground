const Validator = require("jsonschema").Validator;
const request = require("request")
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

const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};


export default function handler(req, res) {
    if (req.method === "GET") {
      request.get(req.query.url, (err, resp, body) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "Couldn't get a discovery document",
            });
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
      }) 
    }
}