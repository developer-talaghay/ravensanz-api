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

module.exports = theNestController;
