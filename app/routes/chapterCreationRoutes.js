const express = require('express');
const router = express.Router();
const chapterCreationController = require('../controllers/chapterCreationController');

// Admin Story Chapter Creation
router.get("/story", chapterCreationController.getStoryEpisodes);
router.post("/story/chapter", chapterCreationController.createStoryEpisodes);

module.exports = router;