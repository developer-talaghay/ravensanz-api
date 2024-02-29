const StoryEpisodeModel = require('../models/chapterCreationModel');

// Controller
const chapterCreationController = {};

chapterCreationController.getStoryEpisodes = (req, res) => {
    const storyId = req.query.story_id;

    if (!storyId) {
        return res.status(400).json({ message: "Missing story_id parameter" });
    }

    // Call the model to get story episodes by storyId
    StoryEpisodeModel.getStoryEpisodesByStoryId(storyId, (error, episodes) => {
        if (error) {
            console.error("Error getting story episodes by storyId: ", error);
            return res.status(500).json({ message: "Error getting story episodes" });
        }
        return res.status(200).json({ message: "Story episodes retrieved", data: episodes });
    });
};

module.exports = chapterCreationController;
