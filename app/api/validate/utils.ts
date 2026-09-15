import { exportSPKI, importJWK, type JWK } from "jose";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";

type VerifyResult =
  | { ok: true; decoded: JwtPayload | string }
  | { ok: false; error: string };

export async function convertJwkToPem(jwk: JWK): Promise<string> {
  const key = await importJWK(jwk, "RS256");
  return exportSPKI(key as CryptoKey);
}

export async function verify(
  idToken: string,
  secret: Secret,
): Promise<VerifyResult> {
  try {
    const decoded = jwt.verify(idToken, secret) as JwtPayload | string;
    return { ok: true, decoded };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    return {
      ok: false,
      error: errorMessage ?? "Invalid Token",
    };
  }
}
