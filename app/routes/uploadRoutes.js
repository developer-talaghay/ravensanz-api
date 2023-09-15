const express = require("express");
const router = express.Router();
const uploadPictureController = require("../controllers/uploadController");

router.post("/", uploadPictureController.uploadPicture);

module.exports = router;