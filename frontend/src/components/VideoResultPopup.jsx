// components/VideoResultPopup.js

import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Progress } from 'antd';

const VideoResultPopup = ({ isVisible, onClose, videoData, onVideoGenerated }) => {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      setIsGenerating(false);
    }
  }, [isVisible]);

  const handleApprove = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:5000/combine-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoData.uniqueId,
          musicPrompt: "Ambient Space Trance Music",
          platform: videoData.platform, // Ensure platform is sent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to combine video');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value);
          const event = chunk.trim().split('\n');
          event.forEach(line => {
            if (line.startsWith('data: ')) {
              const jsonString = line.replace('data: ', '');
              try {
                const data = JSON.parse(jsonString);
                if (data.progress !== undefined) {
                  setProgress(data.progress * 100);
                } else if (data.result) {
                  onVideoGenerated(data.result);
                  message.success('Video approved and combined successfully!');
                  onClose();
                }
              } catch (e) {
                console.error('Error parsing JSON from SSE:', e);
              }
            }
          });
        }
      }
    } catch (error) {
      message.error('Failed to combine video');
      console.error(error); // Log the error for debugging
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDecline = () => {
    message.info('Video declined');
    onClose();
  };

  return (
    <Modal
      title="Generated Video Result"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="decline" onClick={handleDecline} disabled={isGenerating}>
          Decline
        </Button>,
        <Button key="approve" type="primary" onClick={handleApprove} loading={isGenerating}>
          Approve
        </Button>,
      ]}
    >
      <h2>Video Script</h2>
      <pre>{videoData?.videoScript}</pre>
      <h2>Voice Over Script</h2>
      <pre>{videoData?.voiceOverScript}</pre>
      {videoData?.images?.map((image) => (
        <div key={image.scene}>
          <h3>Scene {image.scene}</h3>
          <img src={image.path} alt={`Scene ${image.scene}`} style={{ width: '100%', marginBottom: '16px' }} />
        </div>
      ))}
      {videoData?.videos?.map((video) => (
        <div key={video.scene}>
          <h3>Scene {video.scene}</h3>
          <video src={video.path} controls style={{ width: '100%', marginBottom: '16px' }} />
        </div>
      ))}
      {isGenerating && (
        <div>
          <h2>Progress</h2>
          <Progress percent={progress} />
        </div>
      )}
    </Modal>
  );
};

export default VideoResultPopup;

