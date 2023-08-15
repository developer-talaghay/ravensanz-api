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
    const id = req.query.story_id;
  
    if (!id) {
      return res.status(400).json({ message: "Missing id parameter" });
    }
  
    // Call the model to get story details by id
    ClientModel.getStoryDetailsById(id, (error, storyDetails) => {
      if (error) {
        console.error("Error getting story details by id: ", error);
        return res.status(500).json({ message: "Error getting story details by id" });
      }
  
      return res.status(200).json({ message: "Story details retrieved by id", data: storyDetails });
    });
  };

  clientController.getRelatedStoryLists = (req, res) => {
    const tags = req.query.tags;

    if (!tags) {
        return res.status(400).json({ message: "Missing tags parameter" });
    }

    // Split the tags into an array
    const tagArray = tags.split(',');

    // Call the model to get related stories by tag
    ClientModel.getRelatedStoriesByTag(tagArray, (error, relatedStories) => {
        if (error) {
            console.error("Error getting related stories by tag: ", error);
            return res.status(500).json({ message: "Error getting related stories by tag" });
        }

        return res.status(200).json({ message: "Related stories retrieved by tag", data: relatedStories });
    });
};
  
  

module.exports = clientController;
