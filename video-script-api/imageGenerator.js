// This generator uses open AI Dalle-3 and commented out code below uses stable diffusion

// imageGenerator.js

require('dotenv').config();
const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');

// Initialize the OpenAI client with the API token from the environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateImage = async (prompt, outputDir, sceneIndex) => {
  try {
    console.log(`Starting image generation for scene ${sceneIndex}...`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    console.log('Image generated successfully!');
    console.log('Downloading image...');

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageResponse.data, 'binary');

    const filePath = path.join(outputDir, `scene_${sceneIndex}.png`);
    await fs.writeFile(filePath, buffer);

    console.log(`Image saved successfully at ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`An error occurred while generating image for scene ${sceneIndex}:`, error);
    return null;
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const generateImages = async (prompts) => {
  const uniqueDir = path.join(__dirname, 'temp', uuidv4());
  await fs.mkdir(uniqueDir, { recursive: true });

  const imagePaths = [];
  
  for (let i = 0; i < prompts.length; i++) {
    const filePath = await generateImage(prompts[i], uniqueDir, i + 1);
    if (filePath) {
      imagePaths.push(filePath);
    } else {
      console.log(`Skipping scene ${i + 1} due to an error.`);
    }

    // Check if we need to delay to respect the 15 images per minute limit
    if ((i + 1) % 15 === 0) {
      console.log('Rate limit reached, waiting for 60 seconds...');
      await delay(60000); // wait for 60 seconds
    }
  }

  return imagePaths;
};

module.exports = {
  generateImages
};



// This commented out code uses the local Stable diffusion server
// require('dotenv').config();
// const fs = require('fs').promises;
// const axios = require('axios');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// const generateImage = async (prompt, outputDir, sceneIndex) => {
//   try {
//     console.log(`Starting image generation for scene ${sceneIndex}...`);

//     const response = await axios.post('http://localhost:9500/generate', {
//       prompt
//     }, { responseType: 'arraybuffer' });  // Important: set responseType to 'arraybuffer' to handle binary data

//     const buffer = Buffer.from(response.data, 'binary');
//     const filePath = path.join(outputDir, `scene_${sceneIndex}.png`);
//     await fs.writeFile(filePath, buffer);

//     console.log(`Image saved successfully at ${filePath}`);
//     return filePath;
//   } catch (error) {
//     console.error(`An error occurred while generating image for scene ${sceneIndex}:`, error);
//     return null;
//   }
// };

// const generateImages = async (prompts) => {
//   const uniqueDir = path.join(__dirname, 'temp', uuidv4());
//   await fs.mkdir(uniqueDir, { recursive: true });

//   const imagePaths = [];
  
//   for (let i = 0; i < prompts.length; i++) {
//     const filePath = await generateImage(prompts[i], uniqueDir, i + 1);
//     if (filePath) {
//       imagePaths.push(filePath);
//     } else {
//       console.log(`Skipping scene ${i + 1} due to an error.`);
//     }
//   }

//   return imagePaths;
// };

// module.exports = {
//   generateImages
// };




// require('dotenv').config();
// const fs = require('fs').promises;
// const axios = require('axios');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const OpenAI = require('openai');

// // Initialize the OpenAI client with the API token from the environment variable
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const generateImage = async (prompt, outputDir, sceneIndex) => {
//   try {
//     console.log(`Starting image generation for scene ${sceneIndex}...`);

//     const response = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: prompt,
//       n: 1,
//       size: "1024x1024",
//     });

//     const imageUrl = response.data[0].url;
//     console.log('Image generated successfully!');
//     console.log('Downloading image...');

//     const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//     const buffer = Buffer.from(imageResponse.data, 'binary');

//     const filePath = path.join(outputDir, `scene_${sceneIndex}.png`);
//     await fs.writeFile(filePath, buffer);

//     console.log(`Image saved successfully at ${filePath}`);
//     return filePath;
//   } catch (error) {
//     console.error(`An error occurred while generating image for scene ${sceneIndex}:`, error);
//     return null;
//   }
// };

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// const generateImages = async (prompts) => {
//   const uniqueDir = path.join(__dirname, 'temp', uuidv4());
//   await fs.mkdir(uniqueDir, { recursive: true });

//   const imagePaths = [];
  
//   for (let i = 0; i < prompts.length; i++) {
//     const filePath = await generateImage(prompts[i], uniqueDir, i + 1);
//     if (filePath) {
//       imagePaths.push(filePath);
//     } else {
//       console.log(`Skipping scene ${i + 1} due to an error.`);
//     }

//     // Check if we need to delay to respect the 15 images per minute limit
//     if ((i + 1) % 15 === 0) {
//       console.log('Rate limit reached, waiting for 60 seconds...');
//       await delay(60000); // wait for 60 seconds
//     }
//   }

//   return imagePaths;
// };

// module.exports = {
//   generateImages
// };







// require('dotenv').config();
// const fs = require('fs').promises;
// const axios = require('axios');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const OpenAI = require('openai');

// // Initialize the OpenAI client with the API token from the environment variable
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const generateImage = async (prompt, outputDir, sceneIndex) => {
//   try {
//     console.log(`Starting image generation for scene ${sceneIndex}...`);

//     const response = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: prompt,
//       n: 1,
//       size: "1024x1024",
//     });

//     const imageUrl = response.data[0].url;
//     console.log('Image generated successfully!');
//     console.log('Downloading image...');

//     const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//     const buffer = Buffer.from(imageResponse.data, 'binary');

//     const filePath = path.join(outputDir, `scene_${sceneIndex}.png`);
//     await fs.writeFile(filePath, buffer);

//     console.log(`Image saved successfully at ${filePath}`);
//     return filePath;
//   } catch (error) {
//     console.error(`An error occurred while generating image for scene ${sceneIndex}:`, error);
//     return null;
//   }
// };

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// const generateImages = async (prompts) => {
//   const uniqueDir = path.join(__dirname, 'temp', uuidv4());
//   await fs.mkdir(uniqueDir, { recursive: true });

//   const imagePaths = [];
  
//   for (let i = 0; i < prompts.length; i++) {
//     const filePath = await generateImage(prompts[i], uniqueDir, i + 1);
//     if (filePath) {
//       imagePaths.push(filePath);
//     } else {
//       console.log(`Skipping scene ${i + 1} due to an error.`);
//     }

//     // Check if we need to delay to respect the 15 images per minute limit
//     if ((i + 1) % 15 === 0) {
//       console.log('Rate limit reached, waiting for 60 seconds...');
//       await delay(60000); // wait for 60 seconds
//     }
//   }

//   return imagePaths;
// };

// module.exports = {
//   generateImages
// };


