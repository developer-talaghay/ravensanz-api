const dbConn = require('../config/db.config');

const InAppNotificationModel = {};

InAppNotificationModel.createNotification = (notificationData, callback) => {
  const { user_id, notification_type, title, message } = notificationData;

  // Check if user_id is not 0 and if user exists
  if (user_id !== 0) {
    dbConn.query('SELECT id FROM user WHERE id = ?', [user_id], (error, result) => {
      if (error) {
        console.error('Error checking user existence: ', error);
        return callback(error, null);
      }

      if (result.length === 0) {
        // User does not exist
        return callback({ message: 'User not found' }, null);
      }

      // User exists, proceed with insertion
      insertNotification();
    });
  } else {
    // If user_id is 0, directly insert the notification
    insertNotification();
  }

  // Function to insert the notification
  function insertNotification() {
    const sqlQuery = 'INSERT INTO in_app_notifications (user_id, notification_type, title, message) VALUES (?, ?, ?, ?)';
    const sqlParams = [user_id, notification_type || 0, title, message];

    dbConn.query(sqlQuery, sqlParams, (error, result) => {
      if (error) {
        console.error('Error inserting notification: ', error);
        return callback(error, null);
      }

      return callback(null, result.insertId);
    });
  }
};



InAppNotificationModel.getSpecificNotifications = (user_id, callback) => {
    const sqlQuery = `
      SELECT *
      FROM in_app_notifications
      WHERE user_id = ?
      ORDER BY is_read ASC, notif_id ASC
    `;
    
    dbConn.query(sqlQuery, [user_id], (error, results) => {
      if (error) {
        console.error('Error fetching specific notifications: ', error);
        return callback(error, null);
      }
  
      // Calculate unread and read counts
      const unread_count = results.filter(notification => notification.is_read === 0).length;
      const read_count = results.filter(notification => notification.is_read === 1).length;
  
      // Group notifications by is_read value
      const groupedNotifications = results.reduce((acc, notification) => {
        const key = notification.is_read === 0 ? 'unread' : 'read';
        acc[key] = acc[key] || [];
        acc[key].push(notification);
        return acc;
      }, {});
  
      return callback(null, groupedNotifications, read_count, unread_count);
    });
  };



  

InAppNotificationModel.createGeneralNotificationForAllUsers = (title, message, callback) => {
    // Retrieve all user IDs from the user table
    const sqlQuery = 'SELECT id FROM user';
  
    dbConn.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Error fetching user IDs: ', error);
        return callback(error, null);
      }
  
      // Extract user IDs from the results
      const userIds = results.map(row => row.id);
  
      // Construct the bulk insert SQL query
      const placeholders = userIds.map(() => '(?, ?, ?, ?)').join(', ');
      const sqlParams = userIds.flatMap(userId => [userId, 0, title, message]);
  
      const bulkInsertQuery = `
        INSERT INTO in_app_notifications (user_id, notification_type, title, message)
        VALUES ${placeholders}
      `;
  
      // Execute the bulk insert query
      dbConn.query(bulkInsertQuery, sqlParams, (error, result) => {
        if (error) {
          console.error('Error inserting notifications: ', error);
          return callback(error, null);
        }
  
        return callback(null, { message: 'Notifications created for all users' });
      });
    });
  };


// Function to update notification status, message, and title by notif_id
InAppNotificationModel.updateNotificationStatus = (notif_id, is_read, title, message, callback) => {
    let sqlQuery = 'UPDATE in_app_notifications SET is_read = ?';
    const sqlParams = [is_read];
  
    // Add title and message to the update query if provided
    if (title !== undefined && message !== undefined) {
      sqlQuery += ', title = ?, message = ?';
      sqlParams.push(title, message);
    } else if (title !== undefined) {
      sqlQuery += ', title = ?';
      sqlParams.push(title);
    } else if (message !== undefined) {
      sqlQuery += ', message = ?';
      sqlParams.push(message);
    }
  
    sqlQuery += ' WHERE notif_id = ?';
    sqlParams.push(notif_id);
  
    dbConn.query(sqlQuery, sqlParams, (error, result) => {
      if (error) {
        console.error('Error updating notification status: ', error);
        return callback(error, null);
      }
  
      return callback(null, result);
    });
  };


// Function to update notification status by notif_id
InAppNotificationModel.updateNotificationStatusMobile = (notif_id, is_read, callback) => {
    const sqlQuery = 'UPDATE in_app_notifications SET is_read = ? WHERE notif_id = ?';
    const sqlParams = [is_read, notif_id];
  
    dbConn.query(sqlQuery, sqlParams, (error, result) => {
      if (error) {
        console.error('Error updating notification status: ', error);
        return callback(error, null);
      }
  
      return callback(null, result);
    });
  };


  // Function to delete notification by notif_id
InAppNotificationModel.deleteNotification = (notif_id, callback) => {
    const sqlQuery = 'DELETE FROM in_app_notifications WHERE notif_id = ?';
    dbConn.query(sqlQuery, [notif_id], (error, result) => {
      if (error) {
        console.error('Error deleting notification: ', error);
        return callback(error, null);
      }
  
      return callback(null, result);
    });
  };


  InAppNotificationModel.deleteAllNotificationsByUserId = (user_id, callback) => {
    const sqlQuery = 'DELETE FROM in_app_notifications WHERE user_id = ?';
    dbConn.query(sqlQuery, [user_id], (error, result) => {
        if (error) {
            console.error('Error deleting notifications: ', error);
            return callback(error, null);
        }

        return callback(null, result);
    });
};

module.exports = InAppNotificationModel;
