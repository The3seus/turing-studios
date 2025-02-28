// U Can us this ollama for prompt generation instead of open AI



const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const { processImages } = require('./imageProcessor');
const { loadSystemPrompts, extractNarrationText, sanitizeText } = require('./utils/helpers');
const { generateImages } = require('./imageGenerator');
const { generateVideoId, combineVideoById } = require('./handlers/combineVideoHandler');

const app = express();
app.use(express.json());

let systemPrompts = {};

// Call this function to load prompts when the app starts
const loadPrompts = async () => {
  systemPrompts = await loadSystemPrompts();
};
loadPrompts();

const callLlamaModel = async (model, prompt) => {
  return new Promise((resolve, reject) => {
    const responseParts = [];
    let buffer = '';

    axios({
      method: 'post',
      url: 'http://localhost:11434/api/generate',
      data: {
        model: model,
        prompt: prompt
      },
      responseType: 'stream'
    }).then(response => {
      response.data.on('data', (chunk) => {
        buffer += chunk.toString();
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          const chunkString = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1);
          boundary = buffer.indexOf('\n');

          if (chunkString) {
            try {
              const json = JSON.parse(chunkString);
              responseParts.push(json.response);
            } catch (e) {
              console.error('Failed to parse response chunk:', chunkString);
              reject(new Error('Failed to parse response chunk'));
            }
          }
        }
      });

      response.data.on('end', () => {
        if (buffer.length > 0) {
          try {
            const json = JSON.parse(buffer);
            responseParts.push(json.response);
          } catch (e) {
            console.error('Failed to parse response chunk at end:', buffer);
            reject(new Error('Failed to parse response chunk at end'));
          }
        }
        resolve(responseParts.join(' '));
      });

      response.data.on('error', (error) => {
        reject(error);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

app.post('/generate-video', async (req, res) => {
  const { description, voiceOverTranscript } = req.body;

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
    const scriptCompletion = await callLlamaModel('llama3', `Create a detailed video script under 150 words for the following description: ${description}`);
    
    const videoScript = scriptCompletion;
    console.log('Video script generated:', videoScript);

    console.log('Generating image descriptions...');
    const scenes = videoScript.split('\n\n'); // Assuming each scene is separated by a blank line

    const imagePromptPromises = scenes.map(scene => {
      console.log(`Generating image description for scene: ${scene}`);
      return callLlamaModel('llama3', `Generate a detailed image description for this scene: ${scene}`);
    });

    const imagePromptsResponses = await Promise.all(imagePromptPromises);
    const imagePrompts = imagePromptsResponses.map((response, index) => {
      const imagePrompt = response;
      console.log(`Image description generated for scene ${index + 1}:`, imagePrompt);
      return imagePrompt;
    });

    console.log('Generating images for each scene...');
    const imagePaths = await generateImages(imagePrompts); // Use the new image generation logic

    console.log('Processing images...');
    const { videoPaths, dir } = await processImages(imagePaths);
    console.log('Images processed:', imagePaths);

    // Using provided voice-over transcript
    let voiceOverScript = voiceOverTranscript;
    console.log('Using provided voice-over transcript:', voiceOverScript);

    // Extract and sanitize the narration text
    const sanitizedVoiceOverScript = sanitizeText(extractNarrationText(voiceOverScript));
    console.log('Sanitized voice-over script:', sanitizedVoiceOverScript);

    console.log('Generating voice-over audio...');
    const response = await axios.post('http://localhost:7000/clone_voice', {
      text: sanitizedVoiceOverScript,
      speaker_wav_path: "/media/theeseus/Secondary/HIVE/turing-studios/voice-gen-api/voices/alien.mp3", 
      language: 'en'
    }, {
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

app.post('/combine-video', async (req, res) => {
  const { videoId, musicPrompt } = req.body;

  try {
    const result = await combineVideoById(videoId, musicPrompt);
    res.json(result);
  } catch (error) {
    console.error('An error occurred while combining the video:', error.message);
    res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
