"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

import { COOKIE_LEVELS } from "features/analytics/models/cookie-levels.constants";
import { COOKIE_CONSENT_STATUS } from "features/analytics/models/cookie-consent-status.constants";
import { saveUTM } from "features/analytics/services/save-utm";
import { AbTestingScriptComponent } from "features/analytics/components/ab-testing-script/ab-testing-script.component";
import { MonoFont, PrimaryFont, SecondaryFont } from "libs/theme/fonts";

declare global {
  interface Window {
    OneTrust: any;
    OnetrustActiveGroups: any;
    digitalData?: Record<string, any>;
    dataLayer?: Object[];
  }
}

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
      {children}
      {consentLevel &&
        consentLevel.includes(COOKIE_LEVELS.NECESSARY.toString()) && (
          <AbTestingScriptComponent />
        )}
    </body>
  );
};
