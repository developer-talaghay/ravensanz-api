const dbConn = require("../config/db.config");
const bcrypt = require("bcrypt");

const User = {};

// User.create = (newUser, callback) => {
//   // Check if the email address already exists
//   dbConn.query(
//     "SELECT * FROM user WHERE email_add = ?",
//     [newUser.email_add],
//     (error, result) => {
//       if (error) {
//         console.error("Error checking email address existence: ", error);
//         return callback(error, null);
//       } else if (result.length > 0) {
//         // Email address already exists
//         return callback("Email address already exists", null);
//       } else {
//         // Hash the password
//         const saltRounds = 10;
//         const password = newUser.password.toString();
//         bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//           if (err) {
//             console.error("Error hashing password: ", err);
//             return callback(err, null);
//           } else {
//             // Insert the user into the database
//             dbConn.query(
//               "INSERT INTO user (email_add, password, status) VALUES (?, ?, ?)",
//               [newUser.email_add, hashedPassword, "pending"], // Set the status to "pending"
//               (error, result) => {
//                 if (error) {
//                   console.error("Error inserting user into database: ", error);
//                   return callback(error, null);
//                 } else {
//                   return callback(null, result);
//                 }
//               }
//             );
//           }
//         });
//       }
//     }
//   );
// };

// const insertUserDetails = (userId, userDetails, callback) => {
//   dbConn.query(
//     "INSERT INTO user_details (user_id, full_name, display_name, birth_date, country, phone_number, modified_at, created_at, isAdmin, isWriterVerified, isEmailVerified, writerApplicationStatus, imageId, wingsCount, isSubscriber, subscriptionExpirationDate, isReadingModeOver18, writerBadge, readerBadge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//     [
//       userId,
//       userDetails.full_name,
//       userDetails.display_name,
//       userDetails.birth_date,
//       userDetails.country,
//       userDetails.phone_number,
//       userDetails.modified_at,
//       userDetails.created_at,
//       userDetails.isAdmin,
//       userDetails.isWriterVerified,
//       userDetails.isEmailVerified,
//       userDetails.writerApplicationStatus,
//       userDetails.imageId,
//       userDetails.wingsCount,
//       userDetails.isSubscriber,
//       userDetails.subscriptionExpirationDate,
//       userDetails.isReadingModeOver18,
//       userDetails.writerBadge,
//       userDetails.readerBadge,
//     ],
//     (error, result) => {
//       if (error) {
//         console.error("Error inserting user details into database: ", error);
//         return callback(error);
//       } else {
//         return callback(null);
//       }
//     }
//   );
// };

// User.create = (newUser, callback) => {
//   // Check if the email address already exists in the user table
//   dbConn.query(
//     "SELECT * FROM user WHERE email_add = ?",
//     [newUser.email_add],
//     (error, userResult) => {
//       if (error) {
//         console.error("Error checking email address existence: ", error);
//         return callback(error, null);
//       } else if (userResult.length > 0) {
//         // Email address already exists in the user table
//         return callback("Email address already exists", null);
//       } else {
//         // Check if the email address exists in the ravensanz_users table
//         dbConn.query(
//           "SELECT * FROM ravensanz_users WHERE email_add = ?",
//           [newUser.email_add],
//           (error, ravensanzResult) => {
//             if (error) {
//               console.error("Error checking email address in ravensanz_users: ", error);
//               return callback(error, null);
//             } else if (ravensanzResult.length > 0) {
//               const userDetails = ravensanzResult[0];

//               // Insert the user into the user table
//               const saltRounds = 10;
//               const password = newUser.password.toString();
//               bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//                 if (err) {
//                   console.error("Error hashing password: ", err);
//                   return callback(err, null);
//                 } else {
//                   dbConn.query(
//                     "INSERT INTO user (email_add, password, status) VALUES (?, ?, ?)",
//                     [newUser.email_add, hashedPassword, "pending"],
//                     (error, finalUserResult) => {
//                       if (error) {
//                         console.error("Error inserting user into database: ", error);
//                         return callback(error, null);
//                       } else {
//                         const userId = finalUserResult.insertId; // Access the insertId from the finalUserResult
//                         console.log(userId);

//                         insertUserDetails(userId, userDetails, (error) => {
//                           if (error) {
//                             console.error("Error copying data to user_details: ", error);
//                             return callback(error, null);
//                           } else {
//                             return callback(null, finalUserResult);
//                           }
//                         });
//                       }
//                     }
//                   );
//                 }
//               });
//             } else {
//               // Email address doesn't exist in ravensanz_users table, proceed to insert into user table
//               const saltRounds = 10;
//               const password = newUser.password.toString();
//               bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//                 if (err) {
//                   console.error("Error hashing password: ", err);
//                   return callback(err, null);
//                 } else {
//                   dbConn.query(
//                     "INSERT INTO user (email_add, password, status) VALUES (?, ?, ?)",
//                     [newUser.email_add, hashedPassword, "pending"],
//                     (error, finalUserResult) => {
//                       if (error) {
//                         console.error("Error inserting user into database: ", error);
//                         return callback(error, null);
//                       } else {
//                         return callback(null, finalUserResult);
//                       }
//                     }
//                   );
//                 }
//               });
//             }
//           }
//         );
//       }
//     }
//   );
// };

