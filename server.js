const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('cron');
const {
  deleteData,
  importAllSystemData,
  importTotalsData,
  importDailyData,
} = require('./updateData');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection sucessful.'));

const app = require('./app');

const port = process.env.PORT || 6000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

// Schedule the data update task every day at 00:00
const updateDataJob = new cron.CronJob('0 0 * * *', async () => {
  try {
    await deleteData();
    await importAllSystemData();
    await importTotalsData();
    await importDailyData();
    console.log('Data update successful.');
  } catch (error) {
    console.error('Error updating data:', error);
  }
});

// Start the cron job
updateDataJob.start();

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
