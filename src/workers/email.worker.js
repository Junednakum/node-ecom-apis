import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import sendEmail from '../utils/sendEmail.js';

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'email-queue',
  async (job) => {
    console.log('Job received:', job.name);
    console.log('Job data:', job.data);
    switch (job.name) {
      case 'send-email':
        await sendEmail({
          to: job.data.to,
          subject: job.data.subject,
          html: job.data.html,
        });

        console.log(`Email sent to ${job.data.to}`);
        break;
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.log(`Failed: ${job?.id}`, err);
});