import { PublicClientApplication, Configuration, LogLevel } from "@azure/msal-node";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ConfidentialClientApplication } from "@azure/msal-node";
import dotenv from "dotenv";

dotenv.config();

const config: Configuration = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET || "",
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    },
  },
};

const pca = new ConfidentialClientApplication(config);

export const getOutlookAuthUrl = async (): Promise<string> => {
  const authCodeUrlParameters = {
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri: process.env.OUTLOOK_REDIRECT_URI || "",
  };

  return pca.getAuthCodeUrl(authCodeUrlParameters);
};

export const getOutlookToken = async (code: string) => {
  const tokenRequest = {
    code: code,
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri: process.env.OUTLOOK_REDIRECT_URI || "",
  };

  const response = await pca.acquireTokenByCode(tokenRequest);
  return response?.accessToken;
};

export const getOutlookService = (token: string) => {
  const credential = new TokenCredentialAuthenticationProvider(token, {
    scopes: ["https://graph.microsoft.com/.default"],
  });

  return credential;
};
