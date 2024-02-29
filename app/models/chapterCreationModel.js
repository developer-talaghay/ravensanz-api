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

// Model method to create story episodes
StoryEpisodeModel.createStoryEpisodes = (userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId, totalWords, callback) => {
    // Check if userId exists in ravensanz_users table
    const ravensanzQuery = 'SELECT * FROM ravensanz_users WHERE id = ?';
    dbConn.query(ravensanzQuery, [userId], (error, ravensanzResults) => {
        if (error) {
            console.error("Error checking userId existence in ravensanz_users table: ", error);
            return callback(error, null);
        }

        // Check if userId exists in user table
        const userQuery = 'SELECT * FROM user WHERE id = ?';
        dbConn.query(userQuery, [userId], (error, userResults) => {
            if (error) {
                console.error("Error checking userId existence in user table: ", error);
                return callback(error, null);
            }

            // If userId exists in either table, continue
            if (ravensanzResults.length > 0 || userResults.length > 0) {
                // Check if storyId exists in story_episodes table
                const storyQuery = 'SELECT * FROM story_episodes WHERE storyId = ?';
                dbConn.query(storyQuery, [storyId], (error, storyResults) => {
                    if (error) {
                        console.error("Error checking storyId existence in story_episodes table: ", error);
                        return callback(error, null);
                    }

                    // If storyId exists, insert data into story_episodes table
                    if (storyResults.length > 0) {
                        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date time
                        const insertQuery = 'INSERT INTO story_episodes (userId, storyId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, totalWords, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        dbConn.query(insertQuery, [userId, storyId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, totalWords, createdAt], (error, result) => {
                            if (error) {
                                console.error("Error inserting story episode: ", error);
                                return callback(error, null);
                            }
                            return callback(null, { episodeId: result.insertId });
                        });
                    } else {
                        return callback({ message: "Story with the provided storyId does not exist" }, null);
                    }
                });
            } else {
                return callback({ message: "User with the provided userId does not exist" }, null);
            }
        });
    });
};


// Model method to update story episodes
StoryEpisodeModel.updateStoryEpisodes = (idValue, storyIdValue, subTitleValue, storyLineValue, totalWordsValue, isVIPValue, writerNoteValue, statusValue, publishedDateValue, wingsRequiredValue, callback) => {
    // Check if storyId exists in story_episodes table
    const storyQuery = 'SELECT * FROM story_episodes WHERE id = ? AND storyId = ?';
    dbConn.query(storyQuery, [idValue, storyIdValue], (error, storyResults) => {
        if (error) {
            console.error("Error checking episode existence in story_episodes table: ", error);
            return callback(error, null);
        }

        // If episode exists, update the data
        if (storyResults.length > 0) {
            // Form the update query
            const updateQuery = 'UPDATE story_episodes SET subTitle = ?, storyLine = ?, totalWords = ?, isVIP = ?, writerNote = ?, status = ?, publishedDate = ?, wingsRequired = ?, updatedAt = ? WHERE id = ? AND storyId = ?';

            // Get current date and time
            const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

            // Execute the update query
            dbConn.query(updateQuery, [subTitleValue, storyLineValue, totalWordsValue, isVIPValue, writerNoteValue, statusValue, publishedDateValue, wingsRequiredValue, updatedAt, idValue, storyIdValue], (error, result) => {
                if (error) {
                    console.error("Error updating story episode: ", error);
                    return callback(error, null);
                }
                return callback(null, { message: "Story episode updated successfully" });
            });
        } else {
            return callback({ message: "Episode with the provided ID and storyID does not exist" }, null);
        }
    });
};

StoryEpisodeModel.deleteStoryEpisodeById = (id, callback) => {
    dbConn.query("DELETE FROM story_episodes WHERE id = ?", [id], (error, result) => {
        if (error) {
            console.error("Error deleting story episode by id: ", error);
            return callback(error);
        }
        return callback(null, result.affectedRows > 0); // Indicate success if rows were affected
    });
};

module.exports = StoryEpisodeModel;
