const express = require('express');
const router = express.Router();
const chapterCreationController = require('../controllers/chapterCreationController');

// Reading List
router.get("/story", chapterCreationController.getStoryEpisodes);

module.exports = router;