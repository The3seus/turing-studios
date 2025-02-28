// components/Sidebar.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  DashboardOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ collapsed, onCollapse }) => (
  <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ backgroundColor: '#1a1a1a' }}>
    <div className="logo" />
    <Menu
      theme="dark"
      defaultSelectedKeys={['1']}
      mode="inline"
      style={{ backgroundColor: '#1a1a1a', color: '#b300b3' }}
    >
      <Menu.Item key="1" icon={<DashboardOutlined style={{ color: '#b300b3' }} />}>
        <Link to="/" style={{ color: '#b300b3' }}>Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<VideoCameraOutlined style={{ color: '#b300b3' }} />}>
        <Link to="/video" style={{ color: '#b300b3' }}>Video</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<PieChartOutlined style={{ color: '#b300b3' }} />}>
        Option 1
      </Menu.Item>
      <Menu.Item key="4" icon={<DesktopOutlined style={{ color: '#b300b3' }} />}>
        Option 2
      </Menu.Item>
      <SubMenu key="sub1" icon={<UserOutlined style={{ color: '#b300b3' }} />} title="User">
        <Menu.Item key="5" style={{ backgroundColor: '#1a1a1a', color: '#b300b3' }}>Tom</Menu.Item>
        <Menu.Item key="6" style={{ backgroundColor: '#1a1a1a', color: '#b300b3' }}>Bill</Menu.Item>
        <Menu.Item key="7" style={{ backgroundColor: '#1a1a1a', color: '#b300b3' }}>Alex</Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<TeamOutlined style={{ color: '#b300b3' }} />} title="Team">
        <Menu.Item key="8" style={{ backgroundColor: '#1a1a1a', color: '#b300b3' }}>Team 1</Menu.Item>
        <Menu.Item key="9" style={{ backgroundColor: '#1a1a1a', color: '#b300b3' }}>Team 2</Menu.Item>
      </SubMenu>
      <Menu.Item key="10" icon={<FileOutlined style={{ color: '#b300b3' }} />}>
        Files
      </Menu.Item>
    </Menu>
  </Sider>
);

export default Sidebar;
