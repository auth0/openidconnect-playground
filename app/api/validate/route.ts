import { NextRequest, NextResponse } from "next/server";
import { importJWK, exportSPKI, type JWK } from "jose";
import jwt from "jsonwebtoken";

async function convertJwkToPem(jwk: JWK): Promise<string> {
  const key = await importJWK(jwk, "RS256");
  return exportSPKI(key as CryptoKey);
}

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

  // A nested function to handle the final verification step
  function verify(secret: string | Buffer): NextResponse {
    try {
      const decoded = jwt.verify(data.idToken, secret);
      return NextResponse.json(decoded, { status: 200 });
    } catch (err: unknown) {
      return NextResponse.json(
        { message: err instanceof Error ? err.message : "Verification failed" },
        { status: 400 },
      );
    }
  }

  try {
    const tokenHeader = jwt.decode(data.idToken, { complete: true }).header;
    if (!tokenHeader || !tokenHeader.alg) {
      return NextResponse.json(
        { message: "Invalid token header." },
        { status: 400 },
      );
    }

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
      const key = jwks.keys.find((k) => k.kid === tokenHeader.kid);
      if (!key) {
        return NextResponse.json(
          {
            message: `No public key found with matching kid '${tokenHeader.kid}'`,
          },
          { status: 400 },
        );
      }

      const pem = await convertJwkToPem(key);
      return verify(pem);

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
        data.server === "Auth0"
          ? Buffer.from(data.clientSecret, "base64")
          : data.clientSecret;
      return verify(secret);
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
