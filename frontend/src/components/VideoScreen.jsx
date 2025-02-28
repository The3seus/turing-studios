// components/VideoScreen.js
import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';

const { Content, Footer } = Layout;

const VideoScreen = () => {
  const location = useLocation();
  const { videoPath } = location.state || {};

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0', color: '#b300b3' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Video</Breadcrumb.Item>
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
            <h1 style={{ color: '#b300b3' }}>Generated Video</h1>
            {videoPath ? (
              <video width="80%" controls style={{ borderRadius: '8px' }}>
                <source src={videoPath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p style={{ color: '#b300b3' }}>No video available</p>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#b300b3', backgroundColor: '#1a1a1a' }}>
          Turing Studios ©2023 
        </Footer>
      </Layout>
    </Layout>
  );
};

export default VideoScreen;
