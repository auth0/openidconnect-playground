const jwt = require("jsonwebtoken");
const ALLOWED_HOSTNAMES = new Set([
  "samples.auth0.com",
  "oauth2.googleapis.com"
]);

function isAllowedHostname(hostname) {
  return ALLOWED_HOSTNAMES.has(hostname)
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const reqData = {
        code: req.body.code,
        client_id: req.body.clientID,
        client_secret: req.body.clientSecret,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URI,
      };

      const providedUrl = new URL(req.body.tokenEndpoint)
      const isInvalidProtocol = providedUrl.protocol !== "http:" && providedUrl.protocol !== "https:"
      
      if(isInvalidProtocol || !isAllowedHostname(providedUrl.hostname)) {
        throw new Error(`Invalid URL`)
      }

      const response = await fetch(req.body.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(reqData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const tokenData = await response.json();

      const result = {
        body: tokenData,
        response: {
          body: tokenData,
          statusCode: response.status,
          headers: response.headers,
        },
        decodedToken: JSON.stringify(
          jwt.decode(tokenData.id_token, { complete: true })
        ),
      };

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching token:", error);
      res.status(500).json({ error: "Failed to retrieve token" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
