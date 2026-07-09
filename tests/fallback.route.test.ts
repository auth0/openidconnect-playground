import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";

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

const { GET } = await import("../app/api/fallback/route");

const request = () => new NextRequest("http://localhost/api/fallback");

describe("GET /api/fallback", () => {
  beforeEach(() => {
    cookieStore.clear();
  });

  afterEach(() => {
    cookieStore.clear();
  });

  test("redirects home", async () => {
    const response = await GET(request());

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  test("sets refresh to true when authCode exists and refresh is absent", async () => {
    cookieStore.set("authCode", { value: "some-code" });

    await GET(request());

    expect(cookieStore.get("refresh")!.value).toBe("true");
  });

  test("does not set refresh when authCode is absent", async () => {
    await GET(request());

    expect(cookieStore.has("refresh")).toBe(false);
  });

  test("does not overwrite refresh when it already exists", async () => {
    cookieStore.set("authCode", { value: "some-code" });
    cookieStore.set("refresh", { value: "existing" });

    await GET(request());

    expect(cookieStore.get("refresh")!.value).toBe("existing");
  });
});
