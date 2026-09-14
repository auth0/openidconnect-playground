import { expect, test } from "@playwright/test";

// The real happy path begins with a redirect to an external OpenID Connect
// provider, which then redirects back with an authorization code. That hop is
// outside our control, so we simulate the post-redirect state: api/auth_data
// returns a `code`, which makes the debugger jump straight to step 2.
const AUTH_DATA = {
  clientId: "client-123",
  clientSecret: "client-secret",
  state: "state-token",
  redirect_uri: "http://localhost:3000/api/callback",
  code: "auth-code-xyz",
};

// id_token header must base64-decode to JSON exposing `.alg` (step 2 reads it).
const ID_TOKEN_HEADER = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
const ID_TOKEN = `${ID_TOKEN_HEADER}.eyJzdWIiOiJhdXRoMHxoYXBweS1wYXRoIn0.signature`;

const CODE_TO_TOKEN_RESPONSE = {
  result: {
    response: {
      statusCode: 200,
      body: { id_token: ID_TOKEN, access_token: "access-token-abc", token_type: "Bearer" },
    },
  },
};

const DECODED_PAYLOAD = { sub: "auth0|happy-path", iss: "https://samples.auth0.com/", aud: "client-123" };

test.describe("debugger happy path", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth_data", (route) =>
      route.fulfill({ json: AUTH_DATA }),
    );
    await page.route("**/api/code_to_token", (route) =>
      route.fulfill({ json: CODE_TO_TOKEN_RESPONSE }),
    );
    await page.route("**/api/validate", (route) =>
      route.fulfill({ json: { decoded: DECODED_PAYLOAD } }),
    );
  });

  test("walks from code exchange through token validation to the decoded payload", async ({ page }) => {
    // Arrange: landing with a code advances the debugger to step 2.
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Exchange" })).toBeVisible();

    // Act: exchange the authorization code for tokens.
    await page.getByRole("button", { name: "Exchange" }).click();

    // Assert: the next action surfaces once the exchange resolves.
    await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();

    // Act: advance to token verification and verify.
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Verify" }).click();

    // Assert: step 4 shows the decoded payload returned by api/validate.
    await expect(page.getByText("Decoded Token Payload")).toBeVisible();
    await expect(page.getByText("auth0|happy-path")).toBeVisible();
  });
});
