import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { convertJwkToPem, verify } from "./utils";

export async function POST(request: NextRequest) {
  const data = await request.json();
  if (!data.idToken) {
    return NextResponse.json(
      { message: "Missing idToken param." },
      {
        status: 400,
      },
    );
  }

  try {
    const decodedToken = jwt.decode(data.idToken, { complete: true });
    if (!decodedToken || typeof decodedToken === "string" || !decodedToken.header?.alg) {
      return NextResponse.json(
        { message: "Invalid token header." },
        { status: 400 },
      );
    }
    const tokenHeader = decodedToken.header;

    // RS256 = validation with public key fetched from an endpoint
    if (tokenHeader.alg === "RS256") {
      if (!data.tokenKeysEndpoint) {
        return NextResponse.json(
          {
            message: `idToken algorithm is ${tokenHeader.alg} but tokenKeysEndpoint param is missing.`,
          },
          { status: 400 },
        );
      }
      if (!tokenHeader.kid) {
        return NextResponse.json(
          {
            message: `idToken algorithm is ${tokenHeader.alg} but kid header is missing.`,
          },
          { status: 400 },
        );
      }

      // Fetch public keys using the fetch API
      const response = await fetch(data.tokenKeysEndpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch keys: ${response.statusText}`);
      }

      const jwks = await response.json(); // Automatically parses the JSON body

      if (!jwks || !jwks.keys || !Array.isArray(jwks.keys)) {
        return NextResponse.json(
          { message: "Invalid key set returned from the endpoint." },
          { status: 400 },
        );
      }

      // Find the key with the matching 'kid'
      const key = jwks.keys.find((k: { kid?: string }) => k.kid === tokenHeader.kid);
      if (!key) {
        return NextResponse.json(
          {
            message: `No public key found with matching kid '${tokenHeader.kid}'`,
          },
          { status: 400 },
        );
      }

      const pem = await convertJwkToPem(key);
      const result = await verify(data.idToken, pem);

      if (result.ok === false) {
        return NextResponse.json(
          {
            message: result.error,
          },
          {
            status: 401,
          },
        );
      }
      return NextResponse.json(
        {
          decoded: result.decoded,
        },
        {
          status: 200,
        },
      );

      // HS256 = validation with client secret
    } else if (tokenHeader.alg === "HS256") {
      if (!data.clientSecret) {
        return NextResponse.json(
          {
            message: `idToken algorithm is ${tokenHeader.alg} but clientSecret param is missing.`,
          },
          { status: 400 },
        );
      }

      const secret =
        data.server?.toLowerCase() === "auth0"
          ? Buffer.from(data.clientSecret, "base64")
          : data.clientSecret;

      const result = await verify(data.idToken, secret);

      if (result.ok === false) {
        return NextResponse.json(
          {
            message: result.error,
          },
          {
            status: 401,
          },
        );
      }
      return NextResponse.json(
        {
          decoded: result.decoded,
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      { message: `Unsupported idToken algorithm: ${tokenHeader.alg}` },
      {
        status: 400,
      },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
