import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/globals.css';
import './App.css';
import Dashboard from './pages/Dashboard';
import VideoScreen from './components/VideoScreen';
import Sidebar from './components/Sidebar';
import { Layout } from 'antd';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} onCollapse={onCollapse} />
        <Layout className="site-layout">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/video" element={<VideoScreen />} />
            {/* Add other routes here */}
          </Routes>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
