const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// List of Stories
router.get("/stories", clientController.getStoriesList);
router.get("/stories/ongoing", clientController.getStoriesListOngoing);
router.get("/stories/completed", clientController.getStoriesListCompleted);

// VIP Stories
router.get("/stories/vip", clientController.getStoryVip);

// Story Chapters
router.get("/stories/details", clientController.getAllDetails);
router.get("/stories/id", clientController.getStoryDetailsById);

// Related Stories
router.get("/stories/related", clientController.getRelatedStoryLists);

// New Arrivals
router.get("/stories/newarrivals", clientController.getStoriesNewArrivals);

// Last Read
router.put("/stories/continue", clientController.putUserLastRead);
router.get("/stories/continue/id", clientController.getUserLastRead);

module.exports = router;