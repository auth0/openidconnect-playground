import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../app/api/code_to_token/route";

const postRequest = (body: unknown) =>
  new NextRequest("http://localhost/api/code_to_token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const mockFetchResponse = (body: unknown, init: { ok?: boolean; status?: number } = {}) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: init.ok ?? true,
      status: init.status ?? 200,
      headers: new Headers(),
      json: async () => body,
    }),
  );
};

describe("POST /api/code_to_token", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env.REDIRECT_URI = "https://app.example.com/callback";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("returns 200 with the token result for an allowed token endpoint", async () => {
    mockFetchResponse({ id_token: "eyJ.payload.sig", access_token: "at-123" });

    const response = await POST(
      postRequest({
        code: "auth-code",
        client_id: "client-1",
        client_secret: "secret",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.result.body.access_token).toBe("at-123");
    expect(body.result.response.statusCode).toBe(200);
  });

  test("returns 500 when the token endpoint hostname is not allow-listed", async () => {
    mockFetchResponse({});

    const response = await POST(
      postRequest({
        code: "auth-code",
        tokenEndpoint: "https://evil.example.com/token",
      }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.message).toBe("Invalid URL: The provided URL is not allowed");
  });

  test("returns 500 when the token endpoint uses a disallowed protocol", async () => {
    mockFetchResponse({});

    const response = await POST(
      postRequest({
        code: "auth-code",
        tokenEndpoint: "ftp://oauth2.googleapis.com/token",
      }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.message).toBe("Invalid URL: The provided URL is not allowed");
  });

  test("returns 500 when the upstream token request is not ok", async () => {
    mockFetchResponse({}, { ok: false, status: 403 });

    const response = await POST(
      postRequest({
        code: "auth-code",
        tokenEndpoint: "https://samples.auth0.com/oauth/token",
      }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.message).toContain("Invalid request");
  });

  test("returns 500 when the token endpoint is not a valid URL", async () => {
    mockFetchResponse({});

    const response = await POST(
      postRequest({ code: "auth-code", tokenEndpoint: "not-a-url" }),
    );

    expect(response.status).toBe(500);
  });
});
