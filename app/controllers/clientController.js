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
            return res.status(500).json({ message: "Error getting story details by storyId" });
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

clientController.putUserLastRead = (req, res) => {
  const { user_id, storyId, episode } = req.body;

  if (!user_id || !storyId || !episode) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.updateLastRead(user_id, storyId, episode, (error, result) => {
    if (error) {
      console.error('Error updating last read: ', error);
      return res.status(500).json({ message: 'Error updating last read' });
    }

    return res.status(200).json({ message: 'Last read updated successfully' });
  });
};
  

clientController.getUserLastRead = (req, res) => {
  const { user_id, story_id } = req.query;

  if (!user_id || !story_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  ClientModel.getUserLastRead(user_id, story_id, (error, data) => {
    if (error) {
      console.error('Error getting user last read: ', error);
      return res.status(500).json({ message: 'Error getting user last read' });
    }

    return res.status(200).json({ message: 'User last read retrieved', data });
  });
};

module.exports = clientController;
