// // routes/story.js
// const express = require('express');
// const router = express.Router();
// const { fetchAndInsertStory, fetchDataAndInsertIntoDatabase } = require('../controllers/storyController');
// const cron = require('node-cron');

// let job;

// // Define your API route
// router.get('/fetch-and-insert', async (req, res) => {
//   fetchDataAndInsertIntoDatabase(); // Call fetchDataAndInsertIntoDatabase
//   fetchAndInsertStory();
  
//   res.json({ message: 'Fetching stories and users, and inserting into the database.' });
// });

// // Schedule the cron job
// function scheduleCronJob() {
//   // Start the job every 12 hours
//   job = cron.schedule('0 */12 * * *', runJob);
//   console.log("Cron job scheduled to start and end every 12 hours.");
// }

// function runJob() {
//   console.log("Cron job running...");

//   try {
//     // Call both fetchAndInsertStory and fetchDataAndInsertIntoDatabase functions
//     fetchDataAndInsertIntoDatabase();
//     fetchAndInsertStory();

//   } catch (error) {
//     console.error("An error occurred:", error.message);

//     // Stop the job due to the error
//     console.log("Stopping cron job due to error.");
//     job.stop();

//     // Restart the job after a 12-hour pause
//     setTimeout(() => {
//       console.log("Restarting cron job...");
//       scheduleCronJob();
//     }, 12 * 3600000); // 12 hours in milliseconds
//     return;
//   }

//   // Stop the job after 30 minutes
//   setTimeout(() => {
//     console.log("Cron job has been stopped.");
//     job.stop();

//     // Restart the job after a 12-hour pause
//     setTimeout(() => {
//       console.log("Restarting cron job...");
//       scheduleCronJob();
//     }, 12 * 3600000); // 12 hours in milliseconds
//   }, 30 * 60000); // 30 minutes in milliseconds
// }

// // Initial scheduling
// scheduleCronJob();

// module.exports = router;



//routes/story.js
const express = require('express');
const router = express.Router();
const { fetchAndInsertStory, fetchDataAndInsertIntoDatabase } = require('../controllers/storyController');
const cron = require('node-cron');

// Define your API route
router.get('/fetch-and-insert', async (req, res) => {
  fetchAndInsertStory();
  fetchDataAndInsertIntoDatabase()
  res.json({ message: 'Fetching stories and inserting into the database.' });
});

// Set up the cron job to run every second
cron.schedule('* * * * * *', async () => {
  try {
    await fetchDataAndInsertIntoDatabase();
    await fetchAndInsertStory();
    
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

module.exports = router;
