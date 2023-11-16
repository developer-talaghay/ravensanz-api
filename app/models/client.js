const dbConn = require("../config/db.config");
const cheerio = require('cheerio');

const ClientModel = {};

ClientModel.getStoryImages = (callback) => {
  dbConn.query("SELECT * FROM v_story_images WHERE isPublished = 1", (error, result) => {
    if (error) {
      console.error("Error retrieving story images: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

ClientModel.getOngoingStories = (callback) => {
    dbConn.query(
      "SELECT * FROM v_story_images WHERE status = 'Ongoing' AND isPublished = 1 AND isVIP = 0",
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
      "SELECT * FROM v_story_images WHERE status = 'Completed' AND isPublished = 1 AND isVIP = 0",
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
    dbConn.query("SELECT * FROM v_story_details WHERE isPublished = 1 AND isVIP = 0", (error, result) => {
      if (error) {
        console.error("Error retrieving story details: ", error);
        return callback(error, null);
      }
  
      return callback(null, result);
    });
  };


// Model
ClientModel.getStoryDetailsById = (storyId, userId, callback) => {
  const response = {}; // Create an object to store the response data

  // Get story details from v_story_details where isPublished = 1
  dbConn.query("SELECT * FROM v_story_details WHERE id = ? AND isPublished = 1", [storyId], (error, storyDetails) => {
      if (error) {
          console.error("Error retrieving story details by id: ", error);
          return callback(error, null);
      }

      if (storyDetails.length === 0) {
          // No data found for the provided storyId
          return callback("No story details found for the provided storyId", null);
      }

      // Create the data object with story details
      const data = {
          id: storyDetails[0].id,
          title: storyDetails[0].title,
          overview: storyDetails[0].overview,
          totalBookmarks: storyDetails[0].totalBookmarks,
          totalViews: storyDetails[0].totalViews,
          totalPublishedChapters: storyDetails[0].totalPublishedChapters,
          totalLikers: storyDetails[0].totalLikers,
          isCompleted: storyDetails[0].isCompleted,
          isPublished: storyDetails[0].isPublished,
          imageUrl: storyDetails[0].imageUrl,
          isVIP: storyDetails[0].isVIP,
          author: storyDetails[0].author,
          tags: [],
      };

      // Get related tags from story_tags
      dbConn.query("SELECT name FROM story_tags WHERE storyId = ?", [storyId], (error, tagDetails) => {
          if (error) {
              console.error("Error retrieving tag details by storyId: ", error);
              return callback(error, null);
          }

          data.tags = tagDetails.map(tag => tag.name);

          // If a userId is provided, get user purchase details for that user
          if (userId) {
              dbConn.query("SELECT user_id, story_episodes, purchase_status, created_at FROM user_purchase WHERE story_id = ? AND user_id = ?", [storyId, userId], (error, userPurchaseDetails) => {
                  if (error) {
                      console.error("Error retrieving user purchase details by user_id and story_id: ", error);
                      return callback(error, null);
                  }

                  data.userPurchaseDetails = userPurchaseDetails.map(purchase => ({
                      user_id: purchase.user_id,
                      subTitle: purchase.story_episodes,
                      purchase_status: purchase.purchase_status,
                      updatedAt: purchase.created_at,
                  }));

                  // Get story episodes from story_episodes by storyId
                  dbConn.query("SELECT subTitle, storyLine, isVIP, status, wingsRequired FROM story_episodes WHERE storyId = ? AND status = 'Published'", [storyId], (error, episodeDetails) => {
                      if (error) {
                          console.error("Error retrieving story episodes by storyId: ", error);
                          return callback(error, null);
                      }

                      data.episodes = episodeDetails;

                      // Add data object to the response
                      response.message = "Story details retrieved by storyId";
                      response.data = [data];

                      return callback(null, response);
                  });
              });
          } else {
              // If no userId provided, get story episodes from story_episodes by storyId
              dbConn.query("SELECT subTitle, storyLine, isVIP, status, wingsRequired FROM story_episodes WHERE storyId = ? AND status = 'Published'", [storyId], (error, episodeDetails) => {
                  if (error) {
                      console.error("Error retrieving story episodes by storyId: ", error);
                      return callback(error, null);
                  }

                  data.episodes = episodeDetails;

                  // Add data object to the response
                  response.message = "Story details retrieved by storyId";
                  response.data = [data];

                  return callback(null, response);
              });
          }
      });
  });
};

  ClientModel.getRelatedStoriesByTag = (tagName, callback) => {
    const query = "SELECT * FROM v_story_tags WHERE tag_name LIKE '%" + tagName + "%' AND isPublished = 1 AND isVIP = 0";

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
    "SELECT * FROM v_story_images WHERE isPublished = 1 AND isVIP = 0 ORDER BY createdAt DESC LIMIT 10",
    (error, result) => {
      if (error) {
        console.error("Error retrieving ongoing stories: ", error);
        return callback(error, null);
      }

      return callback(null, result);
    }
  );
};

ClientModel.insertStoryId = (userId, storyId, read, callback) => {
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
          [userId, storyId, read],
          (insertError) => {
            if (insertError) {
              console.error('Error inserting new record: ', insertError);
              return callback(insertError);
            }

            // Update totalViews in story_lists
            dbConn.query(
              'UPDATE story_lists SET totalViews = totalViews + ? WHERE id = ?',
              [read, storyId],
              (updateError) => {
                if (updateError) {
                  console.error('Error updating totalViews: ', updateError);
                  return callback(updateError);
                }

                return callback(null, 'New record inserted successfully');
              }
            );
          }
        );
      } else {
        // If matching record found, update the existing record
        dbConn.query(
          'UPDATE user_last_read SET modified_at = NOW() WHERE user_id = ? AND story_id = ?',
          [read, userId, storyId],
          (updateError) => {
            if (updateError) {
              console.error('Error updating existing record: ', updateError);
              return callback(updateError);
            }
        
            // No need to update totalViews in story_lists
        
            return callback(null, 'Record updated successfully');
          }
        );
      }
    }
  );
};



 // Model
 ClientModel.getStoryDetails = (userId, callback) => {
  // Get the latest record from user_last_read for the given user_id
  dbConn.query(
    'SELECT ulr.*, vsi.* FROM user_last_read ulr ' +
    'LEFT JOIN v_story_images vsi ON ulr.story_id = vsi.story_id ' +
    'WHERE ulr.user_id = ? AND isPublished = 1 AND isVIP = 0 ' +
    'ORDER BY ulr.modified_at DESC ' +
    'LIMIT 100',
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
    'SELECT * FROM v_story_vip WHERE isPublished = 1',
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
    WHERE (title LIKE ? OR author LIKE ?) AND isPublished = 1
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
    WHERE isPublished = 1 AND isVIP = 0
  `;
  
  dbConn.query(sqlQuery, (error, result) => {
    if (error) {
      console.error("Error retrieving published story details: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

ClientModel.searchOngoingStories = (searchQuery, callback) => {
  const sqlQuery = `
    SELECT * 
    FROM v_story_images 
    WHERE (title LIKE ? OR author LIKE ?) AND status = 'Ongoing' AND isPublished = '1' AND isVIP = 0
  `;

  dbConn.query(sqlQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (error, result) => {
    if (error) {
      console.error("Error searching ongoing stories: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};


ClientModel.searchCompletedStories = (searchQuery, callback) => {
  const sqlQuery = `
    SELECT * 
    FROM v_story_images 
    WHERE (title LIKE ? OR author LIKE ?) AND status = 'Completed' AND isPublished = 1 AND isVIP = 0
  `;

  dbConn.query(sqlQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (error, result) => {
    if (error) {
      console.error("Error searching completed stories: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};


ClientModel.searchNewestStories = (searchQuery, callback) => {
  const sqlQuery = `
    SELECT *
    FROM v_story_images
    WHERE (title LIKE ? OR author LIKE ?) AND isPublished = 1 AND isVIP = 0
    ORDER BY createdAt DESC
    LIMIT 10
  `;

  dbConn.query(sqlQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (error, result) => {
    if (error) {
      console.error("Error searching newest stories: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

ClientModel.searchVipStories = (searchQuery, callback) => {
  const sqlQuery = `
    SELECT *
    FROM v_story_images
    WHERE (title LIKE ? OR author LIKE ?) AND isVIP = 1
  `;

  dbConn.query(sqlQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (error, result) => {
    if (error) {
      console.error("Error searching VIP stories: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

ClientModel.searchUserLastReadWithImages = (searchQuery, userId, callback) => {
  const sqlQuery = `
    SELECT story_id, title, status, category, image_id, url, isVip AS isVIP, isPublished, createdAt, author
    FROM user_last_read_with_images
    WHERE (title LIKE ? OR author LIKE ?) AND user_id = ?
  `;

  dbConn.query(sqlQuery, [`%${searchQuery}%`, `%${searchQuery}%`, userId], (error, result) => {
    if (error) {
      console.error("Error searching user_last_read_with_images: ", error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

ClientModel.likeStory = (userId, storyId, callback) => {
  // Check if the user_id and story_id already exist in user_likes
  dbConn.query(
    'SELECT * FROM user_likes WHERE user_id = ? AND story_id = ?',
    [userId, storyId],
    (error, result) => {
      if (error) {
        console.error('Error checking for existing record: ', error);
        return callback(error);
      }

      if (result.length > 0) {
        // If a matching record is found, it means the user already likes the story
        return callback(null, 'alreadyExists');
      } else {
        // If no matching record found, insert a new row into user_likes
        dbConn.query(
          'INSERT INTO user_likes (user_id, story_id) VALUES (?, ?)',
          [userId, storyId],
          (insertError) => {
            if (insertError) {
              console.error('Error inserting new record: ', insertError);
              return callback(insertError);
            }

            // Update totalLikers in story_lists
            dbConn.query(
              'UPDATE story_lists SET totalLikers = totalLikers + 1 WHERE id = ?',
              [storyId],
              (updateError) => {
                if (updateError) {
                  console.error('Error updating totalLikers: ', updateError);
                  return callback(updateError);
                }

                return callback(null, 'liked');
              }
            );
          }
        );
      }
    }
  );
};

ClientModel.unlikeStory = (userId, storyId, totalLikersToSubtract, callback) => {
  // Check if the user_id and story_id exist in user_likes
  dbConn.query(
    'SELECT * FROM user_likes WHERE user_id = ? AND story_id = ?',
    [userId, storyId],
    (error, result) => {
      if (error) {
        console.error('Error checking for existing record: ', error);
        return callback(error);
      }

      if (result.length === 0) {
        // If no matching record found, it means the user does not like the story
        return callback(null, 'notFound');
      } else {
        // If matching record found, delete the row from user_likes
        dbConn.query(
          'DELETE FROM user_likes WHERE user_id = ? AND story_id = ?',
          [userId, storyId],
          (deleteError) => {
            if (deleteError) {
              console.error('Error deleting record: ', deleteError);
              return callback(deleteError);
            }

            // Update totalLikers in story_lists
            dbConn.query(
              'UPDATE story_lists SET totalLikers = totalLikers - ? WHERE id = ?',
              [totalLikersToSubtract, storyId],
              (updateError) => {
                if (updateError) {
                  console.error('Error updating totalLikers: ', updateError);
                  return callback(updateError);
                }

                return callback(null, 'unliked');
              }
            );
          }
        );
      }
    }
  );
};

ClientModel.getLikedStories = (userId, callback) => {
  // Query to retrieve liked stories for a user from v_user_likes
  dbConn.query(
    'SELECT * FROM v_user_likes WHERE user_id = ?',
    [userId],
    (error, likedStories) => {
      if (error) {
        console.error('Error retrieving liked stories for user: ', error);
        return callback(error, null);
      }

      // Return the liked stories
      return callback(null, likedStories);
    }
  );
};

// model
ClientModel.commentStory = (userId, storyId, comment, callback) => {
  // Function to insert the new comment
  function insertComment(parentCommentId) {
    dbConn.query(
      'INSERT INTO user_story_comments (user_id, story_id, comment, parent_comment_id) VALUES (?, ?, ?, ?)',
      [userId, storyId, comment, parentCommentId],
      (error, result) => {
        if (error) {
          console.error('Error inserting comment: ', error);
          return callback(error);
        }

        const comment_id = result.insertId;
        const created_at = new Date();
        const modified_at = new Date();

        const insertedComment = {
          comment_id,
          user_id: userId,
          parentCommentId,
          comment,
          created_at,
          modified_at,
        };

        return callback(null, insertedComment);
      }
    );
  }

  // Call the insertComment function for top-level comments
  insertComment(null);
};

ClientModel.replyCommentStory = (userId, storyId, comment, parentCommentId, callback) => {
  dbConn.query(
    'INSERT INTO user_story_comments (user_id, story_id, comment, parent_comment_id) VALUES (?, ?, ?, ?)',
    [userId, storyId, comment, parentCommentId],
    (error, result) => {
      if (error) {
        console.error('Error replying to comment: ', error);
        return callback(error);
      }

      const comment_id = result.insertId;
      const created_at = new Date();
      const modified_at = new Date();

      const insertedComment = {
        comment_id,
        user_id: userId,
        parentCommentId,
        comment,
        created_at,
        modified_at,
      };

      return callback(null, insertedComment);
    }
  );
};


ClientModel.updateComment = (userId, storyId, comment, commentId, callback) => {
  dbConn.query(
    'UPDATE user_story_comments SET comment = ? WHERE user_id = ? AND story_id = ? AND comment_id = ?',
    [comment, userId, storyId, commentId],
    (error) => {
      if (error) {
        console.error('Error updating comment: ', error);
        return callback(error);
      }

      // Get the updated comment's details
      dbConn.query(
        'SELECT * FROM user_story_comments WHERE user_id = ? AND story_id = ? AND comment_id = ?',
        [userId, storyId, commentId],
        (selectError, result) => {
          if (selectError) {
            console.error('Error fetching updated comment: ', selectError);
            return callback(selectError);
          }

          const updatedComment = result[0]; // Assuming the query returns a single row

          return callback(null, updatedComment);
        }
      );
    }
  );
};


ClientModel.getAllCommentsByStoryId = (storyId, callback) => {
  // Define the SQL query to fetch comments by story_id and alias the parent_comment_id as "replied_to"
  const sqlQuery = 'SELECT comment_id, user_id, full_name, display_name, url, story_id, comment, parent_comment_id AS replied_to, path, likes, flagged, created_at, modified_at FROM user_comments_all WHERE story_id = ? ORDER BY modified_at DESC;';

  dbConn.query(sqlQuery, [storyId], (error, result) => {
    if (error) {
      console.error('Error fetching comments by story_id: ', error);
      return callback(error, null);
    }

    // Filter out comments with "flagged" count < 3
    const filteredComments = result.filter(comment => comment.flagged < 3);

    // Update the url value to the default if it's NULL
    for (const comment of filteredComments) {
      if (comment.url === null) {
        comment.url = 'http://18.117.252.199:8000/images/default_ic.png';
      }
      if (comment.display_name === null) {
        comment.display_name = 'Anonymous';
      }
    }

    // Process the comments to create a nested structure
    const nestedComments = createNestedComments(filteredComments);

    return callback(null, nestedComments);
  });
};


function createNestedComments(comments) {
  const commentMap = new Map();
  const rootComments = [];

  // Organize comments into a map using their comment_id as keys
  comments.forEach((comment) => {
    comment.replies = []; // Initialize replies array for each comment
    commentMap.set(comment.comment_id, comment);
  });

  // Build the nested structure by connecting replies to their parent comments
  comments.forEach((comment) => {
    const parentPath = comment.path.substring(0, comment.path.lastIndexOf('/'));
    const parentId = commentMap.get(parentPath);

    if (parentId) {
      parentId.replies.push(comment);
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}


ClientModel.likeComment = (user_id, comment_id, story_id, callback) => {
  // Check if the comment_id exists in user_story_comments
  dbConn.query(
    'SELECT * FROM user_story_comments WHERE comment_id = ?',
    [comment_id],
    (selectError, result) => {
      if (selectError) {
        console.error('Error checking for existing comment: ', selectError);
        return callback(selectError);
      }

      if (result.length === 0) {
        // If no matching comment found, return an error
        return callback(new Error('Comment not found'));
      } else {
        // Check if the user has already liked this comment
        dbConn.query(
          'SELECT * FROM user_liked_comments WHERE user_id = ? AND comment_id = ? AND story_id = ?',
          [user_id, comment_id, story_id],
          (likeCheckError, likeCheckResult) => {
            if (likeCheckError) {
              console.error('Error checking for existing like: ', likeCheckError);
              return callback(likeCheckError);
            }

            if (likeCheckResult.length === 0) {
              // Insert into user_liked_comments
              dbConn.query(
                'INSERT INTO user_liked_comments (user_id, comment_id, story_id) VALUES (?, ?, ?)',
                [user_id, comment_id, story_id],
                (insertError) => {
                  if (insertError) {
                    console.error('Error inserting into user_liked_comments: ', insertError);
                    return callback(insertError);
                  }

                  // Update the likes count in user_story_comments
                  dbConn.query(
                    'UPDATE user_story_comments SET likes = likes + 1 WHERE comment_id = ?',
                    [comment_id],
                    (updateError) => {
                      if (updateError) {
                        console.error('Error updating likes count: ', updateError);
                        return callback(updateError);
                      }

                      return callback(null, 'liked');
                    }
                  );
                }
              );
            } else {
              return callback(null, 'alreadyLiked');
            }
          }
        );
      }
    }
  );
};


ClientModel.deleteComment = (user_id, comment_id, story_id, callback) => {
  // Check if the comment_id, user_id, and story_id match or if parent_comment_id equals comment_id
  dbConn.query(
    'DELETE FROM user_story_comments WHERE (comment_id = ? AND user_id = ? AND story_id = ?) OR (parent_comment_id = ?)',
    [comment_id, user_id, story_id, comment_id],
    (deleteError, result) => {
      if (deleteError) {
        console.error('Error deleting comment: ', deleteError);
        return callback(deleteError);
      }

      if (result.affectedRows > 0) {
        // If the row(s) were deleted, return 'deleted'
        return callback(null, 'deleted');
      } else {
        // If no matching row(s) found, return 'not found'
        return callback(null, 'not found');
      }
    }
  );
};

// Add the 'nodemailer' module for sending emails
const nodemailer = require('nodemailer');

// Create a nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "developer.talaghay@gmail.com",
      pass: "tcqslwipuknbeocc",
  },
});

// Function to send an email
function sendFlaggedCommentEmail(email, comment) {
  const mailOptions = {
    from: 'Raven Sanz Accounts <noreply@gmail.com>',
    to: email,
    subject: 'Comment Flagged',
    text: `Your comment has been flagged too many times and has been taken down.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

ClientModel.flagComment = (user_id, comment_id, story_id, callback) => {
  // Check if the comment exists
  dbConn.query(
    'SELECT * FROM user_story_comments WHERE comment_id = ? AND story_id = ? AND user_id = ?',
    [comment_id, story_id, user_id],
    (selectError, result) => {
      if (selectError) {
        console.error('Error checking for existing comment: ', selectError);
        return callback(selectError);
      }

      if (result.length === 0) {
        // If no matching comment is found, return an error
        return callback(new Error('Comment not found'));
      }

      // Update the `flagged` column for the given `comment_id`, `story_id`, and `user_id`
      dbConn.query(
        'UPDATE user_story_comments SET flagged = flagged + 1 WHERE comment_id = ? AND story_id = ? AND user_id = ?',
        [comment_id, story_id, user_id],
        (updateError) => {
          if (updateError) {
            console.error('Error flagging comment: ', updateError);
            return callback(updateError);
          }

          // Check if the 'flagged' count reaches 3
          if (result[0].flagged + 1 === 3) {
            // Fetch the email of the user from the user table
            dbConn.query(
              'SELECT email_add FROM user WHERE id = ?',
              [user_id],
              (fetchError, userResult) => {
                if (fetchError) {
                  console.error('Error fetching user email: ', fetchError);
                  return callback(fetchError);
                }

                // Send an email to the user
                const userEmail = userResult[0].email_add;
                sendFlaggedCommentEmail(userEmail, result[0]);
                return callback(null, 'flagged');
              }
            );
          } else {
            return callback(null, 'flagged');
          }
        }
      );
    }
  );
};


ClientModel.unlikeComment = (user_id, comment_id, story_id, callback) => {
  // Check if the comment_id exists in user_story_comments
  dbConn.query(
    'SELECT * FROM user_story_comments WHERE comment_id = ?',
    [comment_id],
    (selectError, result) => {
      if (selectError) {
        console.error('Error checking for existing comment: ', selectError);
        return callback(selectError);
      }

      if (result.length === 0) {
        // If no matching comment found, return an error
        return callback(new Error('Comment not found'));
      } else {
        // Delete the entry from user_liked_comments
        dbConn.query(
          'DELETE FROM user_liked_comments WHERE user_id = ? AND comment_id = ? AND story_id = ?',
          [user_id, comment_id, story_id],
          (deleteError) => {
            if (deleteError) {
              console.error('Error deleting like: ', deleteError);
              return callback(deleteError);
            }

            // Update the likes count in user_story_comments
            dbConn.query(
              'UPDATE user_story_comments SET likes = likes - 1 WHERE comment_id = ?',
              [comment_id],
              (updateError) => {
                if (updateError) {
                  console.error('Error updating likes count: ', updateError);
                  return callback(updateError);
                }

                return callback(null, 'unliked');
              }
            );
          }
        );
      }
    }
  );
};

ClientModel.getUserLikedComment = (user_id, story_id, callback) => {
  // Define the SQL query to fetch liked comments by user_id, story_id
  const sqlQuery = 'SELECT * FROM user_liked_comments WHERE user_id = ? AND story_id = ?';

  dbConn.query(sqlQuery, [user_id, story_id], (error, result) => {
    if (error) {
      console.error('Error fetching liked comment: ', error);
      return callback(error, null);
    }

    return callback(null, result);
  });
};

// Purchase story with wings
ClientModel.purchaseStoryWithWings = (user_id, story_id, story_episodes, wingsRequired, callback) => {
  // Check if the user has already bought the story
  dbConn.query(
    'SELECT purchase_status FROM user_purchase WHERE user_id = ? AND story_id = ? AND story_episodes = ?',
    [user_id, story_id, story_episodes],
    (error, purchaseResults) => {
      if (error) {
        console.error('Error checking if the user has already bought the story: ', error);
        return callback(error);
      }

      if (purchaseResults.length > 0 && purchaseResults[0].purchase_status === 1) {
        // The user has already bought the story
        return callback({ message: 'Already bought. Thank you' }, null);
      }

      // If the user hasn't bought the story, check if they have enough wings
      dbConn.query('SELECT wingsCount FROM user_details WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
          console.error('Error retrieving user wingsCount: ', error);
          return callback(error);
        }

        if (results.length === 0) {
          return callback({ message: 'User not found' }, null);
        }

        const wingsCount = results[0].wingsCount;

        // Check if the user has enough wings
        if (wingsCount < wingsRequired) {
          return callback({ message: 'Insufficient wings. Please try again' }, null);
        }

        // If the user has enough wings, subtract the wingsCount
        const updatedWingsCount = wingsCount - wingsRequired;

        // Update the user's wingsCount in the user_details table
        dbConn.query('UPDATE user_details SET wingsCount = ? WHERE user_id = ?', [updatedWingsCount, user_id], (error, updateResult) => {
          if (error) {
            console.error('Error updating user wingsCount: ', error);
            return callback(error);
          }

          if (updateResult.affectedRows === 0) {
            return callback({ message: 'Failed to update wingsCount' }, null);
          }

          // Insert the purchase record
          const purchaseData = {
            user_id,
            story_id,
            story_episodes,
            purchase_status: 1, // Set purchase_status to 1
          };

          dbConn.query('INSERT INTO user_purchase SET ?', purchaseData, (error, result) => {
            if (error) {
              console.error('Error inserting purchase record: ', error);
              return callback(error, null);
            }

            return callback(null, result);
          });
        });
      });
    }
  );
};

ClientModel.getWingsCountByUserId = (user_id, callback) => {
  // Define the SQL query to fetch wingsCount by user_id
  const sqlQuery = 'SELECT wingsCount FROM user_details WHERE user_id = ?';

  dbConn.query(sqlQuery, [user_id], (error, result) => {
    if (error) {
      console.error('Error fetching wingsCount by user_id: ', error);
      return callback(error, null);
    }

    if (result.length === 0) {
      return callback({ message: 'User not found' }, null);
    }

    const wingsCount = result[0].wingsCount;

    return callback(null, wingsCount);
  });
};

ClientModel.addWings = (user_id, full_name, wingsToAdd, callback) => {
  // Check if the user exists
  dbConn.query('SELECT wingsCount FROM user_details WHERE user_id = ? AND full_name = ?', [user_id, full_name], (error, results) => {
    if (error) {
      console.error('Error retrieving user wingsCount: ', error);
      return callback(error, null);
    }

    if (results.length === 0) {
      return callback({ message: 'User not found' }, null);
    }

    const currentWingsCount = results[0].wingsCount;

    // Calculate the updated wingsCount
    const updatedWingsCount = currentWingsCount + wingsToAdd;

    // Update the user's wingsCount in the user_details table
    dbConn.query('UPDATE user_details SET wingsCount = ? WHERE user_id = ? AND full_name = ?', [updatedWingsCount, user_id, full_name], (error, updateResult) => {
      if (error) {
        console.error('Error updating user wingsCount: ', error);
        return callback(error, null);
      }

      return callback(null, { message: 'Wings added successfully' });
    });
  });
};

ClientModel.getStoryByPage = (storyId, storyEpisode, page, limit, userId, callback) => {
  const response = {};

  // Calculate the offset based on the page and limit
  const offset = (page - 1) * limit;

  dbConn.query(
      'SELECT subTitle, storyLine FROM story_episodes WHERE storyId = ? AND subTitle = ?',
      [storyId, storyEpisode],
      (error, episodeDetails) => {
          if (error) {
              console.error('Error retrieving story episodes by storyId and subTitle: ', error);
              return callback(error, null);
          }

          // Calculate the total number of words in the episode
          const totalWords = episodeDetails[0].storyLine.split(/\s+/).length;

          // Split the storyLine into pages based on the word count
          const pages = [];
          let currentPage = [];
          let currentWordCount = 0;

          for (const word of episodeDetails[0].storyLine.split(/\s+/)) {
              if (currentWordCount + word.length <= limit) {
                  currentPage.push(word);
                  currentWordCount += word.length + 1; // Include the space
              } else {
                  pages.push(currentPage.join(' '));
                  currentPage = [word];
                  currentWordCount = word.length + 1;
              }
          }

          if (currentPage.length > 0) {
              pages.push(currentPage.join(' '));
          }

          // Get the specified page of content
          const selectedPage = pages[Math.min(page - 1, pages.length - 1)];

          // Add story episodes to the response object
          response.message = 'Story episodes retrieved by storyId and subTitle with pagination';
          response.data = [{ subTitle: episodeDetails[0].subTitle, storyLine: selectedPage }];

          // Now, get user purchase details
          dbConn.query(
              'SELECT user_id, story_episodes, purchase_status, created_at FROM user_purchase WHERE story_id = ? AND user_id = ? AND story_episodes = ?',
              [storyId, userId, storyEpisode],
              (purchaseError, userPurchaseDetails) => {
                  if (purchaseError) {
                      console.error('Error retrieving user purchase details by user_id and story_id: ', purchaseError);
                      return callback(purchaseError, null);
                  }

                  response.userPurchaseDetails = userPurchaseDetails.map(purchase => ({
                      user_id: purchase.user_id,
                      subTitle: purchase.story_episodes,
                      purchase_status: purchase.purchase_status,
                      updatedAt: purchase.created_at,
                  }));

                  return callback(null, response);
              }
          );
      }
  );
};

// Function to strip HTML tags
function stripHtmlTags(html) {
  return html.replace(/<[^>]*>/g, '');
}

ClientModel.getStoryByPage2 = (storyId, userId, characterCount, callback) => {
  // Get story details from v_story_details where isPublished = 1
  dbConn.query("SELECT * FROM v_story_details WHERE id = ? AND isPublished = 1", [storyId], (error, storyDetails) => {
    if (error) {
      console.error("Error retrieving story details by id: ", error);
      return callback(error, null);
    }

    if (storyDetails.length === 0) {
      // No data found for the provided storyId
      return callback("No story details found for the provided storyId", null);
    }

    // Create the data object with story details
    const data = {
      id: storyDetails[0].id,
      title: storyDetails[0].title,
      overview: storyDetails[0].overview,
      totalBookmarks: storyDetails[0].totalBookmarks,
      totalViews: storyDetails[0].totalViews,
      totalPublishedChapters: storyDetails[0].totalPublishedChapters,
      totalLikers: storyDetails[0].totalLikers,
      isCompleted: storyDetails[0].isCompleted,
      isPublished: storyDetails[0].isPublished,
      imageUrl: storyDetails[0].imageUrl,
      isVIP: storyDetails[0].isVIP,
      author: storyDetails[0].author,
      tags: [],
      storyLine: [], // Create an array to store storyLine data
    };

    // Get related tags from story_tags
    dbConn.query("SELECT name FROM story_tags WHERE storyId = ?", [storyId], (error, tagDetails) => {
      if (error) {
        console.error("Error retrieving tag details by storyId: ", error);
        return callback(error, null);
      }

      data.tags = tagDetails.map(tag => tag.name);

      // If a userId is provided, get user purchase details for that user
      if (userId) {
        dbConn.query("SELECT user_id, story_episodes, purchase_status, created_at FROM user_purchase WHERE story_id = ? AND user_id = ?", [storyId, userId], (error, userPurchaseDetails) => {
          if (error) {
            console.error("Error retrieving user purchase details by user_id and story_id: ", error);
            return callback(error, null);
          }

          data.userPurchaseDetails = userPurchaseDetails.map(purchase => ({
            user_id: purchase.user_id,
            subTitle: purchase.story_episodes,
            purchase_status: purchase.purchase_status,
            updatedAt: purchase.created_at,
          }));

          // Get story episodes from story_episodes by storyId
          dbConn.query("SELECT subTitle, storyLine, isVIP, status, wingsRequired FROM story_episodes WHERE storyId = ? AND status = 'Published'", [storyId], (error, episodeDetails) => {
            if (error) {
              console.error("Error retrieving story episodes by storyId: ", error);
              return callback(error, null);
            }

            // Organize storyLine into pages with character count limit
            for (let i = 0; i < episodeDetails.length; i++) {
              const episode = episodeDetails[i];
              const storyPages = [];

              // Ensure storyLine is an array
              const storyLineArray = Array.isArray(episode.storyLine) ? episode.storyLine : [episode.storyLine];

              // Apply stripHtmlTags to each element
              const strippedContent = storyLineArray.map(stripHtmlTags);

              let currentPage = '';
              let currentCharacterCount = 0;
              let pageCount = 1;

              for (let j = 0; j < strippedContent.length; j++) {
                const words = strippedContent[j].split(/\s+/).filter(word => word.length > 0);

                for (let k = 0; k < words.length; k++) {
                  currentPage += words[k] + ' ';
                  currentCharacterCount += words[k].length + 1; // Add 1 for the space

                  if (currentCharacterCount >= characterCount) {
                    storyPages.push({ [`page${pageCount}`]: currentPage.trim() });
                    currentPage = '';
                    currentCharacterCount = 0;
                    pageCount++;
                  }
                }
              }

              if (currentPage.length > 0) {
                storyPages.push({ [`page${pageCount}`]: currentPage.trim() });
              }

              data.storyLine.push({
                subTitle: episode.subTitle,
                storyLine: storyPages,
              });
            }

            // Return the data object
            return callback(null, data);
          });
        });
      } else {
        // If no userId provided, get story episodes from story_episodes by storyId
        dbConn.query("SELECT subTitle, storyLine, isVIP, status, wingsRequired FROM story_episodes WHERE storyId = ? AND status = 'Published'", [storyId], (error, episodeDetails) => {
          if (error) {
            console.error("Error retrieving story episodes by storyId: ", error);
            return callback(error, null);
          }

          // Organize storyLine into pages with character count limit
          for (let i = 0; i < episodeDetails.length; i++) {
            const episode = episodeDetails[i];
            const storyPages = [];

            // Ensure storyLine is an array
            const storyLineArray = Array.isArray(episode.storyLine) ? episode.storyLine : [episode.storyLine];

            // Apply stripHtmlTags to each element
            const strippedContent = storyLineArray.map(stripHtmlTags);

            let currentPage = '';
            let currentCharacterCount = 0;
            let pageCount = 1;

            for (let j = 0; j < strippedContent.length; j++) {
              const words = strippedContent[j].split(/\s+/).filter(word => word.length > 0);

              for (let k = 0; k < words.length; k++) {
                currentPage += words[k] + ' ';
                currentCharacterCount += words[k].length + 1; // Add 1 for the space

                if (currentCharacterCount >= characterCount) {
                  storyPages.push({ [`page${pageCount}`]: currentPage.trim() });
                  currentPage = '';
                  currentCharacterCount = 0;
                  pageCount++;
                }
              }
            }

            if (currentPage.length > 0) {
              storyPages.push({ [`page${pageCount}`]: currentPage.trim() });
            }

            data.storyLine.push({
              subTitle: episode.subTitle,
              storyLine: storyPages,
            });
          }

          // Return the data object
          return callback(null, data);
        });
      }
    });
  });
};

ClientModel.getStoryByPage3 = (storyId, userId, characterCount, callback) => {
  const response = {};

  // Get story details from v_story_details where isPublished = 1
  dbConn.query("SELECT * FROM v_story_details WHERE id = ? AND isPublished = 1", [storyId], (error, storyDetails) => {
    if (error) {
      console.error("Error retrieving story details by id: ", error);
      return callback(error, null);
    }

    if (storyDetails.length === 0) {
      // No data found for the provided storyId
      return callback("No story details found for the provided storyId", null);
    }

    // Create the data object with story details
    const data = {
      id: storyDetails[0].id,
      title: storyDetails[0].title,
      overview: storyDetails[0].overview,
      totalBookmarks: storyDetails[0].totalBookmarks,
      totalViews: storyDetails[0].totalViews,
      totalPublishedChapters: storyDetails[0].totalPublishedChapters,
      totalLikers: storyDetails[0].totalLikers,
      isCompleted: storyDetails[0].isCompleted,
      isPublished: storyDetails[0].isPublished,
      imageUrl: storyDetails[0].imageUrl,
      isVIP: storyDetails[0].isVIP,
      author: storyDetails[0].author,
      tags: [],
      storyLine: [], // Create an array to store storyLine data
    };

    // Get related tags from story_tags
    dbConn.query("SELECT name FROM story_tags WHERE storyId = ?", [storyId], (error, tagDetails) => {
      if (error) {
        console.error("Error retrieving tag details by storyId: ", error);
        return callback(error, null);
      }

      data.tags = tagDetails.map(tag => tag.name);

      // If a userId is provided, get user purchase details for that user
      if (userId) {
        dbConn.query("SELECT user_id, story_episodes, purchase_status, created_at FROM user_purchase WHERE story_id = ? AND user_id = ?", [storyId, userId], (error, userPurchaseDetails) => {
          if (error) {
            console.error("Error retrieving user purchase details by user_id and story_id: ", error);
            return callback(error, null);
          }

          data.userPurchaseDetails = userPurchaseDetails.map(purchase => ({
            user_id: purchase.user_id,
            subTitle: purchase.story_episodes,
            purchase_status: purchase.purchase_status,
            updatedAt: purchase.created_at,
          }));

          // Get story episodes from story_episodes by storyId
          dbConn.query("SELECT subTitle, storyLine, isVIP, status, wingsRequired FROM story_episodes WHERE storyId = ? AND status = 'Published'", [storyId], (error, episodeDetails) => {
            if (error) {
              console.error("Error retrieving story episodes by storyId: ", error);
              return callback(error, null);
            }

            // Organize storyLine into pages with character count limit
            episodeDetails.forEach((episode) => {
              const storyLine = episode.storyLine;
              const storyPages = [];
              let page = '';
              let pageCount = 1;

              for (let i = 0; i < storyLine.length; i++) {
                const $ = cheerio.load(storyLine[i], { xmlMode: true });

                page += $.html(); // Extract HTML content

                if (page.length >= characterCount) {
                  storyPages.push({ [`page${pageCount}`]: page });
                  page = '';
                  pageCount++;
                }
              }

              if (page.length > 0) {
                storyPages.push({ [`page${pageCount}`]: page });
              }

              data.storyLine.push({
                subTitle: episode.subTitle,
                storyLine: storyPages,
              });
            });

            // Add data object to the response
            response.message = "Story details retrieved by storyId";
            response.data = [data];

            return callback(null, data); // Return the data object
          });
        });
      } else {
        // If no userId provided, get story episodes from story_episodes by storyId
        dbConn.query("SELECT subTitle, storyLine, isVIP, status, wingsRequired FROM story_episodes WHERE storyId = ? AND status = 'Published'", [storyId], (error, episodeDetails) => {
          if (error) {
            console.error("Error retrieving story episodes by storyId: ", error);
            return callback(error, null);
          }

          // Organize storyLine into pages with character count limit
          episodeDetails.forEach((episode) => {
            const storyLine = episode.storyLine;
            const storyPages = [];
            let page = '';
            let pageCount = 1;

            for (let i = 0; i < storyLine.length; i++) {
              const $ = cheerio.load(storyLine[i], { xmlMode: true });

              page += $.html(); // Extract HTML content

              if (page.length >= characterCount) {
                storyPages.push({ [`page${pageCount}`]: page });
                page = '';
                pageCount++;
              }
            }

            if (page.length > 0) {
              storyPages.push({ [`page${pageCount}`]: page });
            }

            data.storyLine.push({
              subTitle: episode.subTitle,
              storyLine: storyPages,
            });
          });

          // Add data object to the response
          response.message = "Story details retrieved by storyId";
          response.data = [data];

          return callback(null, data); // Return the data object
        });
      }
    });
  });
};

// Define the followAuthor function in the ClientModel
ClientModel.followAuthor = (userId, displayName, callback) => {
  // Check if the user_id and display_name already exist in user_follows
  dbConn.query(
    'SELECT * FROM user_follows WHERE user_id = ? AND display_name = ?',
    [userId, displayName],
    (error, result) => {
      if (error) {
        console.error('Error checking for existing record: ', error);
        return callback(error);
      }

      if (result.length > 0) {
        // If a matching record is found, it means the user already follows the author
        return callback(null, 'alreadyFollowed');
      } else {
        // If no matching record found, insert a new row into user_follows
        dbConn.query(
          'INSERT INTO user_follows (user_id, display_name) VALUES (?, ?)',
          [userId, displayName],
          (insertError) => {
            if (insertError) {
              console.error('Error inserting new record: ', insertError);
              return callback(insertError);
            }

            // Update followCount in ravensanz_users
            dbConn.query(
              'UPDATE ravensanz_users SET followCount = followCount + 1 WHERE display_name = ?',
              [displayName],
              (updateError) => {
                if (updateError) {
                  console.error('Error updating followCount: ', updateError);
                  return callback(updateError);
                }

                return callback(null, 'followed');
              }
            );
          }
        );
      }
    }
  );
};

// Define the unfollowAuthor function in the ClientModel
ClientModel.unfollowAuthor = (userId, displayName, callback) => {
  // Check if the user_id and display_name already exist in user_follows
  dbConn.query(
    'SELECT * FROM user_follows WHERE user_id = ? AND display_name = ?',
    [userId, displayName],
    (error, result) => {
      if (error) {
        console.error('Error checking for existing record: ', error);
        return callback(error);
      }

      if (result.length === 0) {
        // If no matching record is found, it means the user is not following the author
        return callback(null, 'notFollowing');
      } else {
        // If a matching record found, delete the row from user_follows
        dbConn.query(
          'DELETE FROM user_follows WHERE user_id = ? AND display_name = ?',
          [userId, displayName],
          (deleteError) => {
            if (deleteError) {
              console.error('Error deleting record: ', deleteError);
              return callback(deleteError);
            }

            // Get the current followCount from ravensanz_users
            dbConn.query(
              'SELECT followCount FROM ravensanz_users WHERE display_name = ?',
              [displayName],
              (selectError, selectResult) => {
                if (selectError) {
                  console.error('Error selecting followCount: ', selectError);
                  return callback(selectError);
                }

                if (selectResult.length === 0 || selectResult[0].followCount === 0) {
                  // If followCount is 0, no need to update it
                  return callback(null, 'unfollowed');
                } else {
                  // Update followCount in ravensanz_users (subtract 1)
                  dbConn.query(
                    'UPDATE ravensanz_users SET followCount = followCount - 1 WHERE display_name = ?',
                    [displayName],
                    (updateError) => {
                      if (updateError) {
                        console.error('Error updating followCount: ', updateError);
                        return callback(updateError);
                      }

                      return callback(null, 'unfollowed');
                    }
                  );
                }
              }
            );
          }
        );
      }
    }
  );
};

ClientModel.getFollowedUsers = (userId, callback) => {
  // Query to retrieve followed users for a user from user_follows
  dbConn.query(
    'SELECT * FROM user_follows WHERE user_id = ?',
    [userId],
    (error, followedUsers) => {
      if (error) {
        console.error('Error retrieving followed users for user: ', error);
        return callback(error, null);
      }

      // Return the followed users
      return callback(null, followedUsers);
    }
  );
};



module.exports = ClientModel;
