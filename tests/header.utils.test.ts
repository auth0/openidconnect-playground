import { describe, expect, test } from "vitest";
import { linkPagesInfo } from "features/common/components/header/utils";

describe("linkPagesInfo", () => {
  test("exposes the three navigation links in order", () => {
    const ids = linkPagesInfo.map((link) => link.id);
    expect(ids).toEqual(["debugger", "introduction", "community"]);
  });

  test("internal links have no isExternal flag and use relative pathnames", () => {
    const debugger_ = linkPagesInfo.find((link) => link.id === "debugger");
    const introduction = linkPagesInfo.find((link) => link.id === "introduction");

    expect(debugger_).toEqual({ id: "debugger", label: "Debugger", pathname: "/" });
    expect(introduction).toEqual({
      id: "introduction",
      label: "Introduction",
      pathname: "/introduction",
    });
  });

  test("external links are flagged and use absolute URLs", () => {
    const externals = linkPagesInfo.filter((link) => link.isExternal === true);

    expect(externals).toHaveLength(1);
    expect(externals.map((link) => link.id)).toEqual(["community"]);
    externals.forEach((link) => {
      expect(link.pathname.startsWith("https://")).toBe(true);
    });
  });
});
