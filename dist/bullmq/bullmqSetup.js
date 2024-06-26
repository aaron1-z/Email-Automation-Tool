"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const emailProcessor_1 = require("../processors/emailProcessor");
// Define Redis connection options
const redisConnection = {
    host: 'localhost', // Redis host
    port: 6379, // Redis port
};
// Create a new Queue instance with Redis connection
exports.emailQueue = new bullmq_1.Queue('emailQueue', {
    connection: redisConnection,
});
// Define a custom processor function for BullMQ Worker
const processEmailJob = async (job) => {
    if (!job) {
        console.error('Received undefined job');
        return;
    }
    const { emailText } = job.data;
    // Simulate job processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Process email (categorization and reply generation)
    const category = await (0, emailProcessor_1.categorizeEmail)(emailText);
    const reply = await (0, emailProcessor_1.generateReply)(emailText);
    // For demonstration purposes, just log the output
    console.log(`Email processed. Category: ${category}, Reply: ${reply}`);
};
// Create a new Worker instance for the emailQueue
exports.emailWorker = new bullmq_1.Worker('emailQueue', async (job) => {
    try {
        // Process job
        await processEmailJob(job);
    }
    catch (error) {
        console.error('Error processing job:', error);
    }
}, {
    connection: redisConnection,
});
