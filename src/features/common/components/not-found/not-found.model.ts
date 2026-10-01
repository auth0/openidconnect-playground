import { linkPagesInfo } from "features/common/components/header/utils";

export type NotFoundAction = {
  id: string;
  label: string;
  href: string;
  variant: "default" | "gradient";
};

const ACTION_IDS = ["debugger", "introduction"] as const;

const variantByIndex = (index: number): NotFoundAction["variant"] =>
  index === 0 ? "default" : "gradient";

export const notFoundContent = {
  code: "404",
  title: "Page not found",
  description:
    "The page you are looking for doesn't exist or has been moved. Head back to the playground to keep exploring OpenID Connect.",
};

export const notFoundActions: ReadonlyArray<NotFoundAction> = ACTION_IDS.flatMap(
  (id) => linkPagesInfo.filter((link) => link.id === id),
).map(({ id, label, pathname }, index) => ({
  id,
  label,
  href: pathname,
  variant: variantByIndex(index),
}));
