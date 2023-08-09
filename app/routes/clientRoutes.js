const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Routes
router.get("/stories", clientController.getStoriesList);
router.get("/stories/ongoing", clientController.getStoriesListOngoing);
router.get("/stories/completed", clientController.getStoriesListCompleted);

module.exports = router;