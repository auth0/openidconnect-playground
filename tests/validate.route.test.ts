import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { exportJWK, exportPKCS8, generateKeyPair, type JWK } from "jose";
import jwt from "jsonwebtoken";
import { POST } from "../app/api/validate/route";

const HS_SECRET = "super-secret-value";
const PAYLOAD = { sub: "1234567890", name: "John Doe" };
const KID = "test-key-id";

let publicJwk: JWK;
let privatePem: string;

const postRequest = (body: unknown) =>
  new NextRequest("http://localhost/api/validate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const mockJwksFetch = (keys: unknown, init: { ok?: boolean; statusText?: string } = {}) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: init.ok ?? true,
      statusText: init.statusText ?? "OK",
      json: async () => ({ keys }),
    }),
  );
};

beforeAll(async () => {
  const { publicKey, privateKey } = await generateKeyPair("RS256", {
    extractable: true,
  });
  publicJwk = await exportJWK(publicKey);
  publicJwk.kid = KID;
  privatePem = await exportPKCS8(privateKey);
});

describe("POST /api/validate", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("returns 400 when idToken is missing", async () => {
    const response = await POST(postRequest({}));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Missing idToken param.");
  });

  test("returns 400 when the token cannot be decoded", async () => {
    const response = await POST(postRequest({ idToken: "not-a-jwt" }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Invalid token header.");
  });

  test("returns 200 with the decoded payload for a valid HS256 token", async () => {
    const idToken = jwt.sign(PAYLOAD, HS_SECRET, { algorithm: "HS256" });

    const response = await POST(postRequest({ idToken, clientSecret: HS_SECRET }));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.decoded.sub).toBe("1234567890");
  });

  test("returns 400 when an HS256 token is missing the clientSecret", async () => {
    const idToken = jwt.sign(PAYLOAD, HS_SECRET, { algorithm: "HS256" });

    const response = await POST(postRequest({ idToken }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toContain("clientSecret param is missing");
  });

  test("returns 401 when an HS256 token signature is invalid", async () => {
    const idToken = jwt.sign(PAYLOAD, "different-secret", { algorithm: "HS256" });

    const response = await POST(postRequest({ idToken, clientSecret: HS_SECRET }));

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.message).toBe("invalid signature");
  });

  test("decodes an auth0 HS256 token by base64-decoding the clientSecret", async () => {
    const rawSecret = "auth0-shared-secret";
    const idToken = jwt.sign(PAYLOAD, rawSecret, { algorithm: "HS256" });
    const base64Secret = Buffer.from(rawSecret).toString("base64");

    const response = await POST(
      postRequest({ idToken, clientSecret: base64Secret, server: "auth0" }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.decoded.sub).toBe("1234567890");
  });

  test("returns 400 when an RS256 token is missing the tokenKeysEndpoint", async () => {
    const idToken = jwt.sign(PAYLOAD, privatePem, {
      algorithm: "RS256",
      keyid: KID,
    });

    const response = await POST(postRequest({ idToken }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toContain("tokenKeysEndpoint param is missing");
  });

  test("returns 400 when an RS256 token has no kid header", async () => {
    const idToken = jwt.sign(PAYLOAD, privatePem, { algorithm: "RS256" });

    const response = await POST(
      postRequest({ idToken, tokenKeysEndpoint: "https://tenant.example.com/jwks" }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toContain("kid header is missing");
  });

  test("returns 400 when no JWKS key matches the token kid", async () => {
    const idToken = jwt.sign(PAYLOAD, privatePem, {
      algorithm: "RS256",
      keyid: KID,
    });
    mockJwksFetch([{ ...publicJwk, kid: "other-kid" }]);

    const response = await POST(
      postRequest({ idToken, tokenKeysEndpoint: "https://tenant.example.com/jwks" }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toContain("No public key found with matching kid");
  });

  test("returns 200 with the decoded payload for a valid RS256 token", async () => {
    const idToken = jwt.sign(PAYLOAD, privatePem, {
      algorithm: "RS256",
      keyid: KID,
    });
    mockJwksFetch([publicJwk]);

    const response = await POST(
      postRequest({ idToken, tokenKeysEndpoint: "https://tenant.example.com/jwks" }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.decoded.sub).toBe("1234567890");
  });

  test("returns 500 when the JWKS endpoint responds with an error", async () => {
    const idToken = jwt.sign(PAYLOAD, privatePem, {
      algorithm: "RS256",
      keyid: KID,
    });
    mockJwksFetch([], { ok: false, statusText: "Service Unavailable" });

    const response = await POST(
      postRequest({ idToken, tokenKeysEndpoint: "https://tenant.example.com/jwks" }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.message).toContain("Failed to fetch keys");
  });
});
