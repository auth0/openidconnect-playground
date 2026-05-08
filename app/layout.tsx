import { HeaderComponent } from "features/common/components/header/header.component";
import {
  DEFAULT_THEME,
  PREFERRED_THEME_NAME,
} from "features/theme/theme.config";
import { PrimaryFont, MonoFont, SecondaryFont } from "libs/theme/fonts";
import { cookies } from "next/headers";
import "libs/theme/styles/globals.scss";
import styles from "./layout.module.scss"
import { MobileHeaderComponent } from "features/common/components/mobile-header/mobile-header.component";
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
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const preferredThemeCookie = cookieStore.get(PREFERRED_THEME_NAME);
  const theme = preferredThemeCookie?.value || DEFAULT_THEME;
  return (
    <html lang="en">
      <body className={`${PrimaryFont.className} ${MonoFont.variable} ${SecondaryFont.variable}`} data-theme={theme}>
        <HeaderComponent theme={theme} />
        <MobileHeaderComponent theme={theme} />
        <main className={styles.main} >{children}</main>
      </body>
    </html>
  );
}
