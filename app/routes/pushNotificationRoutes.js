const express = require("express");
const router = express.Router();
const pushNotificationController = require("../controllers/pushNotification");

router.post("/", pushNotificationController.sendPushNotification);

module.exports = router;
