const dbConn = require('../config/db.config');

// Model
const StoryEpisodeModel = {};

StoryEpisodeModel.getStoryEpisodesByStoryId = (storyId, callback) => {
    dbConn.query("SELECT * FROM story_episodes WHERE storyId = ?", [storyId], (error, episodes) => {
        if (error) {
            console.error("Error retrieving story episodes by storyId: ", error);
            return callback(error, null);
        }
        return callback(null, episodes);
    });
};

module.exports = StoryEpisodeModel;
