import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import signature from "cookie-signature";

const cookieStore = new Map<string, { value: string; options?: unknown }>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const entry = cookieStore.get(name);
      return entry ? { name, value: entry.value } : undefined;
    },
    set: (name: string, value: string, options?: unknown) => {
      cookieStore.set(name, { value, options });
    },
  }),
}));

const { GET } = await import("../app/api/auth_data/route");

const JWT_SECRET = "test-jwt-secret";

const signed = (value: string) => "s:" + signature.sign(value, JWT_SECRET);

describe("GET /api/auth_data", () => {
  beforeEach(() => {
    cookieStore.clear();
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.REDIRECT_URI = "https://app.example.com/callback";
    process.env.CLIENT_ID = "client-123";
    process.env.CLIENT_SECRET = "client-secret";
  });

  afterEach(() => {
    cookieStore.clear();
  });

  test("returns env-backed config and a freshly generated 40-char state", async () => {
    const response = await GET();

    const body = await response.json();
    expect(body.redirect_uri).toBe("https://app.example.com/callback");
    expect(body.clientId).toBe("client-123");
    expect(body.clientSecret).toBe("client-secret");
    expect(body.state).toMatch(/^[0-9a-f]{40}$/);
  });

  test("returns a different state on each call", async () => {
    const first = await (await GET()).json();
    const second = await (await GET()).json();

    expect(first.state).not.toBe(second.state);
  });

  test("returns the authCode and flips refresh to true when refresh is 'false'", async () => {
    cookieStore.set("refresh", { value: signed("false") });
    cookieStore.set("authCode", { value: signed("auth-code-xyz") });

    const response = await GET();
    const body = await response.json();

    expect(body.code).toBe("auth-code-xyz");
    expect(cookieStore.get("refresh")!.value).toBe("true");
  });

  test("returns null code when refresh is not 'false'", async () => {
    cookieStore.set("refresh", { value: signed("true") });
    cookieStore.set("authCode", { value: signed("auth-code-xyz") });

    const response = await GET();
    const body = await response.json();

    expect(body.code).toBeNull();
  });

  test("returns null code when no auth cookies are present", async () => {
    const response = await GET();
    const body = await response.json();

    expect(body.code).toBeNull();
  });
});
