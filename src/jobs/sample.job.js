import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('Running every minute');
});