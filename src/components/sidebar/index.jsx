import { useState } from 'react'
import { Button, Drawer, Icon, Menu } from 'antd';
import { MailOutlined, SettingOutlined, DashboardOutlined, ReadOutlined, CalendarOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

// components & styles
import './sidebar.sass'

const SidebarLayout = ({ visible, showSidebar }) => {

  const items = [
    {
      label: (
        <NavLink to='/home'><span>home</span></NavLink>
      ),
      key: 'home',
      icon: <DashboardOutlined />
    },
    {
      label: (
        <NavLink to='/blog'><span>Blog</span></NavLink>
      ),
      key: 'blog',
      icon: <ReadOutlined />
    },
    {
      label: (
        <NavLink to='/event'><span>Agenda</span></NavLink>
      ),
      key: 'event',
      icon: <CalendarOutlined />
    },
    {
      label: (
        <NavLink to='/career'><span>Karir</span></NavLink>
      ),
      key: 'career',
      icon: <TeamOutlined />
    },
    {
      label: (
        <NavLink to='/map'><span>Map Management</span></NavLink>
      ),
      key: 'map',
      icon: <EnvironmentOutlined />
    },
  ];

  return (
    <Drawer
      title="Main Menu"
      placement="left"
      closable
      onClose={showSidebar}
      visible={visible}
      className="layout-sidebar"
    >
      <Menu
        mode="inline"
        items={items}
      />
    </Drawer>
  )
}

export default SidebarLayout