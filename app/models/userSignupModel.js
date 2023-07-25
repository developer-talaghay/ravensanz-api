const dbConn = require("../config/db.config");
const bcrypt = require('bcrypt');

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
              "INSERT INTO user (email_add, password) VALUES (?, ?)",
              [newUser.email_add, hashedPassword],
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

module.exports = User;
