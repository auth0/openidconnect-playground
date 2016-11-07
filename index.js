const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const request = require('request');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
require('dotenv').config({ silent: true });

const app = express();

app.use(require('body-parser').json());

app.use(express.static('public'));

app.use((req, res, next) => {
  const proto = req.headers['x-forwarded-proto'];
  if (proto && proto !== 'https') {
    return res.redirect(302, `https://${req.hostname}${req.originalUrl}`);
  }

  return next();
});

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

const FileStore = require('session-file-store')(session);

app.use(session({
  store: new FileStore(),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: { secure: process.env.NON_SECURE_SESSION !== 'true' }
}));

app.set('view engine', 'jade');

app.get('/discover', (req, res) => {
  request.get(req.query.url, (err, resp, body) => {
    if (err) res.send(err);
    else res.send(body);
  });
});

app.get('/callback', (req, res) => {
  if (req.query.code) {
    /* eslint-disable no-param-reassign */
    req.session.refresh = false;
    req.session.authCode = req.query.code;
    /* eslint-enable no-param-reassign */
    res.redirect('/');
  }
});

app.get('*',
  (req, res) => {
    let code = null;
    if (!req.session.refresh && req.session.authCode) {
      code = req.session.authCode;
      /* eslint-disable no-param-reassign */
      req.session.refresh = true;
      /* eslint-enable no-param-reassign */
    }
    res.render('index', {
      code,
      redirect_uri: process.env.REDIRECT_URI,
      state: crypto.randomBytes(20).toString('hex'),
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    });
  }
);

app.post('/code_to_token', (req, res) => {
  // REQUIRED params: code, clientID, clientSecret, tokenEndpoint, serviceURL
  // step 1: exchange code for token with OIDC server
  // step 2: send back https response from OIDC server
  const result = {};
  const reqData = {
    code: req.body.code,
    client_id: req.body.clientID,
    client_secret: req.body.clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: process.env.REDIRECT_URI
  };

  request.post(req.body.tokenEndpoint, {
    form: reqData
  }, (err, response, body) => {
    result.body = body;
    result.response = response;
    // and add the decoded token
    result.decodedToken = JSON.stringify(jwt.decode(result.id_token, { complete: true }));
    res.json(result);
  });
});

app.post('/validate', (req, res) => {
  // REQUIRED: idToken, clientSecret or tokenKeysEndpoint, server
  // server is because we need to know what to do with/to/where to get the key
  let secret;

  if (req.body.server === 'Auth0') {
    // Auth0 base64 encodes its secrets
    secret = new Buffer(req.body.clientSecret, 'base64');
    verify((err, decoded) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(decoded);
      }
    });
  } else if (req.body.tokenKeysEndpoint) {
    // go get the keys!
    request.get(req.body.tokenKeysEndpoint, (err, resp, body) => {
      const keys = JSON.parse(body).keys;
      let done = false;
      // we have to try EACH key
      for (let i = 0; i < keys.length; i++) {
        secret = jwkToPem(keys[i]);
        verify((err, decoded) => {
          if (err) {
            res.status(400).send(err);
          } else if (decoded && !done) {
            res.json(decoded);
            done = true;
          }
        });
      }
      setTimeout(() => {
        // if we get here, none of the keys worked
        if (!done) {
          res.sendStatus(400).send('Invalid Signature');
        }
      }, 250);
    });
  } else {
    secret = req.body.clientSecret;
    verify((err, decoded) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(decoded);
      }
    });
  }

  function verify(cb) {
    jwt.verify(req.body.idToken, secret, { algorithims: ['HS256', 'RS256'] }, cb);
  }
});

app.listen(process.env.PORT || 5000);
