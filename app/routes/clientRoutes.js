const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// List of Stories
router.get("/stories", clientController.getStoriesList);
router.get("/stories/ongoing", clientController.getStoriesListOngoing);
router.get("/stories/completed", clientController.getStoriesListCompleted);

// Story Chapters
router.get("/stories/details", clientController.getAllDetails);
router.get("/stories/id", clientController.getStoryDetailsById);

// Related Stories
router.get("/stories/related", clientController.getRelatedStoryLists);

// New Arrivals
router.get("/stories/newarrivals", clientController.getStoriesNewArrivals);

module.exports = router;