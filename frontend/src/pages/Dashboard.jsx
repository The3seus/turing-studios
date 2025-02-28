// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useGenerateVideo from '../hooks/useGenerateVideo';
import VideoResultPopup from '../components/VideoResultPopup';
import GenerateVideoForm from '../components/GenerateVideoForm';

const { Content, Footer } = Layout;

const Dashboard = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const { generateVideo, loading, result, error } = useGenerateVideo();
  const navigate = useNavigate();

  useEffect(() => {
    if (result && videoData) {
      setVideoData({ ...result, platform: videoData.platform });
    }
  }, [result]);

  const handleGenerate = async ({ description, voiceOverScript, platform, duration }) => {
    setVideoData({ ...videoData, platform }); // Set platform before generating video
    await generateVideo(description, voiceOverScript, duration, platform);

    if (error) {
      message.error(error);
    } else {
      setIsFormVisible(false);
      setIsModalVisible(true);
    }
  };

  const handleVideoGenerated = (videoPath) => {
    navigate('/video', { state: { videoPath } });
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0', color: '#b300b3' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
            }}
          >
            <h1 style={{ color: '#b300b3' }}>Turing Studios Dashboard!</h1>
            <Button
              type="primary"
              style={{ backgroundColor: '#b300b3', borderColor: '#b300b3' }}
              onClick={() => setIsFormVisible(true)}
            >
              Generate Video
            </Button>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#b300b3', backgroundColor: '#1a1a1a' }}>
          Turing Studios ©2023 
        </Footer>
      </Layout>

      <GenerateVideoForm
        visible={isFormVisible}
        onCreate={handleGenerate}
        onCancel={() => setIsFormVisible(false)}
        loading={loading}
      />

      {videoData && (
        <VideoResultPopup
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          videoData={videoData}
          onVideoGenerated={handleVideoGenerated}
        />
      )}
    </Layout>
  );
};

export default Dashboard;

