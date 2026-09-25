import { afterEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../app/api/discover/route";

const VALID_DOC = {
  authorization_endpoint: "https://tenant.example.com/authorize",
  token_endpoint: "https://tenant.example.com/token",
  jwks_uri: "https://tenant.example.com/jwks",
  userinfo_endpoint: "https://tenant.example.com/userinfo",
};

const requestFor = (url: string | null) => {
  const target = url
    ? `http://localhost/api/discover?url=${encodeURIComponent(url)}`
    : "http://localhost/api/discover";
  return new NextRequest(target);
};

const mockFetchResponse = (body: unknown, init: { ok?: boolean; status?: number; statusText?: string } = {}) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: init.ok ?? true,
      status: init.status ?? 200,
      statusText: init.statusText ?? "OK",
      json: async () => body,
    }),
  );
};

describe("GET /api/discover", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("returns 400 when the url query parameter is missing", async () => {
    const response = await GET(requestFor(null));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Missing required query parameter "url"');
  });

  test("returns 200 with the parsed document for a valid discovery response", async () => {
    mockFetchResponse(VALID_DOC);

    const response = await GET(requestFor("https://tenant.example.com/.well-known/openid-configuration"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(VALID_DOC);
  });

  test("returns 200 when the optional userinfo_endpoint is absent", async () => {
    const withoutUserInfo = {
      authorization_endpoint: VALID_DOC.authorization_endpoint,
      token_endpoint: VALID_DOC.token_endpoint,
      jwks_uri: VALID_DOC.jwks_uri,
    };
    mockFetchResponse(withoutUserInfo);

    const response = await GET(requestFor("https://tenant.example.com/.well-known/openid-configuration"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.userinfo_endpoint).toBeUndefined();
    expect(body.token_endpoint).toBe(VALID_DOC.token_endpoint);
  });

  test("returns 500 when the upstream response is not ok", async () => {
    mockFetchResponse(null, { ok: false, status: 404, statusText: "Not Found" });

    const response = await GET(requestFor("https://tenant.example.com/missing"));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.message).toContain("Failed to fetch discovery document");
  });

  test("returns 400 when the upstream body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => {
          throw new Error("Unexpected token");
        },
      }),
    );

    const response = await GET(requestFor("https://tenant.example.com/html"));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Discovery document is not a JSON file.");
  });

  test("returns 400 with field errors when the document violates the schema", async () => {
    mockFetchResponse({ authorization_endpoint: "not-a-url", token_endpoint: "https://x/token" });

    const response = await GET(requestFor("https://tenant.example.com/invalid"));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Discovery document is not valid.");
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors.length).toBeGreaterThan(0);
  });
});
