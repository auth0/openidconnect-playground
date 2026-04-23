import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ALLOWED_HOSTNAMES = new Set([
  "samples.auth0.com",
  "oauth2.googleapis.com",
]);

function isAllowedHostname(hostname: string): boolean {
  return ALLOWED_HOSTNAMES.has(hostname);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const reqData = {
      code: data.code,
      client_id: data.clientID,
      client_secret: data.clientSecret,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URI,
    };

    const providedUrl = new URL(data.tokenEndpoint);
    const isInvalidProtocol =
      providedUrl.protocol !== "http:" && providedUrl.protocol !== "https:";

    if (isInvalidProtocol || !isAllowedHostname(providedUrl.hostname)) {
      throw new Error(`Invalid URL`);
    }

    const response = await fetch(data.tokenEndpoint, {
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
        jwt.decode(tokenData.id_token, { complete: true }),
      ),
    };

    return NextResponse.json({ result: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching token:", error);
    return NextResponse.json(
      { message: "Failed to retrieve token" },
      { status: 500 },
    );
  }
}
