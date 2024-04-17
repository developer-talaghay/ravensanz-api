const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes

router.post("/login", adminController.login);
router.get("/genre", adminController.getGenres);
router.get("/author", adminController.getAuthors);

router.get("/story", adminController.getStories);
router.post("/story", adminController.createStory);
router.delete("/story", adminController.deleteStory);
router.patch("/story/:id", adminController.updateStory);

router.post("/uploadBookCover", adminController.uploadBookCover);

module.exports = router;