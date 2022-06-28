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
    getItem('Navigation One', 'menu1', <MailOutlined />),
    getItem('Navigation Two', 'menu2', <MailOutlined />),
    getItem('Navigation Three', 'menu3', <SettingOutlined />),
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