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

// In adminModel.js
AdminModel.deleteStory = (id, callback) => {
    // SQL query to check for any links in story_tags, story_episodes_views, and story_comments
    const checkLinksSql = `
        SELECT EXISTS (
            SELECT 1 FROM story_tags WHERE storyId = ?
            UNION ALL
            SELECT 1 FROM story_episodes_views WHERE story_id = ?
            UNION ALL
            SELECT 1 FROM story_episodes WHERE storyId = ?
        ) AS linkedExists;
    `;

    // Execute the query to check for linked records
    dbConn.query(checkLinksSql, [id, id, id], (error, results) => {
        if (error) {
            console.error("Error checking for linked data: ", error);
            return callback(error, null);
        }

        // Check if any linked records exist
        if (results[0].linkedExists) {
            return callback(null, { message: "Cannot delete story as there are linked records in other tables." });
        } else {
            // If no linked records, proceed with deletion
            const deleteSql = `DELETE FROM story_lists WHERE id = ?`;
            dbConn.query(deleteSql, [id], (error, result) => {
                if (error) {
                    console.error("Error deleting story: ", error);
                    return callback(error, null);
                }
                return callback(null, result);
            });
        }
    });
};


module.exports = AdminModel;
