const jose = require("node-jose");
const jwt = require("jsonwebtoken");

async function convertJwkToPem(jwk) {
  const keyStore = jose.JWK.createKeyStore();
  const key = await keyStore.add(jwk, "json");
  return key.toPEM();
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!req.body.idToken) {
    return res.status(400).send("Missing idToken param.");
  }

  // A nested function to handle the final verification step
  function verify(secret) {
    jwt.verify(req.body.idToken, secret, (err, decoded) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.status(200).json(decoded);
    });
  }

  try {
    const tokenHeader = jwt.decode(req.body.idToken, { complete: true }).header;
    if (!tokenHeader || !tokenHeader.alg) {
      return res.status(400).send("Invalid token header.");
    }

    // RS256 = validation with public key fetched from an endpoint
    if (tokenHeader.alg === "RS256") {
      if (!req.body.tokenKeysEndpoint) {
        return res
          .status(400)
          .send(
            `idToken algorithm is ${tokenHeader.alg} but tokenKeysEndpoint param is missing.`
          );
      }
      if (!tokenHeader.kid) {
        return res
          .status(400)
          .send(
            `idToken algorithm is ${tokenHeader.alg} but kid header is missing.`
          );
      }

      // Fetch public keys using the fetch API
      const response = await fetch(req.body.tokenKeysEndpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch keys: ${response.statusText}`);
      }

      const jwks = await response.json(); // Automatically parses the JSON body

      if (!jwks || !jwks.keys || !Array.isArray(jwks.keys)) {
        return res
          .status(400)
          .send("Invalid key set returned from the endpoint.");
      }

      // Find the key with the matching 'kid'
      const key = jwks.keys.find((k) => k.kid === tokenHeader.kid);
      if (!key) {
        return res
          .status(400)
          .send(`No public key found with matching kid '${tokenHeader.kid}'`);
      }

      const pem = await convertJwkToPem(key);
      return verify(pem);

      // HS256 = validation with client secret
    } else if (tokenHeader.alg === "HS256") {
      if (!req.body.clientSecret) {
        return res
          .status(400)
          .send(
            `idToken algorithm is ${tokenHeader.alg} but clientSecret param is missing.`
          );
      }

      const secret =
        req.body.server === "Auth0"
          ? Buffer.from(req.body.clientSecret, "base64")
          : req.body.clientSecret;
      return verify(secret);
    }

    return res
      .status(400)
      .send(`Unsupported idToken algorithm: ${tokenHeader.alg}`);
  } catch (error) {
    return res
      .status(500)
      .send(error.message || "An unexpected error occurred.");
  }
};