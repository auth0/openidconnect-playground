import { CLIENT_CONFIG } from "features/analytics/services/config";

const AdobeAnalyticsScript = () => {
  const source = CLIENT_CONFIG.ADOBE_ANALYTICS_URL;
  return source ? (
    <script
      id="adobe-analytics-script"
      type="text/javascript"
      src={source}
      charSet="UTF-8"
      async
    />
  ) : null;
};

export default AdobeAnalyticsScript;
