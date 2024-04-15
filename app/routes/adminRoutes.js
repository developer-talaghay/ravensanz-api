const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes
router.get("/story", adminController.getStories);
router.post("/story", adminController.createStory);
router.delete("/story", adminController.deleteStory);
router.patch("/story/:id", adminController.updateStory);


module.exports = router;