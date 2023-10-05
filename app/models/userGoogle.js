const dbConn = require('../config/db.config'); // Use your database connection setup
const UserGoogle = {};

UserGoogle.insertUserGoogle = (userData, callback) => {
  const { email, email_verified, name, picture, given_name, family_name, locale } = userData;

  const sqlQuery = `
    INSERT INTO user_google (email, email_verified, name, picture, given_name, family_name, locale)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  dbConn.query(
    sqlQuery,
    [email, email_verified, name, picture, given_name, family_name, locale],
    (error, result) => {
      if (error) {
        console.error('Error inserting user_google data:', error);
        return callback(error, null);
      }

      return callback(null, result);
    }
  );
};

module.exports = UserGoogle;