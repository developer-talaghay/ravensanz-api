const express = require("express");
const router = express.Router();
const pushNotificationController = require("../controllers/pushNotification");

router.post("/", pushNotificationController.sendPushNotification);
router.post("/specific", pushNotificationController.sendSpecificPushNotification);

module.exports = router;
