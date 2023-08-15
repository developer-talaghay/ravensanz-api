// routes/story.js
const express = require('express');
const router = express.Router();
const { fetchAndInsertStory } = require('../controllers/storyController');
const cron = require('node-cron');

let job;

// Define your API route
router.get('/fetch-and-insert', async (req, res) => {
  fetchAndInsertStory();
  res.json({ message: 'Fetching stories and inserting into the database.' });
});

// Schedule the cron job
function scheduleCronJob() {
  // Start the job every hour
  job = cron.schedule('0 * * * *', runJob);
  console.log("Cron job scheduled to start every 1 hour.");
}

function runJob() {
  console.log("Cron job running...");

  // Call the fetchAndInsertStory function
  fetchAndInsertStory();

  // Stop the job after 1 hour
  setTimeout(() => {
    console.log("Cron job has been stopped.");
    job.stop();

    // Restart the job after a 1-hour pause
    setTimeout(() => {
      scheduleCronJob();
    }, 3600000); // 1 hour in milliseconds
  }, 3600000); // Stop after 1 hour
}

scheduleCronJob(); // Initial scheduling

module.exports = router;
