import { z } from "zod";
import { RequestData } from "../codeblock/codeblock.component";

const AuthSchema = z.object({
  clientID: z.string().nullish(),
  clientSecret: z.string().nullish(),
  stateToken: z.string().nullish(),
  redirectURI: z.string().nullish(),
  authCode: z.string().nullish(),
});

const DebuggerStepsDataSchema = z.object({
  accessToken: z.string().nullish(),
  audience: z.string().nullish(),
  authEndpoint: z.string().nullish(),
  discoveryURL: z.string().nullish(),
  domain: z.string().nullish(),
  exchangeResult: z.string().nullish(),
  idToken: z.string().nullish(),
  idTokenDecoded: z.string().nullish(),
  idTokenHeader: z.string().nullish(),
  scopes: z.string().nullish(),
  server: z.string().nullish(),
  skipScroll: z.string().nullish(),
  tokenEndpoint: z.string().nullish(),
  tokenKeysEndpoint: z.string().nullish(),
  userInfoEndpoint: z.string().nullish(),
  validated: z.boolean().nullish(),
});

export const AppDataSchema = AuthSchema.extend(DebuggerStepsDataSchema.shape);

export type AuthData = z.infer<typeof AuthSchema>;
export type DebuggerStepsData = z.infer<typeof DebuggerStepsDataSchema>;
export type AppData = z.infer<typeof AppDataSchema>;

export const InitialDebuggerStepsData: DebuggerStepsData = {
  server: "Auth0",
  domain: "samples.auth0.com",
  authEndpoint: "https://samples.auth0.com/authorize",
  tokenEndpoint: "https://samples.auth0.com/oauth/token",
  tokenKeysEndpoint: "",
  userInfoEndpoint: "https://samples.auth0.com/userinfo",
  scopes: "openid profile email phone address",
  idTokenHeader: "",
  validated: false,
  exchangeResult: "",
};

export function getAppData(savedData: string | null) {
  if (!savedData) {
    return { auth: null, debuggerSteps: null };
  }
  const parsedData = JSON.parse(savedData);
  const validated = AppDataSchema.parse(parsedData);
  let debuggerSteps: DebuggerStepsData = {
    accessToken: validated.accessToken,
    audience: validated.audience,
    authEndpoint: validated.authEndpoint,
    discoveryURL: validated.discoveryURL,
    domain: validated.domain,
    exchangeResult: validated.exchangeResult,
    idToken: validated.idToken,
    idTokenDecoded: validated.idTokenDecoded,
    idTokenHeader: validated.idTokenHeader,
    scopes: validated.scopes,
    server: validated.server,
    skipScroll: validated.skipScroll,
    tokenEndpoint: validated.tokenEndpoint,
    tokenKeysEndpoint: validated.tokenKeysEndpoint,
    userInfoEndpoint: validated.userInfoEndpoint,
    validated: validated.validated,
  };
  let auth: AuthData = {
    authCode: validated.authCode,
    clientID: validated.clientID,
    clientSecret: validated.clientSecret,
    redirectURI: validated.redirectURI,
    stateToken: validated.stateToken,
  };
  debuggerSteps = Object.values(debuggerSteps).every(
    (value) => value === null || value === undefined || value === "",
  )
    ? null
    : debuggerSteps;
  auth = Object.values(auth).every(
    (value) => value === null || value === undefined || value === "",
  )
    ? null
    : auth;
  return { auth, debuggerSteps };
}

export const getCompleteUrlFromRequestData = (
  requestData: RequestData,
): string => {
  const { url, params } = requestData;
  const completeUrl = `${url}?${params.map((param, idx) => `${idx > 0 ? "&" : ""}${param.key}=${param.key === "scope" ? encodeURI(param.value) : param.value}`).join("")}`;
  return completeUrl;
};
