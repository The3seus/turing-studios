
const fs = require('fs').promises;
const path = require('path');
const { combineMedia } = require('../videoCombiner');

async function generateVideoId(req, res) {
  const uniqueId = Date.now().toString();
  const dir = path.join(__dirname, '../temp', uniqueId);

  try {
    await fs.mkdir(dir, { recursive: true });
    res.json({ uniqueId, dir });
  } catch (error) {
    console.error('Error creating directory:', error.message);
    res.status(500).json({ error: 'Error creating directory', details: error.message });
  }
}

async function combineVideoById(videoId, musicPrompt, platform, onProgress) { // Accept platform parameter
  const dir = path.join(__dirname, '../temp', videoId);

  try {
    const files = await fs.readdir(dir);
    const videoPaths = files.filter(file => /\.(mp4|jpg|jpeg|png)$/i.test(file)).map(file => path.join(dir, file));
    const voiceOverPath = path.join(dir, 'voiceover.wav');
    const finalVideoPath = path.join(dir, 'final_video.mp4');

    if (!files.includes('voiceover.wav')) {
      throw new Error('Voice-over file is missing');
    }

    await combineMedia(videoPaths, voiceOverPath, finalVideoPath, musicPrompt, 20, platform, onProgress); // Pass platform

    return { finalVideoPath };
  } catch (error) {
    console.error(`Failed to combine video for ID ${videoId}:`, error.message);
    throw error;
  }
}

module.exports = {
  generateVideoId,
  combineVideoById,
};

