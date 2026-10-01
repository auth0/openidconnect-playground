import { describe, expect, test } from "vitest";
import {
  notFoundActions,
  notFoundContent,
} from "features/common/components/not-found/not-found.model";

describe("notFoundContent", () => {
  test("exposes the 404 code and user-facing copy", () => {
    expect(notFoundContent.code).toBe("404");
    expect(notFoundContent.title).toBeTruthy();
    expect(notFoundContent.description).toBeTruthy();
  });
});

describe("notFoundActions", () => {
  test("links to the debugger and introduction pages in order", () => {
    expect(notFoundActions.map((action) => action.href)).toEqual([
      "/",
      "/introduction",
    ]);
  });

  test("marks only the first action as the primary variant", () => {
    expect(notFoundActions.map((action) => action.variant)).toEqual([
      "default",
      "transparent",
    ]);
  });

  test("only points to internal routes", () => {
    notFoundActions.forEach((action) => {
      expect(action.href.startsWith("/")).toBe(true);
    });
  });
});
