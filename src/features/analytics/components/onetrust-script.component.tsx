import React from "react";

import { COOKIE_CONSENT_STATUS } from "features/analytics/models/cookie-consent-status.constants";

interface OneTrustScriptProps {
  id: string;
}

export const OnetrustScriptComponent: React.FC<OneTrustScriptProps> = ({
  id,
}) =>
  id ? (
    <>
      <script
        id="consent-wrapper"
        dangerouslySetInnerHTML={{
          __html: `
          function OptanonWrapper() {
            var consentStatus = document.getElementById("onetrust-accept-btn-handler")
              ? "${COOKIE_CONSENT_STATUS.WAITING_FOR_CONSENT}"
              : "${COOKIE_CONSENT_STATUS.EXPRESSED_CONSENT}";
            window.top.postMessage(consentStatus, "*");
          }
        `,
        }}
      />
      <script
        id="consent-script"
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        type="text/javascript"
        charSet="UTF-8"
        data-domain-script={id}
        async
      />
    </>
  ) : null;
