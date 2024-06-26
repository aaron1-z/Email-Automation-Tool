"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    googleOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
        scopes: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
        ],
    },
    outlookOAuth: {
        clientId: process.env.OUTLOOK_CLIENT_ID || '',
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET || '',
        redirectUri: process.env.OUTLOOK_REDIRECT_URI || '',
        scopes: ['https://graph.microsoft.com/.default'],
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
    },
    server: {
        port: process.env.PORT || 3002,
    },
    redis: {
        host: 'localhost', // Redis host
        port: 6379, // Redis port
    },
};
