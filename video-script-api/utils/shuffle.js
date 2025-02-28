// utils/helpers.js

const { execSync } = require('child_process');

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to get the duration of a media file (video or image)
async function getMediaDuration(filePath) {
  const command = `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`;
  try {
    const output = execSync(command).toString();
    return parseFloat(output);
  } catch (error) {
    console.error(`Failed to get duration for file: ${filePath}, using default duration. Error: ${error.message}`);
    return 4; // Default duration for images
  }
}

// Function to make videos look infinite by extending them
function makeInfinite(clips, targetDuration) {
  let extendedClips = [];
  let currentDuration = 0;

  while (currentDuration < targetDuration) {
    for (let clip of clips) {
      if (currentDuration >= targetDuration) break;

      const remainingDuration = targetDuration - currentDuration;
      let clipToAdd = { ...clip };

      // Set a random duration between 1 and 3 seconds for each clip
      const randomDuration = Math.random() * (3 - 1) + 1;
      clipToAdd.duration = Math.min(clipToAdd.duration, randomDuration, remainingDuration);

      if (clipToAdd.layers[0].type === 'video') {
        clipToAdd.layers[0].cutTo = clipToAdd.duration;
      }

      extendedClips.push(clipToAdd);
      currentDuration += clipToAdd.duration;
    }
  }

  return extendedClips;
}

// Function to get the duration of an audio file
async function getAudioDuration(filePath) {
  const command = `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`;
  const output = execSync(command).toString();
  return parseFloat(output);
}

module.exports = {
  shuffle,
  makeInfinite,
  getMediaDuration,
  getAudioDuration
};

