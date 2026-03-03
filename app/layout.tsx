/* eslint-disable @typescript-eslint/no-explicit-any */
import { HeaderComponent } from "features/common/components/header/header.component";
import {
  DEFAULT_THEME,
  PREFERRED_THEME_NAME,
} from "features/theme/theme.config";
import { MonoFont, PrimaryFont, SecondaryFont } from "libs/theme/fonts";
import { cookies } from "next/headers";
import "libs/theme/styles/globals.scss";
import styles from "./layout.module.scss";
import { MobileHeaderComponent } from "features/common/components/mobile-header/mobile-header.component";
import { FooterComponent } from "features/common/components/footer/footer.component";
import { enLayoutDictionary } from "features/common/components/cookie-consent-modal/dictionary.model";
import { Metadata } from "next";

declare global {
  interface Window {
    OneTrust: any;
    OnetrustActiveGroups: any;
  }
}

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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OpenID Connect Playground</title>
        <meta
          name="description"
          content="The OIDC playground is for developers to test and work with OpenID Connect calls step-by-step, giving them more insight into how OpenID Connect works."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="OpenID Connect Playground" />
        <meta property="og:site_name" content="OpenID Connect Playground" />
        <meta
          property="og:description"
          content="The OIDC playground is for developers to test and work with OpenID Connect calls step-by-step, giving them more insight into how OpenID Connect works."
        />
        <meta property="og:url" content="https://openidconnect.net/" />
        <meta
          property="og:image"
          content="https://openidconnect.net/images/sm-share.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://openidconnect.net/images/sm-share.png"
        />
        <meta property="fb:app_id" content="507756515938786" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@auth0" />
        <meta name="twitter:creator" content="@auth0" />
        <meta name="twitter:title" content="OpenID Connect Playground" />
        <meta
          name="twitter:description"
          content="The OIDC playground is for developers to test and work with OpenID Connect calls step-by-step, giving them more insight into how OpenID Connect works."
        />
        <meta
          name="twitter:image:src"
          content="https://openidconnect.net/images/sm-share.png"
        />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
        <meta
          name="google-site-verification"
          content="tLAuc_2L4oGIS68FVPW-FvFdIxLNYkLBCAb-9PseeWY"
        />
        {/* <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script> */}
      </head>
      <body className={`${PrimaryFont.className} ${SecondaryFont.variable} ${MonoFont.variable}`} data-theme={theme}>
        <HeaderComponent theme={theme} />
        <MobileHeaderComponent theme={theme} />
        <main className={styles.main}>{children}</main>
        <FooterComponent
          dictionary={enLayoutDictionary.footer}
          auth0Logo={enLayoutDictionary.logos.auth0}
          siteLogo={enLayoutDictionary.logos.site}
        />
        {/*  <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N6KSGFBD" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript> */}
        {/* <script>
      window.clientId=JSON.stringify(clientId);
	  window.clientSecret=JSON.stringify(clientSecret);
    </script>
    <script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" type="text/javascript" charset="UTF-8" data-domain-script="642ff5cd-0d1e-4865-bef1-2167332ca61a" id="consent-script"></script>
    <script src="https://assets.adobedtm.com/6bb3f7663515/fea558f43eb7/launch-be034d63605e.min.js" async></script>
    <script src="cookie-consent.js"></script> */}
      </body>
    </html>
  );
}
