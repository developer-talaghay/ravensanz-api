const express = require('express');
const router = express.Router();
const chapterCreationController = require('../controllers/chapterCreationController');

// Admin Story Chapter Creation
router.get("/story", chapterCreationController.getStoryEpisodes);
router.post("/story/chapter", chapterCreationController.createStoryEpisodes);
router.put("/story/chapter/update", chapterCreationController.updateStoryEpisodes);
router.delete("/story/chapter/delete", chapterCreationController.deleteStoryEpisodes);

module.exports = router;