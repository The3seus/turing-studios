//musicGenerator.js
// Import the necessary modules using require
const dotenv = require('dotenv');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Load environment variables from a .env file
dotenv.config();

// Define the function to generate music
async function generateMusic(duration, musicPrompt = null, outputFormat = "mp3") {
  if (!musicPrompt) {
    console.log('No music prompt provided, skipping music generation.');
    return null;
  }

  try {
    console.log('Making API call to generate music...');
    const response = await axios.post('http://127.0.0.1:8000/generate-music/', {
      prompt: musicPrompt,
      duration: duration,
      output_format: outputFormat
    }, {
      responseType: 'arraybuffer' // This ensures the response is treated as a file download
    });

    const musicPath = path.join(__dirname, `generated_music.${outputFormat}`);
    fs.writeFileSync(musicPath, Buffer.from(response.data));
    console.log('Music downloaded to:', musicPath);

    return musicPath;
  } catch (error) {
    console.error('Error generating music:', error);
    throw error;
  }
}

// Export the generateMusic function
module.exports = {
  generateMusic,
};
