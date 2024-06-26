"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gmailAuth_1 = require("./auth/gmailAuth");
const outlookAuth_1 = require("./auth/outlookAuth");
const bullmqSetup_1 = require("./bullmq/bullmqSetup");
const emailProcessor_1 = require("./processors/emailProcessor");
const tokenStore_1 = require("./utils/tokenStore");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Routes for authentication
app.get('/auth/gmail', (req, res) => {
    const url = (0, gmailAuth_1.getGmailAuthUrl)();
    res.redirect(url);
});
app.get('/auth/outlook', async (req, res) => {
    const url = await (0, outlookAuth_1.getOutlookAuthUrl)();
    res.redirect(url);
});
// Authentication callback routes
app.get('/auth/gmail/callback', async (req, res) => {
    const tokens = await (0, gmailAuth_1.getGmailToken)(req.query.code);
    (0, tokenStore_1.saveToken)('gmail', tokens);
    res.send('Gmail authenticated!');
});
app.get('/auth/outlook/callback', async (req, res) => {
    const token = await (0, outlookAuth_1.getOutlookToken)(req.query.code);
    (0, tokenStore_1.saveToken)('outlook', token);
    res.send('Outlook authenticated!');
});
// Endpoint for receiving incoming emails
app.post('/incoming-email', async (req, res) => {
    const { emailText } = req.body;
    await bullmqSetup_1.emailQueue.add('processEmail', { emailText });
    res.send('Email received and queued for processing');
});
// Worker processing completed jobs
bullmqSetup_1.emailWorker.on('completed', async (job) => {
    try {
        const { emailText } = job.data;
        const category = await (0, emailProcessor_1.categorizeEmail)(emailText);
        const reply = await (0, emailProcessor_1.generateReply)(emailText);
        const gmailTokens = (0, tokenStore_1.getToken)('gmail');
        const outlookToken = (0, tokenStore_1.getToken)('outlook');
        if (gmailTokens) {
            const gmailService = (0, gmailAuth_1.getGmailService)(gmailTokens);
            // Send reply via Gmail service
            // Example: await gmailService.sendEmail(...);
        }
        if (outlookToken) {
            const outlookService = (0, outlookAuth_1.getOutlookService)(outlookToken);
            // Send reply via Outlook service
            // Example: await outlookService.sendEmail(...);
        }
    }
    catch (error) {
        console.error('Error processing email:', error);
    }
});
// Default route
app.get('/', (req, res) => {
    res.send('Hello from server.ts!');
});
// Start server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
