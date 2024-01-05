// controllers/storyController.js
const axios = require('axios');
const { StoryModel, ImageModel, TagModel, EpisodeModel, UserModel } = require('../models/StoryModel'); // Import all models from the same file
const sequelize = require('../config/db.config.sequelize');

const headers = {
  Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSYXZlblMiLCJpZCI6MjEsImV4cGlyZXNJbiI6IjMwZCIsInNlc3Npb25UeXBlIjoiY2xpZW50IiwiaWF0IjoxNjg5ODc4OTQ3fQ.umfHoqukSMjcMr1YcXLyOaShgeWIg6vmUfyecDT3gOQ' // Replace with your actual token
};

// Fetch image for a story using its ID
async function fetchImageForStory(storyId) {
  let retries = 3;
  while (retries > 0) {
    try {
      const imageResponse = await axios.get(`https://ravensanz.com/api/client/story/${storyId}`, {
        headers: headers
      });

      const imageData = imageResponse.data.story.image;
      const existingImage = await ImageModel.findByPk(imageData.id);

      if (!existingImage) {
        return imageData;
      } else {
        console.log(`Image with ID ${imageData.id} already exists. Skipping insertion.`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching image for ID ${storyId}. Retries left: ${retries}`);
      retries--;
    }
  }
  return null;
}

async function fetchTagsForStory(storyId) {
  let retries = 3;
  while (retries > 0) {
    try {
      const storyResponse = await axios.get(`https://ravensanz.com/api/client/story/${storyId}`, {
        headers: headers
      });

      const tags = storyResponse.data.story.tags;
      console.log("t4gs", tags)

      if (tags) {
        const existingTags = await TagModel.findAll({
          where: {
            id: tags.map(tag => tag.id)
          }
        });

        const uniqueTags = tags.filter(tag => {
          return !existingTags.some(existingTag => existingTag.id === tag.id);
        });

        return uniqueTags;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching tags for ID ${storyId}. Retries left: ${retries}`);
      retries--;
    }
  }
  return null;
}

async function fetchEpisodesForStory(storyId) {
  let retries = 3;
  while (retries > 0) {
    try {
      const storyResponse = await axios.get(`https://ravensanz.com/api/client/story/${storyId}`, {
        headers: headers
      });

      const episodes = storyResponse.data.story.episodes;
      console.log("episodes:", episodes);

      if (episodes) {
        const existingEpisodes = await EpisodeModel.findAll({
          where: {
            id: episodes.map(episode => episode.id)
          }
        });

        const uniqueEpisodes = episodes.filter(episode => {
          return !existingEpisodes.some(existingEpisode => existingEpisode.id === episode.id);
        });

        return uniqueEpisodes;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching episodes for ID ${storyId}. Retries left: ${retries}`);
      retries--;
    }
  }
  return null;
}



// Fetch and insert stories, images, and tags
async function fetchAndInsertStory() {
  try {
    // Fetch stories from the API
    const response = await axios.get('https://ravensanz.com/api/admin/story?page=1&size=1000&sort%5B%5D=%7B%22field%22:%22genre%22,%22dir%22:%22asc%22%7D', {
      headers: headers
    });

    const stories = response.data.data.rows;
    let processedCount = 0;

    for (const story of stories) {
      // Upsert story using correct method name for Sequelize 6
      await StoryModel.upsert(story, { where: { id: story.id } });

      // Fetch image for the story using the ID
      const image = await fetchImageForStory(story.id);

      if (image) {
        await sequelize.transaction(async (transaction) => {
          // Insert image data
          await ImageModel.create({
            id: image.id,
            url: image.url,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
          }, { transaction });

          console.log(`Image data inserted for ID ${story.id}`);
        });
      }

      // Fetch tags for the story using the ID
      const tags = await fetchTagsForStory(story.id);

      if (tags) {
        await sequelize.transaction(async (transaction) => {
          // Insert tags for the story into the story_tags table
          for (const tag of tags) {
            await TagModel.create({
              id: tag.id,
              storyId: tag.storyId,
              name: tag.name,
              createdAt: tag.createdAt,
              updatedAt: tag.updatedAt
            }, { transaction });

            console.log(`Tag data inserted for story ID ${story.id}`);
          }
        });
      }

      // Fetch episodes for the story using the ID
      const episodes = await fetchEpisodesForStory(story.id);

      if (episodes) {
        await sequelize.transaction(async (transaction) => {
          // Insert episodes for the story into the episode table
          for (const episode of episodes) {
            await EpisodeModel.create({
              id: episode.id,
              storyId: episode.storyId,
              userId: episode.userId,
              number: episode.number,
              subTitle: episode.subTitle,
              storyLine: episode.storyLine,
              totalWords: episode.totalWords,
              isVIP: episode.isVIP,
              writerNote: episode.writerNote,
              status: episode.status,
              publishedDate: episode.publishedDate,
              wingsRequired: episode.wingsRequired,
              createdAt: episode.createdAt,
              updatedAt: episode.updatedAt
            }, { transaction });

            console.log(`Episode data inserted for story ID ${story.id}`);
          }
        });
      }

      processedCount++;
    }

    console.log(`Processed ${processedCount} out of ${stories.length} stories.`);
  } catch (error) {
    console.error('Error fetching and upserting stories:', error);
  }
}

async function fetchDataAndInsertIntoDatabase() {
  try {
    const response = await axios.get('https://ravensanz.com/api/admin/user?page=1&size=10000&sort%5B%5D=%7B%22field%22:%22isWriterVerified%22,%22dir%22:%22desc%22%7D', {
      headers: headers,
    });

    const users = response.data.data.rows;

    console.log('Fetched users:', users);

    for (const user of users) {
      const userData = {
        id: user.id,
        firebaseId: user.firebaseId,
        name: user.name,
        contact: user.contact,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        isWriterVerified: user.isWriterVerified,
        isEmailVerified: user.isEmailVerified,
        writerApplicationStatus: user.writerApplicationStatus,
        imageId: user.imageId,
        status: user.status,
        wingsCount: user.wingsCount,
        isSubscriber: user.isSubscriber,
        subscriptionExpirationDate: new Date(user.subscriptionExpirationDate),
        isReadingModeOver18: user.isReadingModeOver18,
        writerBadge: user.writerBadge,
        readerBadge: user.readerBadge,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      };

      // Use the upsert method to insert or update the user
      await UserModel.upsert(userData, { where: { id: user.id } });

      console.log(`Upserted user with ID: ${user.id}`);
    }

    console.log('All data inserted successfully!');
  } catch (error) {
    console.error('Error fetching and inserting data:', error);
  }
}

module.exports = { fetchAndInsertStory, fetchDataAndInsertIntoDatabase };
