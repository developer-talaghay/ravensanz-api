const ClientModel = require('../models/client');

const clientController = {};

clientController.getStoriesList = (req, res) => {
  // Call the model to get story images
  ClientModel.getStoryImages((error, storyImages) => {
    if (error) {
      console.error("Error getting story images: ", error);
      return res.status(500).json({ message: "Error getting story images" });
    }

    return res.status(200).json({ message: "Story images retrieved", data: storyImages });
  });
};

clientController.getStoriesListOngoing = (req, res) => {
    // Call the model to get ongoing stories
    ClientModel.getOngoingStories((error, ongoingStories) => {
      if (error) {
        console.error("Error getting ongoing stories: ", error);
        return res.status(500).json({ message: "Error getting ongoing stories" });
      }
  
      return res.status(200).json({ message: "Ongoing stories retrieved", data: ongoingStories });
    });
  };

  clientController.getStoriesListCompleted = (req, res) => {
    // Call the model to get completed stories
    ClientModel.getCompletedStories((error, completedStories) => {
      if (error) {
        console.error("Error getting completed stories: ", error);
        return res.status(500).json({ message: "Error getting completed stories" });
      }
  
      return res.status(200).json({ message: "Completed stories retrieved", data: completedStories });
    });
  };

  clientController.getAllDetails = (req, res) => {
    // Call the model to get all story details
    ClientModel.getAllDetails((error, storyDetails) => {
      if (error) {
        console.error("Error getting story details: ", error);
        return res.status(500).json({ message: "Error getting story details" });
      }
  
      return res.status(200).json({ message: "Story details retrieved", data: storyDetails });
    });
  };

  clientController.getStoryDetailsById = (req, res) => {
    const storyId = req.query.story_id;
    const userId = req.query.user_id;

    if (!storyId) {
        return res.status(400).json({ message: "Missing story_id parameter" });
    }

    // Call the model to get story details and related tags by storyId
    ClientModel.getStoryDetailsById(storyId, userId, (error, storyDetails) => {
        if (error) {
            console.error("Error getting story details by storyId: ", error);
            return res.status(500).json({ message: "No Story Found" });
        }

        return res.status(200).json({ message: "Story details retrieved by storyId", data: storyDetails });
    });
};

  clientController.getRelatedStoryLists = (req, res) => {
    const tags = req.query.tags;

    if (!tags) {
        return res.status(400).json({ message: "Missing tags parameter" });
    }

    // Split the tags into an array
    const tagArray = tags.split(',');

    const relatedStoriesByTags = [];

    // Call the model to get related stories for each tag
    tagArray.forEach(tag => {
        ClientModel.getRelatedStoriesByTag(tag.trim(), (error, relatedStories) => {
            if (error) {
                console.error("Error getting related stories by tag: ", error);
                return res.status(500).json({ message: "Error getting related stories by tag" });
            }

            relatedStoriesByTags.push({ tag, stories: relatedStories });
            
            // Respond when all tags have been processed
            if (relatedStoriesByTags.length === tagArray.length) {
                return res.status(200).json({ message: "Related stories retrieved by tags", data: relatedStoriesByTags });
            }
        });
    });
};

clientController.getStoriesNewArrivals = (req, res) => {
  // Call the model to get the latest 10 completed stories sorted by createdAt
  ClientModel.getNewArrivals((error, completedStories) => {
    if (error) {
      console.error("Error getting completed stories: ", error);
      return res.status(500).json({ message: "Error getting completed stories" });
    }

    return res.status(200).json({ message: "Completed stories retrieved", data: completedStories });
  });
};

