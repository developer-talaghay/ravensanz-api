// routes/story.js
const express = require('express');
const router = express.Router();
const { fetchAndInsertStory } = require('../controllers/storyController');
const cron = require('node-cron');

// Define your API route
router.get('/fetch-and-insert', async (req, res) => {
  fetchAndInsertStory();
  res.json({ message: 'Fetching stories and inserting into the database.' });
});

// Schedule the cron job to run every 5 minutes
cron.schedule('*/1 * * * *', fetchAndInsertStory);

module.exports = router;
