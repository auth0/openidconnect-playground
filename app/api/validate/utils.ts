import jose from "node-jose";
import jwt from "jsonwebtoken";

type VerifyResult =
  | { ok: true; decoded: string }
  | { ok: false; error: string };

export async function convertJwkToPem(jwk) {
  const keyStore = jose.JWK.createKeyStore();
  const key = await keyStore.add(jwk, "json");
  return key.toPEM();
}

export async function verify(idToken, secret): Promise<VerifyResult> {
  try {
    const decoded = await new Promise<string>((resolve, reject) => {
      jwt.verify(idToken, secret, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded as string);
      });
    });
    return { ok: true, decoded };
  } catch (error) {
    const errorMessage = error?.message;
    return {
      ok: false,
      error: errorMessage ?? "Invalid Token",
    };
  }
}
