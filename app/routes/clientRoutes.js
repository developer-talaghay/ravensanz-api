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

// story_episodes views
router.post("/stories/episodes", clientController.insertEpisodes);
router.get("/stories/episodes/id", clientController.getEpisodeViewsByUser);

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

// User interaction likes
router.post("/stories/like", clientController.likeStory);
router.delete("/stories/unlike", clientController.unlikeStory);
router.get("/stories/liked", clientController.getLikedStories);

//user interaction comments
router.post("/stories/comments", clientController.commentStory);
router.post("/stories/replycomment", clientController.replyCommentStory);
router.put("/stories/comments/update", clientController.updateCommentStory);
router.get("/stories/comments/get", clientController.getAllComments);
router.post("/stories/comments/like", clientController.likeComment);
router.get("/stories/comments/getlike", clientController.getLikedComment);
router.delete("/stories/comments/unlike", clientController.unlikeComment);
router.delete("/stories/comments/delete", clientController.deleteComment);
router.post("/stories/comments/flag", clientController.flagComment);

// user wings
router.post("/stories/wings", clientController.purchaseStoryWithWings);
router.get("/stories/getWings", clientController.getWingsByUser);
router.post("/stories/wingstopup", clientController.purchaseWings);

//user subcribe update
router.post("/user/subscribe", clientController.subscribeUser);

//Story Chapters Pagination
router.get("/stories/page", clientController.getStoryByPage);
router.get("/stories/page2", clientController.getStoryByPage2);

// user follows
router.post("/stories/followauthor", clientController.followAuthor);
router.post("/stories/unfollowauthor", clientController.unfollowAuthor);
router.get("/stories/following", clientController.viewFollows);
// router.get("/stories/followers", clientController.viewFollows);

module.exports = router;