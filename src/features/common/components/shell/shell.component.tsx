"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

import { GoogleTagManager } from "@next/third-parties/google";

import { COOKIE_LEVELS } from "features/analytics/models/cookie-levels.constants";
import { COOKIE_CONSENT_STATUS } from "features/analytics/models/cookie-consent-status.constants";
import { OnetrustScriptComponent } from "features/analytics/components/onetrust-script.component";
import { CLIENT_CONFIG } from "features/analytics/services/config";
import { saveUTM } from "features/analytics/services/save-utm";
import { AbTestingScriptComponent } from "features/analytics/components/ab-testing-script/ab-testing-script.component";
import AdobeAnalyticsScript from "features/analytics/components/adobe-analytics-script.component";
import { MonoFont, PrimaryFont, SecondaryFont } from "libs/theme/fonts";

declare global {
  interface Window {
    OneTrust: any;
    OnetrustActiveGroups: any;
    digitalData?: Record<string, any>;
    dataLayer?: Object[];
  }
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

interface ShellComponentProps extends PropsWithChildren {
  theme: string;
}

export const ShellComponent: React.FC<ShellComponentProps> = ({
  children,
  theme,
}) => {
  const [consentLevel, setConsentLevel] = useState<string | null>(null);

  const handleConsentChange = useCallback(
    (e: MessageEvent) => {
      if (
        e.data === COOKIE_CONSENT_STATUS.EXPRESSED_CONSENT &&
        window.OnetrustActiveGroups !== consentLevel
      ) {
        setConsentLevel(window.OnetrustActiveGroups);
      }

      if (e.data === COOKIE_CONSENT_STATUS.WAITING_FOR_CONSENT) {
        // eslint-disable-next-line new-cap
        window.OneTrust.OnConsentChanged(() =>
          setConsentLevel(window.OnetrustActiveGroups),
        );
      }
    },
    [consentLevel],
  );

  useEffect(() => {
    window.addEventListener("message", handleConsentChange, false);
    saveUTM();

    return () => window.removeEventListener("message", handleConsentChange);
  }, [handleConsentChange]);

  useEffect(() => {
    try {
      if (typeof localStorage === "undefined") {
        return;
      }

      localStorage.removeItem("lastToken");
      localStorage.removeItem("lastPublicKey");
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <body
      className={`${PrimaryFont.className} ${SecondaryFont.variable} ${MonoFont.variable}`}
      data-theme={theme}
    >
      <OnetrustScriptComponent
        id={CLIENT_CONFIG.DEVELOPERS_DATA_DOMAIN_ID_ONETRUST}
      />
      <AdobeAnalyticsScript />
      {children}
      {consentLevel &&
        consentLevel.includes(COOKIE_LEVELS.NECESSARY.toString()) &&
        process.env.NEXT_PUBLIC_IS_PROD &&
        GTM_ID && (
          <>
            <GoogleTagManager gtmId={GTM_ID} />
            <AbTestingScriptComponent />
          </>
        )}
    </body>
  );
};
