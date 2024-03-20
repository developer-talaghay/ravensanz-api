const express = require('express');
const router = express.Router();
const chapterCreationController = require('../controllers/chapterCreationController');

// Admin Story Chapter Creation
router.get("/story", chapterCreationController.getStoryEpisodes);
router.get("/story/chapter/:chapterId", chapterCreationController.getChapterById);
router.post("/story/chapter", chapterCreationController.createStoryEpisodes);
router.put("/story/chapter/update", chapterCreationController.updateStoryEpisodes);
router.delete("/story/chapter/delete", chapterCreationController.deleteStoryEpisodes);

router.get("/story/chapters", chapterCreationController.getPublishedEpisodeCount);

module.exports = router;