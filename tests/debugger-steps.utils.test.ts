import { describe, expect, test } from "vitest";
import {
  InitialDebuggerStepsData,
  bodyFromRequestData,
  getAppData,
  getCompleteUrlFromRequestData,
} from "features/debugger/components/steps/utils";
import type { RequestData } from "features/debugger/components/codeblock/codeblock.component";

describe("getAppData", () => {
  test("returns null auth and debuggerSteps when input is null", () => {
    expect(getAppData(null)).toEqual({ auth: null, debuggerSteps: null });
  });

  test("returns null auth and debuggerSteps when input is an empty string", () => {
    expect(getAppData("")).toEqual({ auth: null, debuggerSteps: null });
  });

  test("fills every debuggerSteps field with defaults for an empty object", () => {
    const { auth, debuggerSteps } = getAppData("{}");

    expect(auth).toBeNull();
    expect(debuggerSteps).toEqual({
      accessToken: undefined,
      audience: undefined,
      authEndpoint: InitialDebuggerStepsData.authEndpoint,
      currentStep: InitialDebuggerStepsData.currentStep,
      discoveryURL: undefined,
      domain: InitialDebuggerStepsData.domain,
      exchangeResult: InitialDebuggerStepsData.exchangeResult,
      idToken: undefined,
      idTokenDecoded: undefined,
      idTokenHeader: InitialDebuggerStepsData.idTokenHeader,
      scopes: InitialDebuggerStepsData.scopes,
      server: InitialDebuggerStepsData.server,
      tokenEndpoint: InitialDebuggerStepsData.tokenEndpoint,
      tokenKeysEndpoint: InitialDebuggerStepsData.tokenKeysEndpoint,
      userInfoEndpoint: InitialDebuggerStepsData.userInfoEndpoint,
      validated: InitialDebuggerStepsData.validated,
    });
  });

  test("overrides defaults with the saved values that are present", () => {
    const saved = JSON.stringify({
      server: "okta",
      domain: "tenant.okta.com",
      scopes: "openid",
      currentStep: 2,
      validated: true,
    });

    const { debuggerSteps } = getAppData(saved);

    expect(debuggerSteps?.server).toBe("okta");
    expect(debuggerSteps?.domain).toBe("tenant.okta.com");
    expect(debuggerSteps?.scopes).toBe("openid");
    expect(debuggerSteps?.currentStep).toBe(2);
    expect(debuggerSteps?.validated).toBe(true);
    expect(debuggerSteps?.tokenEndpoint).toBe(
      InitialDebuggerStepsData.tokenEndpoint,
    );
  });

  test("returns populated auth when clientID is present", () => {
    const saved = JSON.stringify({
      clientID: "abc123",
      clientSecret: "shh",
      stateToken: "state",
      redirectURI: "https://app/callback",
      authCode: "code123",
    });

    const { auth } = getAppData(saved);

    expect(auth).toEqual({
      clientID: "abc123",
      clientSecret: "shh",
      stateToken: "state",
      redirectURI: "https://app/callback",
      authCode: "code123",
    });
  });

  test("returns null auth when clientID is missing but other auth fields exist", () => {
    const saved = JSON.stringify({
      clientSecret: "shh",
      redirectURI: "https://app/callback",
    });

    const { auth } = getAppData(saved);

    expect(auth).toBeNull();
  });

  test("throws when the saved data is not valid JSON", () => {
    expect(() => getAppData("{not-json")).toThrow();
  });

  test("throws when the saved data violates the schema", () => {
    const saved = JSON.stringify({ clientID: 123 });
    expect(() => getAppData(saved)).toThrow();
  });
});

describe("getCompleteUrlFromRequestData", () => {
  test("appends params as a query string", () => {
    const requestData: RequestData = {
      url: "https://example.com/authorize",
      params: [
        { key: "client_id", value: "abc" },
        { key: "scope", value: "openid profile" },
      ],
    };

    expect(getCompleteUrlFromRequestData(requestData)).toBe(
      "https://example.com/authorize?client_id=abc&scope=openid+profile",
    );
  });

  test("returns the url with a trailing question mark when there are no params", () => {
    const requestData: RequestData = {
      url: "https://example.com/authorize",
      params: [],
    };

    expect(getCompleteUrlFromRequestData(requestData)).toBe(
      "https://example.com/authorize?",
    );
  });
});

describe("bodyFromRequestData", () => {
  test("includes the tokenEndpoint and every param key/value", () => {
    const requestData: RequestData = {
      url: "https://example.com/oauth/token",
      params: [
        { key: "code", value: "auth-code" },
        { key: "grant_type", value: "authorization_code" },
      ],
    };

    expect(bodyFromRequestData(requestData)).toEqual({
      tokenEndpoint: "https://example.com/oauth/token",
      code: "auth-code",
      grant_type: "authorization_code",
    });
  });
});
