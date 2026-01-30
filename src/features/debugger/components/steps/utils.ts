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
  currentStep: z.number().nullish(),
  discoveryURL: z.string().nullish(),
  domain: z.string().nullish(),
  exchangeResult: z.string().nullish(),
  idToken: z.string().nullish(),
  idTokenDecoded: z.string().nullish(),
  idTokenHeader: z.string().nullish(),
  scopes: z.string().nullish(),
  server: z.string().nullish(),
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
  tokenKeysEndpoint: "https://samples.auth0.com/.well-known/jwks.json",
  userInfoEndpoint: "https://samples.auth0.com/userinfo",
  scopes: "openid profile email phone address",
  idTokenHeader: "",
  validated: false,
  exchangeResult: "",
  currentStep: 0,
};

export function getAppData(savedData: string | null) {
  if (!savedData) {
    return { auth: null, debuggerSteps: null };
  }
  const parsedData = JSON.parse(savedData);
  const validated = AppDataSchema.parse(parsedData);
  const debuggerSteps: DebuggerStepsData = {
    accessToken: validated.accessToken ?? InitialDebuggerStepsData.accessToken,
    audience: validated.audience ?? InitialDebuggerStepsData.audience,
    authEndpoint:
      validated.authEndpoint ?? InitialDebuggerStepsData.authEndpoint,
    discoveryURL:
      validated.discoveryURL ?? InitialDebuggerStepsData.discoveryURL,
    domain: validated.domain ?? InitialDebuggerStepsData.domain,
    exchangeResult:
      validated.exchangeResult ?? InitialDebuggerStepsData.exchangeResult,
    idToken: validated.idToken ?? InitialDebuggerStepsData.idToken,
    idTokenDecoded:
      validated.idTokenDecoded ?? InitialDebuggerStepsData.idTokenDecoded,
    idTokenHeader:
      validated.idTokenHeader ?? InitialDebuggerStepsData.idTokenHeader,
    scopes: validated.scopes ?? InitialDebuggerStepsData.scopes,
    server: validated.server ?? InitialDebuggerStepsData.server,
    tokenEndpoint:
      validated.tokenEndpoint ?? InitialDebuggerStepsData.tokenEndpoint,
    tokenKeysEndpoint:
      validated.tokenKeysEndpoint ?? InitialDebuggerStepsData.tokenKeysEndpoint,
    userInfoEndpoint:
      validated.userInfoEndpoint ?? InitialDebuggerStepsData.userInfoEndpoint,
    validated: validated.validated ?? InitialDebuggerStepsData.validated,
    currentStep: validated.currentStep ?? InitialDebuggerStepsData.currentStep,
  };
  let auth: AuthData | null = {
    authCode: validated.authCode,
    clientID: validated.clientID,
    clientSecret: validated.clientSecret,
    redirectURI: validated.redirectURI,
    stateToken: validated.stateToken,
  };

  auth = Object.values(auth).some(
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
  const searchParams = new URLSearchParams();
  params.forEach(param => {
    searchParams.append(param.key, param.value);
  });
  return `${url}?${searchParams.toString()}`;
};

export const bodyFromRequestData = (requestData: RequestData) => {
    const body = {
      tokenEndpoint: requestData.url,
    };
    requestData.params.forEach((param) => {
      body[`${param.key}`] = param.value;
    });

    return body;
  };
