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
    // Check if a record exists with the given user_id and story_id
    dbConn.query(
      'SELECT * FROM user_last_read WHERE user_id = ? AND story_id = ?',
      [userId, storyId],
      (error, result) => {
        if (error) {
          console.error('Error checking for existing record: ', error);
          return callback(error);
        }
  
        if (result.length === 0) {
          // If no matching record found, insert a new row
          dbConn.query(
            'INSERT INTO user_last_read (user_id, story_id) VALUES (?, ?)',
            [userId, storyId],
            (insertError) => {
              if (insertError) {
                console.error('Error inserting new record: ', insertError);
                return callback(insertError);
              }
  
              return callback(null, 'New record inserted successfully');
            }
          );
        } else {
          // If matching record found, do nothing
          return callback(null, 'Record already exists');
        }
      }
    );
  };


 // Model
ClientModel.getStoryDetails = (userId, callback) => {
  // Get all records from user_last_read for the given user_id
  dbConn.query(
    'SELECT ulr.*, vsi.* FROM user_last_read ulr ' +
    'LEFT JOIN v_story_images vsi ON ulr.story_id = vsi.story_id ' +
    'WHERE ulr.user_id = ?',
    [userId],
    (error, result) => {
      if (error) {
        console.error('Error fetching story details: ', error);
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



ClientModel.searchStories = (searchQuery, callback) => {
  const sqlQuery = `
    SELECT * 
    FROM v_story_images 
    WHERE title LIKE ? OR author LIKE ?
  `;
  
  dbConn.query(sqlQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (error, result) => {
    if (error) {
      console.error("Error searching stories: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

ClientModel.getPublishedStoryDetails = (callback) => {
  const sqlQuery = `
    SELECT * 
    FROM v_story_details 
    WHERE isPublished = 1
  `;
  
  dbConn.query(sqlQuery, (error, result) => {
    if (error) {
      console.error("Error retrieving published story details: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};


module.exports = ClientModel;