clientController.insertStoryId = (req, res) => {
  const { user_id, story_id } = req.body;
  const read = 1;

  if (!user_id || !story_id || read === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.insertStoryId(user_id, story_id, read, (error, result) => {
    if (error) {
      console.error('Error inserting story_id: ', error);
      return res.status(500).json({ message: 'Error inserting story_id' });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({ message: 'Story ID already exists' });
    }

    return res.status(200).json({ message: 'Story ID inserted successfully' });
  });
};
  

clientController.getStoryDetails = (req, res) => {
  const { user_id } = req.query; // Using req.query to get user_id

  if (!user_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.getStoryDetails(user_id, (error, data) => {
    if (error) {
      console.error('Error getting story details: ', error);
      return res.status(500).json({ message: 'Error getting story details' });
    }

    return res.status(200).json({ message: 'Story details retrieved', data });
  });
};

clientController.getStoryVip = (req, res) => {
  // Call the model to get all VIP stories
  ClientModel.getVipStories((error, vipStories) => {
    if (error) {
      console.error("Error getting VIP stories: ", error);
      return res.status(500).json({ message: "Error getting VIP stories" });
    }

    return res.status(200).json({ message: "VIP stories retrieved", data: vipStories });
  });
};

clientController.searchByTitleOrAuthor = (req, res) => {
  const searchQuery = req.query.search;

  // Call the model to search stories
  ClientModel.searchStories(searchQuery, (error, searchResults) => {
    if (error) {
      console.error("Error searching stories: ", error);
      return res.status(500).json({ message: "Error searching stories" });
    }

    return res.status(200).json({ message: "Search results retrieved", data: searchResults });
  });
};

clientController.getStoriesPublished = (req, res) => {
  // Call the model to get published story details
  ClientModel.getPublishedStoryDetails((error, publishedStoryDetails) => {
    if (error) {
      console.error("Error getting published story details: ", error);
      return res.status(500).json({ message: "Error getting published story details" });
    }

    return res.status(200).json({ message: "Published story details retrieved", data: publishedStoryDetails });
  });
};

clientController.searchByTitleOrAuthorOngoing = (req, res) => {
  const searchQuery = req.query.search;

  // Call the model to search ongoing stories
  ClientModel.searchOngoingStories(searchQuery, (error, searchResults) => {
    if (error) {
      console.error("Error searching ongoing stories: ", error);
      return res.status(500).json({ message: "Error searching ongoing stories" });
    }

    return res.status(200).json({ message: "Search results retrieved", data: searchResults });
  });
};

clientController.searchByTitleOrAuthorCompleted = (req, res) => {
  const searchQuery = req.query.search;

  // Call the model to search completed stories
  ClientModel.searchCompletedStories(searchQuery, (error, searchResults) => {
    if (error) {
      console.error("Error searching completed stories: ", error);
      return res.status(500).json({ message: "Error searching completed stories" });
    }

    return res.status(200).json({ message: "Search results retrieved", data: searchResults });
  });
};

clientController.searchByTitleOrAuthorNew = (req, res) => {
  const searchQuery = req.query.search;

  // Call the model to search for the newest stories
  ClientModel.searchNewestStories(searchQuery, (error, searchResults) => {
    if (error) {
      console.error("Error searching newest stories: ", error);
      return res.status(500).json({ message: "Error searching newest stories" });
    }

    return res.status(200).json({ message: "Search results retrieved", data: searchResults });
  });
};

clientController.searchByTitleOrAuthorVip = (req, res) => {
  const searchQuery = req.query.search;

  // Call the model to search for VIP stories
  ClientModel.searchVipStories(searchQuery, (error, searchResults) => {
    if (error) {
      console.error("Error searching VIP stories: ", error);
      return res.status(500).json({ message: "Error searching VIP stories" });
    }

    return res.status(200).json({ message: "Search results retrieved", data: searchResults });
  });
};

clientController.searchByTitleOrAuthorContinue = (req, res) => {
  const searchQuery = req.query.title;
  const userId = req.query.user_id; // Add this line to get the user_id from the request query

  // Call the model to search for user_last_read_with_images
  ClientModel.searchUserLastReadWithImages(searchQuery, userId, (error, searchResults) => {
    if (error) {
      console.error("Error searching user_last_read_with_images: ", error);
      return res.status(500).json({ message: "Error searching user_last_read_with_images" });
    }

    return res.status(200).json({ message: "Search results retrieved", data: searchResults });
  });
};


clientController.likeStory = (req, res) => {
  const { user_id, story_id } = req.body;

  if (!user_id || !story_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.likeStory(user_id, story_id, (error, result) => {
    if (error) {
      console.error('Error liking story: ', error);
      return res.status(500).json({ message: 'Error liking story' });
    }

    if (result === 'alreadyExists') {
      return res.status(200).json({ message: 'User already likes this story' });
    } else if (result === 'liked') {
      return res.status(200).json({ message: 'Story Liked' });
    }
  });
};


clientController.unlikeStory = (req, res) => {
  const { user_id, story_id } = req.body;
  const totalLikers = 1;

  if (!user_id || !story_id || totalLikers === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.unlikeStory(user_id, story_id, totalLikers, (error, result) => {
    if (error) {
      console.error('Error unliking story: ', error);
      return res.status(500).json({ message: 'Error unliking story' });
    }

    if (result === 'notFound') {
      return res.status(200).json({ message: 'No matching story found' });
    } else if (result === 'unliked') {
      return res.status(200).json({ message: 'Story Unliked' });
    }
  });
};

clientController.getLikedStories = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id in request body' });
  }

  ClientModel.getLikedStories(user_id, (error, likedStories) => {
    if (error) {
      console.error('Error getting liked stories: ', error);
      return res.status(500).json({ message: 'Error retrieving liked stories' });
    }

    return res.status(200).json({ message: 'Liked stories retrieved successfully', data: likedStories });
  });
};


clientController.commentStory = (req, res) => {
  const { user_id, story_id, comment, reply_to } = req.body;

  // Set reply_to to 0 if it is empty
  const replyToValue = reply_to || 0;

  if (!user_id || !story_id || !comment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.commentStory(user_id, story_id, comment, replyToValue, (error, insertedComment) => {
    if (error) {
      console.error('Error commenting on story: ', error);
      return res.status(500).json({ message: 'Error commenting on story' });
    }

    return res.status(200).json({
      status: 'Comment Posted',
      data: insertedComment,
    });
  });
};


clientController.updateCommentStory = (req, res) => {
  const { user_id, story_id, comment, comment_id } = req.body;

  if (!user_id || !story_id || !comment || !comment_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.updateComment(user_id, story_id, comment, comment_id, (error, updatedComment) => {
    if (error) {
      console.error('Error updating comment: ', error);
      return res.status(500).json({ message: 'Error updating comment' });
    }

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({
      status: 'Comment Updated',
      data: updatedComment,
    });
  });
};

clientController.getAllComments = (req, res) => {
  const { story_id } = req.query;

  if (!story_id) {
    return res.status(400).json({ message: 'Missing required field: story_id' });
  }

  // Call the model to fetch comments by story_id
  ClientModel.getAllCommentsByStoryId(story_id, (error, comments) => {
    if (error) {
      console.error('Error fetching comments by story_id: ', error);
      return res.status(500).json({ message: 'Error fetching comments by story_id' });
    }

    return res.status(200).json({
      message: 'Comments retrieved by story_id',
      data: comments,
    });
  });
};

clientController.likeComment = (req, res) => {
  const { user_id, comment_id, story_id } = req.body;

  if (!user_id || !comment_id || !story_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.likeComment(user_id, comment_id, story_id, (error, result) => {
    if (error) {
      console.error('Error liking comment: ', error);
      return res.status(500).json({ message: 'Error liking comment' });
    }

    if (result === 'alreadyLiked') {
      return res.status(200).json({ message: 'User already likes this comment' });
    } else if (result === 'liked') {
      return res.status(200).json({ message: 'Comment Liked' });
    }
  });
};

clientController.deleteComment = (req, res) => {
  const { user_id, comment_id, story_id } = req.body;

  if (!user_id || !comment_id || !story_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.deleteComment(user_id, comment_id, story_id, (error, result) => {
    if (error) {
      console.error('Error deleting comment: ', error);
      return res.status(500).json({ message: 'Error deleting comment' });
    }

    if (result === 'deleted') {
      return res.status(200).json({ message: 'Comment Deleted' });
    } else {
      return res.status(404).json({ message: 'Comment not found' });
    }
  });
};

clientController.flagComment = (req, res) => {
  const { user_id, comment_id, story_id } = req.body;

  if (!user_id || !comment_id || !story_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.flagComment(user_id, comment_id, story_id, (error, result) => {
    if (error) {
      console.error('Error flagging comment: ', error);
      if (error.message === 'Comment not found') {
        return res.status(404).json({ message: 'Comment not found' });
      } else {
        return res.status(500).json({ message: 'Error flagging comment' });
      }
    }

    if (result === 'flagged') {
      return res.status(200).json({ message: 'Comment Flagged' });
    }
  });
};

clientController.unlikeComment = (req, res) => {
  const { user_id, comment_id, story_id } = req.body;

  if (!user_id || !comment_id || !story_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.unlikeComment(user_id, comment_id, story_id, (error, result) => {
    if (error) {
      console.error('Error unliking comment: ', error);
      return res.status(500).json({ message: 'Error unliking comment' });
    }

    if (result === 'unliked') {
      return res.status(200).json({ message: 'Comment unliked' });
    }
  });
};

clientController.getLikedComment = (req, res) => {
  const { user_id, story_id} = req.body;

  if (!user_id || !story_id ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.getUserLikedComment(user_id, story_id, (error, likedComment) => {
    if (error) {
      console.error('Error fetching liked comment: ', error);
      return res.status(500).json({ message: 'Error fetching liked comment' });
    }

    return res.status(200).json({
      message: 'Liked comment retrieved',
      data: likedComment,
    });
  });
};


module.exports = clientController;
