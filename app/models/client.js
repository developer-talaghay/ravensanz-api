const dbConn = require("../config/db.config");

const ClientModel = {};

ClientModel.getStoryImages = (callback) => {
  dbConn.query("SELECT * FROM v_story_images", (error, result) => {
    if (error) {
      console.error("Error retrieving story images: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

ClientModel.getOngoingStories = (callback) => {
    dbConn.query(
      "SELECT * FROM v_story_images WHERE status = 'Ongoing'",
      (error, result) => {
        if (error) {
          console.error("Error retrieving ongoing stories: ", error);
          return callback(error, null);
        }
  
        return callback(null, result);
      }
    );
  };

  ClientModel.getCompletedStories = (callback) => {
    dbConn.query(
      "SELECT * FROM v_story_images WHERE status = 'Completed'",
      (error, result) => {
        if (error) {
          console.error("Error retrieving ongoing stories: ", error);
          return callback(error, null);
        }
  
        return callback(null, result);
      }
    );
  };

  ClientModel.getAllDetails = (callback) => {
    dbConn.query("SELECT * FROM v_story_details", (error, result) => {
      if (error) {
        console.error("Error retrieving story details: ", error);
        return callback(error, null);
      }
  
      return callback(null, result);
    });
  };

  ClientModel.getStoryDetailsById = (storyId, callback) => {
    // Get story details from v_story_details
    dbConn.query("SELECT * FROM v_story_details WHERE id = ?", [storyId], (error, storyDetails) => {
        if (error) {
            console.error("Error retrieving story details by id: ", error);
            return callback(error, null);
        }

        // Get related tags from story_tags
        dbConn.query("SELECT name FROM story_tags WHERE storyId = ?", [storyId], (error, tagDetails) => {
            if (error) {
                console.error("Error retrieving tag details by storyId: ", error);
                return callback(error, null);
            }

            storyDetails[0].tags = tagDetails.map(tag => tag.name);

            // Get all episode details from story_episodes
            dbConn.query("SELECT subTitle, storyLine, isVIP, status, wingsRequired, updatedAt FROM story_episodes WHERE storyId = ?", [storyId], (error, episodeDetails) => {
                if (error) {
                    console.error("Error retrieving episode details by id: ", error);
                    return callback(error, null);
                }

                // Add array of episode details to the storyDetails object
                storyDetails[0].episodes = episodeDetails;

                return callback(null, storyDetails);
            });
        });
    });
};


  ClientModel.getRelatedStoriesByTag = (tagName, callback) => {
    const query = "SELECT * FROM v_story_tags WHERE tag_name LIKE '%" + tagName + "%'";

    dbConn.query(query, (error, results) => {
        if (error) {
            console.error("Error retrieving related stories by tag: ", error);
            return callback(error, null);
        }

        return callback(null, results);
    });
};

ClientModel.getNewArrivals = (callback) => {
  dbConn.query(
    "SELECT * FROM v_story_images ORDER BY createdAt DESC LIMIT 10",
    (error, result) => {
      if (error) {
        console.error("Error retrieving ongoing stories: ", error);
        return callback(error, null);
      }

      return callback(null, result);
    }
  );
};

ClientModel.insertStoryId = (userId, storyId, callback) => {
  dbConn.query(
    'INSERT IGNORE INTO user_last_read (user_id, story_id) VALUES (?, ?)',
    [userId, storyId],
    (error, result) => {
      if (error) {
        console.error('Error inserting story_id: ', error);
        return callback(error, null);
      }

      return callback(null, result);
    }
  );
};


ClientModel.getStoryDetails = (userId, callback) => {
  dbConn.query(
    'SELECT u.user_id, u.story_id, v.* ' +
    'FROM user_last_read u ' +
    'LEFT JOIN v_story_images v ON u.story_id = v.story_id ' +
    'WHERE u.user_id = ?',
    [userId],
    (error, result) => {
      if (error) {
        console.error('Error getting user last read: ', error);
        return callback(error, null);
      }

      return callback(null, result);
    }
  );
};

ClientModel.getVipStories = (callback) => {
  dbConn.query(
    'SELECT * FROM v_story_vip',
    (error, result) => {
      if (error) {
        console.error('Error getting VIP stories: ', error);
        return callback(error, null);
      }

      return callback(null, result);
    }
  );
};




module.exports = ClientModel;
