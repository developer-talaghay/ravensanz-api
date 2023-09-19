const express = require('express');
const router = express.Router();
const theNestControllers = require('../controllers/theNestController');

// Reading List
router.post("/mystories", theNestControllers.myReadingList);
router.get("/getmystories", theNestControllers.getMyStoryList);
router.get("/getmyvipstories", theNestControllers.getMyVipStoryList);
router.delete("/mystories/delete", theNestControllers.deleteFromMyReadingList);

module.exports = router;