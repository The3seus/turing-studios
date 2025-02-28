//app.js



const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const { processImages } = require('./imageProcessor');
const { loadSystemPrompts, extractNarrationText, sanitizeText } = require('./utils/helpers');
const { generateImages } = require('./imageGenerator');
const { generateVideoId, combineVideoById } = require('./handlers/combineVideoHandler'); // Import the new logic

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let systemPrompts = {};

// Call this function to load prompts when the app starts
const loadPrompts = async () => {
  systemPrompts = await loadSystemPrompts();
};
loadPrompts();

app.post('/generate-video', async (req, res) => {
  const { description, voiceOverTranscript, skipAnimation = false } = req.body;

  if (!description) {
    console.log('Error: Description is required');
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!voiceOverTranscript) {
    console.log('Error: Voice-over transcript is required');
    return res.status(400).json({ error: 'Voice-over transcript is required' });
  }

  try {
    console.log('Generating video script...');
    const scriptCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompts.screenwriter },
        { role: 'user', content: `Create a detailed video script under 150 words for the following description: ${description}` }
      ],
      model: 'gpt-4o',
    });

    const videoScript = scriptCompletion.choices[0].message.content;
    console.log('Video script generated:', videoScript);

    console.log('Generating image descriptions...');
    const scenes = videoScript.split('\n\n'); // Assuming each scene is separated by a blank line

    const imagePromptPromises = scenes.map(scene => {
      console.log(`Generating image description for scene: ${scene}`);
      return openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompts.visual_artist },
          { role: 'user', content: `Generate a detailed image description for this scene: ${scene}` }
        ],
        model: 'gpt-4o',
      });
    });

    const imagePromptsResponses = await Promise.all(imagePromptPromises);
    const imagePrompts = imagePromptsResponses.map((response, index) => {
      const imagePrompt = response.choices[0].message.content;
      console.log(`Image description generated for scene ${index + 1}:`, imagePrompt);
      return imagePrompt;
    });

    console.log('Generating images for each scene...');
    const imagePaths = await generateImages(imagePrompts); // Use the new image generation logic

    // If skipAnimation is true, return the images and script without generating videos
    if (skipAnimation) {
      const dir = path.dirname(imagePaths[0]);
      const uniqueId = path.basename(dir);

      console.log('Skipping video generation and returning image paths.');

      res.json({
        videoScript,
        imagePrompts: imagePrompts.map((prompt, index) => ({ scene: index + 1, prompt })),
        images: imagePaths.map((path, index) => ({ scene: index + 1, path })),
        uniqueId,
      });

      return;
    }

    console.log('Processing images...');
    const { videoPaths, dir } = await processImages(imagePaths);
    console.log('Images processed:', imagePaths);

    // Proceed with voice-over generation only after images are processed
    let voiceOverScript = voiceOverTranscript;
    console.log('Using provided voice-over transcript:', voiceOverScript);

    // Extract and sanitize the narration text
    const sanitizedVoiceOverScript = sanitizeText(extractNarrationText(voiceOverScript));
    console.log('Sanitized voice-over script:', sanitizedVoiceOverScript);

    console.log('Generating voice-over audio...');
    const response = await axios.post('http://localhost:7000/generate_speech', {
      text: sanitizedVoiceOverScript,
      description: "A female speaker delivers a slightly expressive and animated speech with a moderate speed and pitch. The recording is of very high quality, with the speaker's voice sounding clear and very close up."
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    const voiceOverFilePath = path.join(dir, 'voiceover.wav');
    await fs.writeFile(voiceOverFilePath, response.data, 'binary');
    console.log('Voice-over audio generated and saved to:', voiceOverFilePath);

    const uniqueId = path.basename(dir);
    console.log('Returning results with unique ID:', uniqueId);
    res.json({
      videoScript,
      imagePrompts: imagePrompts.map((prompt, index) => ({ scene: index + 1, prompt })),
      images: imagePaths.map((path, index) => ({ scene: index + 1, path })),
      videos: videoPaths.map((path, index) => ({ scene: index + 1, path })),
      voiceOverScript,
      voiceOverAudioPath: voiceOverFilePath,
      uniqueId
    });
  } catch (error) {
    console.error('An error occurred while processing the request:', error.message);
    res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
  }
});

app.post('/combine-video', (req, res) => {
  const { videoId, musicPrompt, platform } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client

  combineVideoById(videoId, musicPrompt, platform, progress => {
    res.write(`data: ${JSON.stringify({ progress })}\n\n`);
  })
  .then(result => {
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.end();
  })
  .catch(error => {
    console.error('An error occurred while combining the video:', error.message);
    res.write(`data: ${JSON.stringify({ error: 'An error occurred while processing your request', details: error.message })}\n\n`);
    res.end();
  });
});

app.get('/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

