const dbConn = require('../config/db.config'); // Assuming you have a database connection

const TheNestModel = {};

TheNestModel.insertUserStory = (userId, storyId, callback) => {
  // Check if a record exists with the given user_id and story_id
  dbConn.query(
    'SELECT * FROM user_thenest WHERE user_id = ? AND story_id = ?',
    [userId, storyId],
    (error, result) => {
      if (error) {
        console.error('Error checking for existing record: ', error);
        return callback(error);
      }

      if (result.length === 0) {
        // If no matching record found, insert a new row
        dbConn.query(
          'INSERT INTO user_thenest (user_id, story_id) VALUES (?, ?)',
          [userId, storyId],
          (insertError, insertResult) => {
            if (insertError) {
              console.error('Error inserting new record: ', insertError);
              return callback(insertError);
            }

            return callback(null, insertResult);
          }
        );
      } else {
        // If matching record found, do nothing
        return callback(null, 'Record already exists');
      }
    }
  );
};

TheNestModel.getMyStoryList = (userId, callback) => {
    // Get all story IDs associated with the user from user_thenest
    dbConn.query(
      'SELECT story_id FROM user_thenest WHERE user_id = ?',
      [userId],
      (error, storyIds) => {
        if (error) {
          console.error('Error retrieving story IDs for the user: ', error);
          return callback(error, null);
        }
  
        if (storyIds.length === 0) {
          // No data found for the provided user_id
          return callback(null, []);
        }
  
        // Extract story IDs from the result
        const storyIdArray = storyIds.map((row) => row.story_id);
  
        // Get published story details from v_story_details where id is in the storyIdArray, isPublished = 1, and isVip = 1
        dbConn.query(
          'SELECT * FROM v_story_images WHERE story_id IN (?) AND isPublished = 1',
          [storyIdArray],
          (error, storyDetails) => {
            if (error) {
              console.error('Error retrieving story details: ', error);
              return callback(error, null);
            }
  
            // Now, let's retrieve the tags for each story
            const storiesWithTags = [];
  
            // Function to retrieve tags for a story
            const getTagsForStory = (index) => {
              if (index < storyDetails.length) {
                const story = storyDetails[index];
                const storyId = story.story_id;
  
                // Get tags for the story from v_story_tags
                dbConn.query(
                  'SELECT tag_name FROM v_story_tags WHERE storyId = ?',
                  [storyId],
                  (tagError, tags) => {
                    if (tagError) {
                      console.error('Error retrieving tags for story: ', tagError);
                      return callback(tagError, null);
                    }
  
                    // Extract tag names from the result
                    const tagNames = tags.map((tagRow) => tagRow.tag_name);
  
                    // Add tags to the story
                    story.tags = tagNames;
  
                    // Add the updated story to the list
                    storiesWithTags.push(story);
  
                    // Continue with the next story
                    getTagsForStory(index + 1);
                  }
                );
              } else {
                // All tags have been retrieved for all stories
                return callback(null, storiesWithTags);
              }
            };
  
            // Start retrieving tags for the first story
            getTagsForStory(0);
          }
        );
      }
    );
  };
  

  TheNestModel.getMyVipStoryList = (userId, callback) => {
    // Get all story IDs associated with the user from user_thenest
    dbConn.query(
        'SELECT story_id FROM user_thenest WHERE user_id = ?',
        [userId],
        (error, storyIds) => {
          if (error) {
            console.error('Error retrieving story IDs for the user: ', error);
            return callback(error, null);
          }
    
          if (storyIds.length === 0) {
            // No data found for the provided user_id
            return callback(null, []);
          }
    
          // Extract story IDs from the result
          const storyIdArray = storyIds.map((row) => row.story_id);
    
          // Get published story details from v_story_details where id is in the storyIdArray, isPublished = 1, and isVip = 1
          dbConn.query(
            'SELECT * FROM v_story_images WHERE story_id IN (?) AND isPublished = 1 AND isVip = 1',
            [storyIdArray],
            (error, storyDetails) => {
              if (error) {
                console.error('Error retrieving story details: ', error);
                return callback(error, null);
              }
    
              // Now, let's retrieve the tags for each story
              const storiesWithTags = [];
    
              // Function to retrieve tags for a story
              const getTagsForStory = (index) => {
                if (index < storyDetails.length) {
                  const story = storyDetails[index];
                  const storyId = story.story_id;
    
                  // Get tags for the story from v_story_tags
                  dbConn.query(
                    'SELECT tag_name FROM v_story_tags WHERE storyId = ?',
                    [storyId],
                    (tagError, tags) => {
                      if (tagError) {
                        console.error('Error retrieving tags for story: ', tagError);
                        return callback(tagError, null);
                      }
    
                      // Extract tag names from the result
                      const tagNames = tags.map((tagRow) => tagRow.tag_name);
    
                      // Add tags to the story
                      story.tags = tagNames;
    
                      // Add the updated story to the list
                      storiesWithTags.push(story);
    
                      // Continue with the next story
                      getTagsForStory(index + 1);
                    }
                  );
                } else {
                  // All tags have been retrieved for all stories
                  return callback(null, storiesWithTags);
                }
              };
    
              // Start retrieving tags for the first story
              getTagsForStory(0);
            }
          );
        }
      );
    };

    TheNestModel.deleteUserStory = (userId, storyId, callback) => {
      // Check if a record exists with the given user_id and story_id
      dbConn.query(
        'DELETE FROM user_thenest WHERE user_id = ? AND story_id = ?',
        [userId, storyId],
        (error, result) => {
          if (error) {
            console.error('Error deleting user story: ', error);
            return callback(error);
          }
    
          return callback(null, result);
        }
      );
    };

    TheNestModel.getRecommendedStories = (userId, callback) => {
      // Retrieve data from v_matching_tag_name, selecting only one row for each unique storyId
      dbConn.query(
        'SELECT MAX(user_id) as user_id, MAX(story_id) as story_id, storyId, MAX(tag_name) as tag_name, story_title, story_imageId, isVip, MAX(isPublished) as isPublished, imageId, url, author FROM v_matching_tag_name WHERE user_id = ? AND isPublished = 1 GROUP BY storyId',
        [userId],
        (error, recommendedStories) => {
          if (error) {
            console.error('Error retrieving recommended stories: ', error);
            return callback(error, null);
          }
    
          return callback(null, recommendedStories);
        }
      );
    };
    

