"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGmailService = exports.getGmailToken = exports.getGmailAuthUrl = void 0;
const googleapis_1 = require("googleapis");
const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
const getGmailAuthUrl = () => {
    const scopes = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
};
exports.getGmailAuthUrl = getGmailAuthUrl;
const getGmailToken = async (code) => {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return tokens;
};
exports.getGmailToken = getGmailToken;
const getGmailService = (tokens) => {
    oAuth2Client.setCredentials(tokens);
    return googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
};
exports.getGmailService = getGmailService;
