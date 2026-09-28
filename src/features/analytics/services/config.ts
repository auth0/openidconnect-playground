export const CLIENT_CONFIG = {
  DEVELOPERS_DATA_DOMAIN_ID_ONETRUST:
    process.env.NEXT_PUBLIC_ONETRUST_DOMAIN_ID ?? "",
  ADOBE_ANALYTICS_URL: process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_URL ?? "",
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID ?? "",
};

const missing = Object.entries(CLIENT_CONFIG)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.warn(
    `[analytics] Missing configuration: ${missing.join(", ")}. The matching tags will not be rendered.`,
  );
}
