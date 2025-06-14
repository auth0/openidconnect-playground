const jwkToPem = require("jwk-to-pem");
const jwt = require('jsonwebtoken')
const request = require('request')

module.exports = (req, res) => {
    if (req.method === "POST") {
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
    }
}