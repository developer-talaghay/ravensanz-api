const InAppNotificationModel = require('../models/inAppNotifModel');

const inAppNotifController = {};

inAppNotifController.createNotification = (req, res) => {
  const { user_id, notification_type, title, message } = req.body;
  if (typeof user_id === 'undefined') {
    return res.status(400).json({ message: 'Missing required field: user_id' });
  }
  if (![0, 1].includes(notification_type)) {
    return res.status(400).json({ message: 'Invalid notification_type' });
  }
  const notificationData = {
    user_id: parseInt(user_id),
    notification_type: parseInt(notification_type),
    title,
    message,
  };
  InAppNotificationModel.createNotification(notificationData, (error, notificationId) => {
    if (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      }
      console.error('Error creating notification: ', error);
      return res.status(500).json({ message: 'Error creating notification' });
    }
    return res.status(201).json({ message: 'Notification created', notification_id: notificationId });
  });
};

inAppNotifController.getSpecificNotifications = (req, res) => {
  const { user_id } = req.query;
  if (typeof user_id === 'undefined') {
    return res.status(400).json({ message: 'Missing required field: user_id' });
  }
  InAppNotificationModel.getSpecificNotifications(user_id, (error, groupedNotifications, read_count, unread_count) => {
    if (error) {
      console.error('Error getting specific notifications: ', error);
      return res.status(500).json({ message: 'Error getting specific notifications' });
    }
    const response = { 
      groupedNotifications: {
        unread: groupedNotifications.unread ? groupedNotifications.unread.reverse() : [],
        read: groupedNotifications.read ? groupedNotifications.read.reverse() : []
      },
      read_count,
      unread_count 
    };
    return res.status(200).json(response);
  });
};

inAppNotifController.createGeneralNotification = (req, res) => {
  const { title, message } = req.body;
  if (typeof title === 'undefined' || typeof message === 'undefined') {
    return res.status(400).json({ message: 'Missing required fields: title and message' });
  }
  InAppNotificationModel.createGeneralNotificationForAllUsers(title, message, (error, result) => {
    if (error) {
      console.error('Error creating general notification for all users: ', error);
      return res.status(500).json({ message: 'Error creating general notification for all users' });
    }
    return res.status(201).json(result);
  });
};

inAppNotifController.updateNotificationStatus = (req, res) => {
  const { notif_id, is_read, title, message } = req.body;
  if (typeof notif_id === 'undefined' || typeof is_read === 'undefined') {
    return res.status(400).json({ message: 'Missing required fields: notif_id and is_read' });
  }
  if (![0, 1].includes(is_read)) {
    return res.status(400).json({ message: 'Invalid value for is_read. It should be 0 or 1.' });
  }
  InAppNotificationModel.updateNotificationStatus(notif_id, is_read, title, message, (error, result) => {
    if (error) {
      console.error('Error updating notification: ', error);
      return res.status(500).json({ message: 'Error updating notification' });
    }
    return res.status(200).json({ message: 'Notification updated successfully' });
  });
};

inAppNotifController.updateNotificationStatusMobile = (req, res) => {
  const { notif_id, is_read } = req.body;
  if (typeof notif_id === 'undefined' || typeof is_read === 'undefined') {
    return res.status(400).json({ message: 'Missing required fields: notif_id and is_read' });
  }
  if (![0, 1].includes(is_read)) {
    return res.status(400).json({ message: 'Invalid value for is_read. It should be 0 or 1.' });
  }
  InAppNotificationModel.updateNotificationStatusMobile(notif_id, is_read, (error, result) => {
    if (error) {
      console.error('Error updating notification status: ', error);
      return res.status(500).json({ message: 'Error updating notification status' });
    }
    return res.status(200).json({ message: 'Notification status updated successfully' });
  });
};

inAppNotifController.deleteNotification = (req, res) => {
  const { notif_id } = req.query;
  if (typeof notif_id === 'undefined') {
    return res.status(400).json({ message: 'Missing required field: notif_id' });
  }
  InAppNotificationModel.deleteNotification(notif_id, (error, result) => {
    if (error) {
      console.error('Error deleting notification: ', error);
      return res.status(500).json({ message: 'Error deleting notification' });
    }
    return res.status(200).json({ message: 'Notification deleted successfully' });
  });
};

inAppNotifController.deleteAllNotificationsByUserId = (req, res) => {
  const { user_id } = req.query;
  if (typeof user_id === 'undefined') {
    return res.status(400).json({ message: 'Missing required field: user_id' });
  }
  InAppNotificationModel.deleteAllNotificationsByUserId(user_id, (error, result) => {
    if (error) {
      console.error('Error deleting notifications: ', error);
      return res.status(500).json({ message: 'Error deleting notifications' });
    }
    return res.status(200).json({ message: 'Notifications deleted successfully' });
  });
};

inAppNotifController.createGeneralNotificationForAllUsers = (req, res) => {
  const { title, message } = req.body;
  if (typeof title === 'undefined' || typeof message === 'undefined') {
    return res.status(400).json({ message: 'Missing required fields: title and message' });
  }
  InAppNotificationModel.createGeneralNotificationForAllUsers(title, message, (error, result) => {
    if (error) {
      console.error('Error creating notification for all users: ', error);
      return res.status(500).json({ message: 'Error creating notification for all users' });
    }
    return res.status(201).json(result);
  });
};

inAppNotifController.getAllGeneralNotifications = (req, res) => {
  InAppNotificationModel.getAllGeneralNotifications((error, notifications) => {
    if (error) {
      console.error('Error getting all general notifications: ', error);
      return res.status(500).json({ message: 'Error getting all general notifications' });
    }
    return res.status(200).json(notifications);
  });
};

module.exports = inAppNotifController;