const insertUserDetails = (userId, userDetails, callback) => {
  // Insert default values if userDetails is not provided
  userDetails = userDetails || getDefaultUserDetails();

  dbConn.query(
    "INSERT INTO user_details (user_id, full_name, display_name, birth_date, country, phone_number, modified_at, created_at, isAdmin, isWriterVerified, isEmailVerified, writerApplicationStatus, imageId, wingsCount, isSubscriber, subscriptionExpirationDate, isReadingModeOver18, writerBadge, readerBadge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      userId,
      userDetails.full_name,
      userDetails.display_name,
      userDetails.birth_date,
      userDetails.country,
      userDetails.phone_number,
      userDetails.modified_at,
      userDetails.created_at,
      userDetails.isAdmin,
      userDetails.isWriterVerified,
      userDetails.isEmailVerified,
      userDetails.writerApplicationStatus,
      userDetails.imageId,
      userDetails.wingsCount,
      userDetails.isSubscriber,
      userDetails.subscriptionExpirationDate,
      userDetails.isReadingModeOver18,
      userDetails.writerBadge,
      userDetails.readerBadge,
    ],
    (error, result) => {
      if (error) {
        console.error("Error inserting user details into database: ", error);
        return callback(error);
      } else {
        return callback(null);
      }
    }
  );
};

const getDefaultUserDetails = () => {
  const currentDate = new Date();
  const defaultExpirationDate = new Date(currentDate.setDate(currentDate.getDate() + 3)).toISOString().split('T')[0];

  return {
    "full_name": "No name",
    "display_name": "No name",
    "birth_date": "1970-01-01",
    "country": "No name",
    "phone_number": "##########",
    "isAdmin": "0",
    "isWriterVerified": "0",
    "isEmailVerified": "0",
    "writerApplicationStatus": "0",
    "imageId": "0",
    "wingsCount": 0,
    "isSubscriber": "1",
    "subscriptionExpirationDate": defaultExpirationDate,
    "isReadingModeOver18": "0",
    "writerBadge": "0",
    "readerBadge": "0",
  };
};


User.create = (newUser, callback) => {
  // Check if the email address already exists in the user table
  dbConn.query(
    "SELECT * FROM user WHERE email_add = ?",
    [newUser.email_add],
    (error, userResult) => {
      if (error) {
        console.error("Error checking email address existence: ", error);
        return callback(error, null);
      } else if (userResult.length > 0) {
        // Email address already exists in the user table
        return callback("Email address already exists", null);
      } else {
        // Check if the email address exists in the ravensanz_users table
        dbConn.query(
          "SELECT * FROM ravensanz_users WHERE email_add = ?",
          [newUser.email_add],
          (error, ravensanzResult) => {
            if (error) {
              console.error("Error checking email address in ravensanz_users: ", error);
              return callback(error, null);
            } else if (ravensanzResult.length > 0) {
              const userDetails = ravensanzResult[0];

              // Insert the user into the user table
              const saltRounds = 10;
              const password = newUser.password.toString();
              bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                  console.error("Error hashing password: ", err);
                  return callback(err, null);
                } else {
                  dbConn.query(
                    "INSERT INTO user (email_add, password, status) VALUES (?, ?, ?)",
                    [newUser.email_add, hashedPassword, "pending"],
                    (error, finalUserResult) => {
                      if (error) {
                        console.error("Error inserting user into database: ", error);
                        return callback(error, null);
                      } else {
                        const userId = finalUserResult.insertId; // Access the insertId from the finalUserResult
                        console.log(userId);

                        insertUserDetails(userId, userDetails, (error) => {
                          if (error) {
                            console.error("Error copying data to user_details: ", error);
                            return callback(error, null);
                          } else {
                            return callback(null, finalUserResult);
                          }
                        });
                      }
                    }
                  );
                }
              });
            } else {
              // Email address doesn't exist in ravensanz_users table, proceed to insert into user table
              const saltRounds = 10;
              const password = newUser.password.toString();
              bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                  console.error("Error hashing password: ", err);
                  return callback(err, null);
                } else {
                  dbConn.query(
                    "INSERT INTO user (email_add, password, status) VALUES (?, ?, ?)",
                    [newUser.email_add, hashedPassword, "pending"],
                    (error, finalUserResult) => {
                      if (error) {
                        console.error("Error inserting user into database: ", error);
                        return callback(error, null);
                      } else {
                        // Insert default values into user_details
                        insertUserDetails(finalUserResult.insertId, null, (error) => {
                          if (error) {
                            console.error("Error inserting default data into user_details: ", error);
                            return callback(error, null);
                          } else {
                            return callback(null, finalUserResult);
                          }
                        });
                      }
                    }
                  );
                }
              });
            }
          }
        );
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

User.disableUser = (id, callback) => {
  // Check if the user with the provided ID exists
  dbConn.query('SELECT * FROM user WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      return callback(selectError, null);
    } else if (selectResult.length === 0) {
      return callback('User not found', null);
    } else {
      const updateQuery = 'UPDATE user SET status = ? WHERE id = ?';
      const status = 'disable';

      dbConn.query(updateQuery, [status, id], (error, result) => {
        if (error) {
          return callback(error, null);
        } else {
          return callback(null, result);
        }
      });
    }
  });
};




module.exports = User;
