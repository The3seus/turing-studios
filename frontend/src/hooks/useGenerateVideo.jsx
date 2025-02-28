// hooks/useGenerateVideo.js
import { useState } from 'react';

const useGenerateVideo = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generateVideo = async (description, voiceOverTranscript, duration, platform) => {
    setLoading(true);
    setError(null);
    setResult(null); // Clear previous result

    try {
      const response = await fetch('http://localhost:5000/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Create a ${duration} minute video for ${platform}: ${description}`,
          voiceOverTranscript,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { generateVideo, loading, result, error };
};

export default useGenerateVideo;
