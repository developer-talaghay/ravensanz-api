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
router.post("/stories/continue", clientController.insertStoryId);
router.get("/stories/continue/id", clientController.getStoryDetails);

// Story Search
router.get("/stories/search", clientController.searchByTitleOrAuthor);

// Story Published
router.get("/stories/published", clientController.getStoriesPublished);

// Search 
router.get("/stories/ongoing/search", clientController.searchByTitleOrAuthorOngoing);
router.get("/stories/completed/search", clientController.searchByTitleOrAuthorCompleted);
router.get("/stories/new/search", clientController.searchByTitleOrAuthorNew);
router.get("/stories/vip/search", clientController.searchByTitleOrAuthorVip);
router.get("/stories/continue/search", clientController.searchByTitleOrAuthorContinue);

// User interaction
router.post("/stories/like", clientController.likeStory);
router.delete("/stories/unlike", clientController.unlikeStory);
router.get("/stories/liked", clientController.getLikedStories);

module.exports = router;