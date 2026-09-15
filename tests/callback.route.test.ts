import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
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

const { GET } = await import("../app/api/callback/route");

const JWT_SECRET = "test-jwt-secret";

const requestFor = (query: string) =>
  new NextRequest(`http://localhost/api/callback${query}`);

describe("GET /api/callback", () => {
  beforeEach(() => {
    cookieStore.clear();
    process.env.JWT_SECRET = JWT_SECRET;
  });

  afterEach(() => {
    cookieStore.clear();
  });

  test("sets signed authCode and refresh cookies then redirects home for a code", async () => {
    const response = await GET(requestFor("?code=the-auth-code"));

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("http://localhost/");

    const authCode = cookieStore.get("authCode");
    const refresh = cookieStore.get("refresh");
    expect(signature.unsign(authCode!.value.slice(2), JWT_SECRET)).toBe("the-auth-code");
    expect(signature.unsign(refresh!.value.slice(2), JWT_SECRET)).toBe("false");
  });

  test("redirects with the error param when an error is returned", async () => {
    const response = await GET(requestFor("?error=access_denied"));

    expect(response.status).toBe(302);
    const location = new URL(response.headers.get("location") as string);
    expect(location.searchParams.get("error")).toBe("access_denied");
    expect(cookieStore.size).toBe(0);
  });

  test("includes error_description in the redirect when present", async () => {
    const response = await GET(
      requestFor("?error=access_denied&error_description=User%20declined"),
    );

    const location = new URL(response.headers.get("location") as string);
    expect(location.searchParams.get("error")).toBe("access_denied");
    expect(location.searchParams.get("error_description")).toBe("User declined");
  });

  test("returns 400 when neither code nor error is present", async () => {
    const response = await GET(requestFor(""));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Bad Request: Missing required parameter "code"');
  });
});
