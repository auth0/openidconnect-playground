import { beforeAll, describe, expect, test } from "vitest";
import { exportJWK, exportPKCS8, generateKeyPair, type JWK } from "jose";
import jwt from "jsonwebtoken";
import { convertJwkToPem, verify } from "../app/api/validate/utils";

const HS_SECRET = "super-secret-value";
const PAYLOAD = { sub: "1234567890", name: "John Doe", admin: true };

let publicJwk: JWK;
let privatePem: string;

beforeAll(async () => {
  const { publicKey, privateKey } = await generateKeyPair("RS256", {
    extractable: true,
  });
  publicJwk = await exportJWK(publicKey);
  privatePem = await exportPKCS8(privateKey);
});

describe("convertJwkToPem", () => {
  test("converts an RSA public JWK into an SPKI PEM", async () => {
    const pem = await convertJwkToPem(publicJwk);

    expect(pem.startsWith("-----BEGIN PUBLIC KEY-----")).toBe(true);
    expect(pem.trimEnd().endsWith("-----END PUBLIC KEY-----")).toBe(true);
  });
});

describe("verify", () => {
  test("returns ok with the decoded payload for a valid HS256 token", async () => {
    const token = jwt.sign(PAYLOAD, HS_SECRET, { algorithm: "HS256" });

    const result = await verify(token, HS_SECRET);

    expect(result.ok).toBe(true);
    if (result.ok) {
      const decoded = result.decoded as jwt.JwtPayload;
      expect(decoded.sub).toBe("1234567890");
      expect(decoded.name).toBe("John Doe");
      expect(decoded.admin).toBe(true);
    }
  });

  test("returns an error for a token signed with a different secret", async () => {
    const token = jwt.sign(PAYLOAD, "another-secret", { algorithm: "HS256" });

    const result = await verify(token, HS_SECRET);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("invalid signature");
    }
  });

  test("returns an error for an expired token", async () => {
    const token = jwt.sign(PAYLOAD, HS_SECRET, {
      algorithm: "HS256",
      expiresIn: -10,
    });

    const result = await verify(token, HS_SECRET);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("jwt expired");
    }
  });

  test("returns an error for a malformed token", async () => {
    const result = await verify("not-a-jwt", HS_SECRET);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("jwt malformed");
    }
  });

  test("verifies an RS256 token using a PEM converted from the public JWK", async () => {
    const token = jwt.sign(PAYLOAD, privatePem, { algorithm: "RS256" });
    const pem = await convertJwkToPem(publicJwk);

    const result = await verify(token, pem);

    expect(result.ok).toBe(true);
    if (result.ok) {
      const decoded = result.decoded as jwt.JwtPayload;
      expect(decoded.sub).toBe("1234567890");
    }
  });
});
