const express = require("express");
const router = express.Router();
const uploadPictureController = require("../controllers/uploadController");

router.post("/", uploadPictureController.uploadPicture);
router.get("/get", uploadPictureController.getPictureByUserId);

module.exports = router;