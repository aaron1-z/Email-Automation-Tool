import { Queue, Worker } from 'bullmq';
import { categorizeEmail, generateReply } from '../processors/emailProcessor';
import { RedisOptions } from 'ioredis';

// Define Redis connection options
const redisConnection: RedisOptions = {
  host: 'localhost', // Redis host
  port: 6379,        // Redis port
};

// Create a new Queue instance with Redis connection
export const emailQueue = new Queue('emailQueue', {
  connection: redisConnection,
});

// Define a custom processor function for BullMQ Worker
const processEmailJob = async (job: any) => {
  if (!job) {
    console.error('Received undefined job');
    return;
  }

  const { emailText } = job.data;

  // Simulate job processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Process email (categorization and reply generation)
  const category = await categorizeEmail(emailText);
  const reply = await generateReply(emailText);

  // For demonstration purposes, just log the output
  console.log(`Email processed. Category: ${category}, Reply: ${reply}`);
};

// Create a new Worker instance for the emailQueue
export const emailWorker = new Worker('emailQueue', async job => {
  try {
    // Process job
    await processEmailJob(job);
  } catch (error) {
    console.error('Error processing job:', error);
  }
}, {
  connection: redisConnection,
});
