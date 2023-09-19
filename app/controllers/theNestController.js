const TheNestModel = require('../models/theNest');

const theNestController = {};

theNestController.myReadingList = (req, res) => {
  const { user_id, story_id } = req.body;

  if (!user_id || !story_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  TheNestModel.insertUserStory(user_id, story_id, (error, result) => {
    if (error) {
      console.error('Error inserting user story: ', error);
      return res.status(500).json({ message: 'Error inserting user story' });
    }

    if (result === 'Record already exists') {
      return res.status(200).json({ message: 'User story already exists' });
    }

    return res.status(200).json({ message: 'User story inserted successfully' });
  });
};

theNestController.getMyStoryList = (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id parameter' });
    }
  
    TheNestModel.getMyStoryList(user_id, (error, storyDetails) => {
      if (error) {
        console.error('Error getting story details for user: ', error);
        return res.status(500).json({ message: 'Error retrieving user stories' });
      }
  
      return res
        .status(200)
        .json({ message: 'User stories retrieved successfully', data: storyDetails });
    });
  };

  theNestController.getMyVipStoryList = (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id parameter' });
    }
  
    TheNestModel.getMyVipStoryList(user_id, (error, storyDetails) => {
      if (error) {
        console.error('Error getting VIP story details for user: ', error);
        return res.status(500).json({ message: 'Error retrieving VIP user stories' });
      }
  
      return res
        .status(200)
        .json({ message: 'VIP user stories retrieved successfully', data: storyDetails });
    });
  };

  theNestController.deleteFromMyReadingList = (req, res) => {
    const { user_id, story_id } = req.body;
  
    if (!user_id || !story_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    TheNestModel.deleteUserStory(user_id, story_id, (error, result) => {
      if (error) {
        console.error('Error deleting user story: ', error);
        return res.status(500).json({ message: 'Error deleting user story' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(200).json({ message: 'User story does not exist' });
      }
  
      return res.status(200).json({ message: 'User story deleted successfully' });
    });
  };

  theNestController.getRecommendedList = (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id parameter' });
    }
  
    TheNestModel.getRecommendedStories(user_id, (error, recommendedStories) => {
      if (error) {
        console.error('Error getting recommended stories: ', error);
        return res.status(500).json({ message: 'Error retrieving recommended stories' });
      }
  
      return res.status(200).json({ message: 'Recommended stories retrieved successfully', data: recommendedStories });
    });
  };

module.exports = theNestController;
