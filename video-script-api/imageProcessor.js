// imageProcessor.js



require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

// Function to read the image and convert it to a form data
async function readImageAsFormData(imagePath) {
  const form = new FormData();
  const image = await fs.readFile(imagePath);
  form.append('image', image, path.basename(imagePath));
  return form;
}

// Main function to generate video from image using the custom endpoint
async function generateVideoFromImage(imagePath, outputPath) {
  try {
    // Convert the image to form data
    const formData = await readImageAsFormData(imagePath);

    // Call the custom endpoint to generate the video
    const response = await axios.post('http://localhost:9000/animate', formData, {
      headers: formData.getHeaders(),
      responseType: 'arraybuffer',
    });

    // Save the video to the specified output path
    await fs.writeFile(outputPath, response.data);
    console.log('Video saved to', outputPath);
  } catch (error) {
    console.error('Error generating video:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to process all images and create videos for each
async function processImages(imagePaths) {
  const videoPaths = [];

  for (const [index, imagePath] of imagePaths.entries()) {
    const videoPath = imagePath.replace('.png', '.mp4');
    console.log(`Processing image ${index + 1}: ${imagePath}`);
    await generateVideoFromImage(imagePath, videoPath);
    videoPaths.push(videoPath);
  }

  // Assuming all images are in the same directory
  const uniqueDir = path.dirname(imagePaths[0]);

  return { imagePaths, videoPaths, dir: uniqueDir };
}

module.exports = {
  processImages
};

