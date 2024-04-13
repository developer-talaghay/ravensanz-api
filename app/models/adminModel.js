// adminModel.js
const dbConn = require("../config/db.config");
const { v4: uuidv4 } = require("uuid");

const AdminModel = {};

AdminModel.createStory = (storyDetails, callback) => {
  const id = uuidv4();
  const sql = `INSERT INTO story_lists (id, userId, title, blurb, language, genre, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

  // Insert the generated UUID along with other story details into the database
  dbConn.query(
    sql,
    [
      id,
      storyDetails.userId,
      storyDetails.title,
      storyDetails.blurb,
      storyDetails.language,
      storyDetails.genre,
      storyDetails.status,
    ],
    (error, result) => {
      if (error) {
        console.error("Error creating story: ", error);
        return callback(error, null);
      }
      return callback(null, result);
    }
  );
};

AdminModel.createStory = (
  userId,
  title,
  blurb,
  language,
  genre,
  status,
  callback
) => {
  const ravensanzQuery = "SELECT * FROM ravensanz_users WHERE id = ?";
  dbConn.query(ravensanzQuery, [userId], (error, ravensanzResults) => {
    if (error) {
      console.error(
        "Error checking userId existence in ravensanz_users table: ",
        error
      );
      return callback(error, null);
    }

    const userQuery = "SELECT * FROM user WHERE id = ?";
    dbConn.query(userQuery, [userId], (error, userResults) => {
      if (error) {
        console.error("Error checking userId existence in user table: ", error);
        return callback(error, null);
      }

      const id = uuidv4();
      const sql = `INSERT INTO story_lists (id, userId, title, blurb, language, genre, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
      dbConn.query(
        sql,
        [id, userId, title, blurb, language, genre, status],
        (error, result) => {
          if (error) {
            console.error("Error creating story: ", error);
            return callback(error, null);
          }
          return callback(null, result);
        }
      );
    });
  });
};

module.exports = AdminModel;
