// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { saveUTM } from "features/analytics/services/save-utm";
import { getCookie } from "features/analytics/services/cookie.service";

const COOKIE_NAMES = [
  "_okta_attribution",
  "_okta_session_attribution",
  "_okta_original_attribution",
  "gclid",
];

const clearCookies = () => {
  COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=; path=/; max-age=0`;
  });
};

const setLocation = (search: string, pathname = "/debugger") => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { search, pathname },
  });
};

const readAttribution = (name: string) =>
  JSON.parse(decodeURIComponent(getCookie(name) as string));

describe("saveUTM", () => {
  beforeEach(() => {
    clearCookies();
  });

  afterEach(() => {
    clearCookies();
  });

  test("stores recognized utm params along with page and date", () => {
    setLocation("?utm_source=google&utm_campaign=spring", "/introduction");

    saveUTM();

    const attribution = readAttribution("_okta_attribution");
    expect(attribution.utm_source).toBe("google");
    expect(attribution.utm_campaign).toBe("spring");
    expect(attribution.utm_page).toBe("/introduction");
    expect(typeof attribution.utm_date).toBe("string");
    expect(attribution.utm_date.length).toBeGreaterThan(0);
  });

  test("seeds session and original attribution cookies on first visit", () => {
    setLocation("?utm_medium=email");

    saveUTM();

    expect(readAttribution("_okta_session_attribution").utm_medium).toBe("email");
    expect(readAttribution("_okta_original_attribution").utm_medium).toBe("email");
  });

  test("does not overwrite an existing session attribution cookie", () => {
    document.cookie = "_okta_session_attribution=preexisting; path=/";
    setLocation("?utm_source=bing");

    saveUTM();

    expect(getCookie("_okta_session_attribution")).toBe("preexisting");
    expect(readAttribution("_okta_attribution").utm_source).toBe("bing");
  });

  test("persists a gclid query param when not already stored", () => {
    setLocation("?gclid=abc123");

    saveUTM();

    expect(getCookie("gclid")).toBe("abc123");
  });

  test("ignores unrelated query params", () => {
    setLocation("?foo=bar");

    saveUTM();

    const attribution = readAttribution("_okta_attribution");
    expect(attribution.foo).toBeUndefined();
    expect(attribution.utm_page).toBe("/debugger");
  });
});