TheNestModel.searchTitlesAndUserIDsInUserThenestView = (title, user_id, callback) => {
  const sqlQuery = `
    SELECT *
    FROM user_thenest_view
    WHERE title LIKE ? AND user_id = ?
  `;

  dbConn.query(sqlQuery, [`%${title}%`, user_id], (error, result) => {
    if (error) {
      console.error("Error searching titles and user IDs in user_thenest_view: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

TheNestModel.searchVipTitlesAndUserIDsInUserThenestView = (title, user_id, callback) => {
  const sqlQuery = `
    SELECT *
    FROM user_thenest_view
    WHERE title LIKE ? AND user_id = ? AND isVIP = 1
  `;

  dbConn.query(sqlQuery, [`%${title}%`, user_id], (error, result) => {
    if (error) {
      console.error("Error searching VIP titles and user IDs in user_thenest_view: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

TheNestModel.searchMatchingTagNameViewByUserAndTitle = (user_id, title, callback) => {
  const sqlQuery = `
    SELECT storyId AS story_id, story_title AS title, status, category, url, isPublished,createdAt, author
    FROM matching_tag_name_view
    WHERE user_id = ? AND story_title LIKE ?
  `;

  dbConn.query(sqlQuery, [user_id, `%${title}%`], (error, result) => {
    if (error) {
      console.error("Error searching matching_tag_name_view by user_id and title: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};



module.exports = TheNestModel;
