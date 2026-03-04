import "libs/theme/styles/globals.scss";
import { Metadata } from "next";

const title = "OpenID Connect Playground";
const description =
  "The OIDC playground is for developers to test and work with OpenID Connect calls step-by-step, giving them more insight into how OpenID Connect works";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://openidconnect.net"),
  openGraph: {
    type: "website",
    title: "OpenID Connect Playground",
    siteName: "OpenID Connect Playground",
    description,
    url: "https://openidconnect.net",
    images: [
      {
        url: "/images/sm-share.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@auth0",
    creator: "@auth0",
    title,
    description,
    images: ["/images/sm-share.png"],
  },
  other: {
    "fb:app_id": "507756515938786",
    "google-site-verification": "tLAuc_2L4oGIS68FVPW-FvFdIxLNYkLBCAb-9PseeWY",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
