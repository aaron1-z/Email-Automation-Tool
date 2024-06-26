import express, { Request, Response } from 'express';
import { getGmailAuthUrl, getGmailToken, getGmailService } from './auth/gmailAuth';
import { getOutlookAuthUrl, getOutlookToken, getOutlookService } from './auth/outlookAuth';
import { emailQueue, emailWorker } from './bullmq/bullmqSetup';
import { categorizeEmail, generateReply } from './processors/emailProcessor';
import { saveToken, getToken } from './utils/tokenStore';

const app = express();
app.use(express.json());

// Routes for authentication
app.get('/auth/gmail', (req: Request, res: Response) => {
  const url = getGmailAuthUrl();
  res.redirect(url);
});

app.get('/auth/outlook', async (req: Request, res: Response) => {
  const url = await getOutlookAuthUrl();
  res.redirect(url);
});

// Authentication callback routes
app.get('/auth/gmail/callback', async (req: Request, res: Response) => {
  const tokens = await getGmailToken(req.query.code as string);
  saveToken('gmail', tokens);
  res.send('Gmail authenticated!');
});

app.get('/auth/outlook/callback', async (req: Request, res: Response) => {
  const token = await getOutlookToken(req.query.code as string);
  saveToken('outlook', token);
  res.send('Outlook authenticated!');
});

// Endpoint for receiving incoming emails
app.post('/incoming-email', async (req: Request, res: Response) => {
  const { emailText } = req.body;
  await emailQueue.add('processEmail', { emailText });
  res.send('Email received and queued for processing');
});

// Worker processing completed jobs
emailWorker.on('completed', async (job: any) => {
  try {
    const { emailText } = job.data;
    const category = await categorizeEmail(emailText);
    const reply = await generateReply(emailText);

    const gmailTokens = getToken('gmail');
    const outlookToken = getToken('outlook');

    if (gmailTokens) {
      const gmailService = getGmailService(gmailTokens);
      // Send reply via Gmail service
      // Example: await gmailService.sendEmail(...);
    }

    if (outlookToken) {
      const outlookService = getOutlookService(outlookToken);
      // Send reply via Outlook service
      // Example: await outlookService.sendEmail(...);
    }
  } catch (error) {
    console.error('Error processing email:', error);
  }
});

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from server.ts!');
});

// Start server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
