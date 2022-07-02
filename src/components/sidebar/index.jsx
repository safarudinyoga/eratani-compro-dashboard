import { useState } from 'react'
import { Button, Drawer, Icon, Menu } from 'antd';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';

// components & styles
import './sidebar.sass'

const SidebarLayout = ({ visible, showSidebar }) => {
  const getItem = (label, key, icon, children, type) => ({
    key,
    icon,
    children,
    label,
    type
  })

  const items = [
    getItem('Blog', 'menu1', <MailOutlined />),
    getItem('Agenda', 'menu2', <MailOutlined />),
    getItem('Karir', 'menu3', <SettingOutlined />),
    getItem('Map Management', 'menu3', <SettingOutlined />),
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
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['sub1']}
        items={items}
      />
    </Drawer>
  )
}

export default SidebarLayout