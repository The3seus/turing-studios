// helpers.js
const fs = require('fs').promises;
const path = require('path');

// Load system prompts from a JSON file
const loadSystemPrompts = async () => {
  try {
    // Read the JSON file
    const data = await fs.readFile(path.join(__dirname, '../system_prompts.json'), 'utf8');
    // Parse and return the JSON data
    return JSON.parse(data);
  } catch (error) {
    // Log the error and return an empty object in case of an error
    console.error('Error loading system prompts:', error);
    return {};
  }
};

// Helper function to extract and sanitize narration text from a script
function extractNarrationText(script) {
  return script
    .split('\n') // Split the script into lines
    .map(line => line.replace(/NARRATOR \(V\.O\.\)/g, '').trim()) // Remove the narrator tag and trim whitespace
    .filter(line => line && !line.startsWith('[') && !line.endsWith(']')) // Filter out empty lines and lines with square brackets
    .join(' '); // Join the remaining lines with a space
}

// Helper function to sanitize text by removing unwanted characters
function sanitizeText(text) {
  return text.replace(/[^a-zA-Z0-9,.!?'" \n]/g, ''); // Allow only specific characters
}

// Helper function to add a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms)); // Return a promise that resolves after a specified delay
}

// Retry logic with exponential backoff
async function retryWithExponentialBackoff(fn, retries = 5, delayMs = 1000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      // Attempt to execute the function
      return await fn();
    } catch (error) {
      // Check if the error is a rate limit error
      if (error.response && error.response.status === 429) {
        attempt++;
        // Calculate the backoff time using exponential backoff strategy
        const backoffTime = delayMs * Math.pow(2, attempt);
        console.log(`Rate limit hit, retrying in ${backoffTime}ms...`);
        // Wait for the backoff time before retrying
        await delay(backoffTime);
      } else {
        // Throw the error if it is not a rate limit error
        throw error;
      }
    }
  }
  // Throw an error if the maximum number of retries is reached
  throw new Error('Max retries reached');
}

module.exports = {
  loadSystemPrompts,
  extractNarrationText,
  sanitizeText,
  delay,
  retryWithExponentialBackoff,
};
