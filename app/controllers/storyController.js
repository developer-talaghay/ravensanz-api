// controllers/storyController.js
const axios = require('axios');
const StoryModel = require('../models/StoryModel');
const sequelize = require('../config/db.config.sequelize');

async function fetchAndInsertStory() {
  try {
    const headers = {
      Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSYXZlblMiLCJpZCI6MjEsImV4cGlyZXNJbiI6IjMwZCIsInNlc3Npb25UeXBlIjoiY2xpZW50IiwiaWF0IjoxNjg5ODc4OTQ3fQ.umfHoqukSMjcMr1YcXLyOaShgeWIg6vmUfyecDT3gOQ'
    };
    
    const response = await axios.get('https://ravensanz.com/api/admin/story?page=1&size=1000&sort%5B%5D=%7B%22field%22:%22genre%22,%22dir%22:%22asc%22%7D', {
      headers: headers
    });

    const stories = response.data.data.rows;
    console.log(stories);

    for (const story of stories) {
      await StoryModel.upsert(story, { id: story.id });
    }

    console.log('Stories fetched and upserted.');
  } catch (error) {
    console.error('Error fetching and upserting stories:', error);
  }
}

module.exports = { fetchAndInsertStory };
