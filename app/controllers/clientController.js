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

    if (!storyId) {
        return res.status(400).json({ message: "Missing story_id parameter" });
    }

    // Call the model to get story details and related tags by storyId
    ClientModel.getStoryDetailsById(storyId, (error, storyDetails) => {
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
  const { story_id } = req.body;
  const totalLikers = 1;

  if (!story_id || totalLikers === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.updateTotalLikers(story_id, totalLikers, (error, result) => {
    if (error) {
      console.error('Error updating totalLikers: ', error);
      return res.status(500).json({ message: 'Error updating totalLikers' });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({ message: 'No matching story found' });
    }

    return res.status(200).json({ message: 'Story Liked' });
  });
};

clientController.unlikeStory = (req, res) => {
  const { story_id } = req.body;
  const totalLikers = 1;

  if (!story_id || totalLikers === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.updateTotalUnlikers(story_id, totalLikers, (error, result) => {
    if (error) {
      console.error('Error updating totalLikers: ', error);
      return res.status(500).json({ message: 'Error updating totalLikers' });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({ message: 'No matching story found' });
    }

    return res.status(200).json({ message: 'Story Unliked' });
  });
};




module.exports = clientController;
