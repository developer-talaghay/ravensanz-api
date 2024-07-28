const express = require('express');
const router = express.Router();
const inApp = require('../controllers/inAppNotifController');

router.get("/specific", inApp.getSpecificNotifications);
router.get("/general", inApp.getAllGeneralNotifications);
router.post("/", inApp.createNotification);
router.post("/general", inApp.createGeneralNotification);
router.post("/general/all", inApp.createGeneralNotificationForAllUsers);
router.put("/update", inApp.updateNotificationStatus);
router.put("/mobile", inApp.updateNotificationStatusMobile);
router.delete("/delete", inApp.deleteNotification);
router.delete("/delete/all", inApp.deleteAllNotificationsByUserId);

module.exports = router;