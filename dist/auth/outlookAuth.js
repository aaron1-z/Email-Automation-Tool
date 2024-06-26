"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutlookService = exports.getOutlookToken = exports.getOutlookAuthUrl = void 0;
const msal_node_1 = require("@azure/msal-node");
const azureTokenCredentials_1 = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const msal_node_2 = require("@azure/msal-node");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
            logLevel: msal_node_1.LogLevel.Verbose,
        },
    },
};
const pca = new msal_node_2.ConfidentialClientApplication(config);
const getOutlookAuthUrl = async () => {
    const authCodeUrlParameters = {
        scopes: ["https://graph.microsoft.com/.default"],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI || "",
    };
    return pca.getAuthCodeUrl(authCodeUrlParameters);
};
exports.getOutlookAuthUrl = getOutlookAuthUrl;
const getOutlookToken = async (code) => {
    const tokenRequest = {
        code: code,
        scopes: ["https://graph.microsoft.com/.default"],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI || "",
    };
    const response = await pca.acquireTokenByCode(tokenRequest);
    return response?.accessToken;
};
exports.getOutlookToken = getOutlookToken;
const getOutlookService = (token) => {
    const credential = new azureTokenCredentials_1.TokenCredentialAuthenticationProvider(token, {
        scopes: ["https://graph.microsoft.com/.default"],
    });
    return credential;
};
exports.getOutlookService = getOutlookService;
