import { NextResponse, NextRequest } from "next/server";
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

export async function GET(request: NextRequest) {
  try {
    const data = await request.json();
    const response = await fetch(data.url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch discovery document: ${response.status} ${response.statusText}`,
      );
    }

    const body = await response.text();

    if (isJson(body)) {
      const jsonBody = JSON.parse(body);
      const validationResult = valid.validate(jsonBody, discoverySchema);

      if (validationResult.valid) {
        return NextResponse.json(
          {
            authorization_endpoint: jsonBody.authorization_endpoint,
            token_endpoint: jsonBody.token_endpoint,
            userinfo_endpoint: jsonBody.userinfo_endpoint,
            jwks_uri: jsonBody.jwks_uri,
          },
          {
            status: 200,
          },
        );
      } else {
        return NextResponse.json(
          {
            message: "Discovery document is not valid.",
            errors: validationResult.errors.map(
              (e) => `The ${e.property.replace("instance.", "")} ${e.message}`,
            ),
          },
          {
            status: 500,
          },
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Discovery document is not a JSON file.",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred.",
      },
      {
        status: 500,
      },
    );
  }
}
