const dbConn = require("../config/db.config");
const bcrypt = require("bcrypt");

const User = {};

User.create = (newUser, callback) => {
  // Check if the email address already exists
  dbConn.query(
    "SELECT * FROM user WHERE email_add = ?",
    [newUser.email_add],
    (error, result) => {
      if (error) {
        console.error("Error checking email address existence: ", error);
        return callback(error, null);
      } else if (result.length > 0) {
        // Email address already exists
        return callback("Email address already exists", null);
      } else {
        // Hash the password
        const saltRounds = 10;
        const password = newUser.password.toString();
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password: ", err);
            return callback(err, null);
          } else {
            // Insert the user into the database
            dbConn.query(
              "INSERT INTO user (email_add, password, status) VALUES (?, ?, ?)",
              [newUser.email_add, hashedPassword, "pending"], // Set the status to "pending"
              (error, result) => {
                if (error) {
                  console.error("Error inserting user into database: ", error);
                  return callback(error, null);
                } else {
                  return callback(null, result);
                }
              }
            );
          }
        });
      }
    }
  );
};

User.updateUserStatusAndToken = (email, status, token, callback) => {
  dbConn.query(
    "UPDATE user SET status = ?, token = ? WHERE email_add = ?",
    [status, token, email],
    (error, result) => {
      if (error) {
        console.error("Error updating user status and token: ", error);
        return callback(error);
      } else {
        return callback(null);
      }
    }
  );
};

// Function to update user status and token
User.updateUserStatus = (email, status, callback) => {
  dbConn.query(
    "UPDATE user SET status = ? WHERE email_add = ?",
    [status, email],
    (error, result) => {
      if (error) {
        console.error("Error updating user status: ", error);
        return callback(error);
      } else {
        return callback(null);
      }
    }
  );
};

User.deleteUser = (userId, callback) => {
  const deleteQueries = [
    'DELETE FROM user_thenest WHERE user_id = ?',
    'DELETE FROM user_last_read WHERE user_id = ?',
    'DELETE FROM user_details WHERE user_id = ?',
    'DELETE FROM user_likes WHERE user_id = ?',
    'DELETE FROM user_story_comments WHERE user_id = ?',
    'DELETE FROM picture_table WHERE user_id = ?',
    'DELETE FROM user WHERE id = ?'
  ];

  dbConn.beginTransaction((err) => {
    if (err) {
      return callback(err);
    }

    const deletePromises = deleteQueries.map((query) => {
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
    });

    Promise.all(deletePromises)
      .then(() => {
        dbConn.commit((err) => {
          if (err) {
            dbConn.rollback(() => {
              callback(err);
            });
          } else {
            callback(null, { affectedRows: 1 }); // Assume user deletion always succeeds
          }
        });
      })
      .catch((error) => {
        dbConn.rollback(() => {
          callback(error);
        });
      });
  });
};

// Modify the UserModel.js file

// Modify the UserModel.js file

User.createOrLoginGoogleUser = (userData, callback) => {
  const { idToken, email } = userData;

  // Check if the email address already exists in the user_google table
  dbConn.query(
    'SELECT id, token, email_add, status, type, created_at, modified_at FROM user WHERE email_add = ? AND type = "google" ',
    [email],
    (error, result) => {
      if (error) {
        console.error('Error checking email address existence: ', error);
        return callback(error, null);
      } else if (result.length > 0) {
        // Email address already exists in user_google table, log in the user
        const userDetails = result[0];
        return callback(null, userDetails);
      } else {
        // Insert the Google user into the user_google table
        dbConn.query(
          'INSERT INTO user (token, email_add, type) VALUES (?, ?, "google")',
          [idToken, email],
          (error, result) => {
            if (error) {
              console.error('Error inserting Google user into the database: ', error);
              return callback(error, null);
            } else {
              return callback(null, result);
            }
          }
        );
      }
    }
  );
};



module.exports = User;
