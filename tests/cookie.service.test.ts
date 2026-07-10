// @vitest-environment jsdom
import { beforeEach, describe, expect, test } from "vitest";
import { getCookie, setCookie } from "features/analytics/services/cookie.service";

const clearCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

describe("cookie.service", () => {
  beforeEach(() => {
    clearCookie("token");
    clearCookie("first");
    clearCookie("second");
    clearCookie("json");
  });

  describe("getCookie", () => {
    test("returns null when the cookie does not exist", () => {
      expect(getCookie("token")).toBeNull();
    });

    test("returns the value of a previously set cookie", () => {
      setCookie("token", "abc123");
      expect(getCookie("token")).toBe("abc123");
    });

    test("returns the correct value when multiple cookies are set", () => {
      setCookie("first", "one");
      setCookie("second", "two");

      expect(getCookie("first")).toBe("one");
      expect(getCookie("second")).toBe("two");
    });
  });

  describe("setCookie", () => {
    test("url-encodes the stored value", () => {
      setCookie("json", JSON.stringify({ a: 1 }));
      expect(getCookie("json")).toBe(encodeURIComponent(JSON.stringify({ a: 1 })));
    });

    test("stores the value when a max-age is provided", () => {
      setCookie("token", "with-max-age", 60_000);
      expect(getCookie("token")).toBe("with-max-age");
    });
  });
});
