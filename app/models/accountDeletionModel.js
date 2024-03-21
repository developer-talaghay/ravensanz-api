const bcrypt = require('bcrypt');
const dbConn = require('../config/db.config');

const UserModel = {};

UserModel.getUserByEmail = (email_add, callback) => {
    const sqlQuery = 'SELECT * FROM user WHERE email_add = ?';
    dbConn.query(sqlQuery, [email_add], (error, results) => {
        if (error) {
            console.error("Error retrieving user by email: ", error);
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // User not found
        }
        const user = results[0];
        return callback(null, user);
    });
};


UserModel.deleteUser = (userId, callback) => {
    const deleteQueries = [
      'DELETE FROM user_liked_comments WHERE user_id = ?',
      'DELETE FROM user_story_comments WHERE user_id = ?',
      'DELETE FROM user_likes WHERE user_id = ?',
      'DELETE FROM picture_table WHERE user_id = ?',
      'DELETE FROM user_details WHERE user_id = ?',
      'DELETE FROM user_last_read WHERE user_id = ?',
      'DELETE FROM user_thenest WHERE user_id = ?',
      'DELETE FROM user_purchase WHERE user_id = ?',
      'DELETE FROM user_follows WHERE user_id = ?',
      'DELETE FROM user WHERE id = ?'
    ];
  
    dbConn.beginTransaction((err) => {
      if (err) {
        return callback(err);
      }
  
      function executeQuery(query) {
        return new Promise((resolve, reject) => {
          dbConn.query(query, [userId], (error, result) => {
            if (error) {
              dbConn.rollback(() => {
                reject(error);
              });
            } else {
              resolve(result);
            }
          });
        });
      }
  
      (async () => {
        try {
          for (const query of deleteQueries) {
            await executeQuery(query);
          }
  
          dbConn.commit((err) => {
            if (err) {
              dbConn.rollback(() => {
                callback(err);
              });
            } else {
              callback(null, { affectedRows: 1 }); // Assume user deletion always succeeds
            }
          });
        } catch (error) {
          dbConn.rollback(() => {
            callback(error);
          });
        }
      })();
    });
  };


  UserModel.insertFeedback = (email_add, feedback, callback) => {
    const sql = 'INSERT INTO feedback (email_add, feedback) VALUES (?, ?)';
    dbConn.query(sql, [email_add, feedback], (error, result) => {
        if (error) {
            return callback(error);
        }
        // Ensure the result object has an insertId property
        const feedbackId = result.insertId;
        return callback(null, feedbackId);
    });
};

module.exports = UserModel;
