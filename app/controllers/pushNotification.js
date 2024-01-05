const admin = require("firebase-admin");
const UserModel = require('../models/pushNotificationModel');

const pushNotificationController = {};

pushNotificationController.sendPushNotification = async (req, res) => {
  try {
    const { title, body } = req.body;

    const deviceTokens = await UserModel.getDeviceTokens();

    // Ensure title and body are present in the request body; use default values if not provided
    const message = {
      data: {
        title: title || "Default Title",
        body: body || "Default Body",
      },
    };

    // Filter out invalid or expired tokens
    const validTokens = deviceTokens.filter((token) => {
      return tokenIsValid(token);
    });

    console.log('All Device Tokens:', deviceTokens);
    console.log('Valid Device Tokens:', validTokens);
    console.log('Invalid Device Tokens:', deviceTokens.filter(token => !validTokens.includes(token)));

    if (validTokens.length === 0) {
      console.error('No valid device tokens to send the message.');
      return res.status(400).send('No valid device tokens to send the message.');
    }

    // Send push notification to valid devices
    const response = await admin.messaging().sendToDevice(validTokens, message);

    console.log('Successfully sent push notification:', response);
    res.status(200).send('Push notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification:', error);

    // Print detailed error information
    if (error.results && error.results[0] && error.results[0].error) {
      const firebaseMessagingError = error.results[0].error;
      console.error('Detailed error for the first device token:', firebaseMessagingError);

      if (firebaseMessagingError.code === 'messaging/invalid-registration-token' && firebaseMessagingError.errorInfo) {
        console.error('Invalid registration token details:', firebaseMessagingError.errorInfo);
      }
    }

    res.status(500).send('Error sending push notification');
  }
};

// Example function to check if a token is valid
function tokenIsValid(token) {
  return token !== null && token.trim() !== '';
}

pushNotificationController.sendSpecificPushNotification = async (req, res) => {
  try {
    const { device_token, message } = req.body;

    if (!device_token || !message || !message.title || !message.body) {
      return res.status(400).send("Invalid request. Please provide a valid device_token and message with title and body.");
    }

    const notificationMessage = {
      token: device_token,
      notification: {
        title: message.title,
        body: message.body,
      },
    };

    const response = await admin.messaging().send(notificationMessage);

    console.log('Successfully sent specific push notification:', response);
    res.status(200).send('Specific push notification sent successfully');
  } catch (error) {
    console.error('Error sending specific push notification:', error);
    res.status(500).send('Error sending specific push notification');
  }
};

module.exports = pushNotificationController;
