import { Validator } from "jsonschema";

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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const response = await fetch(req.query.url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch discovery document: ${response.status} ${response.statusText}`
      );
    }

    const body = await response.text();

    if (isJson(body)) {
      const jsonBody = JSON.parse(body);
      const validationResult = valid.validate(jsonBody, discoverySchema);

      if (validationResult.valid) {
        return res.status(200).json({
          authorization_endpoint: jsonBody.authorization_endpoint,
          token_endpoint: jsonBody.token_endpoint,
          userinfo_endpoint: jsonBody.userinfo_endpoint,
          jwks_uri: jsonBody.jwks_uri,
        });
      } else {
        return res.status(400).json({
          message: "Discovery document is not valid.",
          errors: validationResult.errors.map(
            (e) => `The ${e.property.replace("instance.", "")} ${e.message}`
          ),
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Discovery document is not a JSON file." });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "An unexpected error occurred.",
    });
  }
}
