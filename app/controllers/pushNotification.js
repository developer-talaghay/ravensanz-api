const admin = require("firebase-admin");
const UserModel = require('../models/pushNotificationModel');

const pushNotificationController = {};

pushNotificationController.sendPushNotification = (req, res) => {
  const { title, body } = req.body;

  UserModel.getDeviceTokens((error, deviceTokens) => {
    if (error) {
      console.error("Error getting device tokens: ", error);
      return res.status(500).send({ message: "Error getting device tokens" });
    }

    // Ensure title and body are present in the request body; use default values if not provided
    const message = {
      data: {
        title: title || "Default Title",
        body: body || "Default Body",
      },
    };

    // Send push notification to all devices
    admin.messaging().sendToDevice(deviceTokens, message)
      .then(response => {
        console.log('Successfully sent push notification:', response);
        res.status(200).send('Push notification sent successfully');
      })
      .catch(error => {
        console.error('Error sending push notification:', error);
        res.status(500).send('Error sending push notification');
      });
  });
};

module.exports = pushNotificationController;
