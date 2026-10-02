import type { Metadata } from "next";
import { NotFoundComponent } from "features/common/components/not-found/not-found.component";

export const metadata: Metadata = {
  title: "Page not found | OpenID Connect Playground",
};

export default function NotFound() {
  return <NotFoundComponent />;
}
