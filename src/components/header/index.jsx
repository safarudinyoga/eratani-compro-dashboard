import { useState } from 'react'
import { Layout, Avatar, Dropdown, Modal, Badge, Menu } from 'antd';
import logo from '../../assets/logo.svg'
import { MenuUnfoldOutlined, CaretDownOutlined, UserOutlined } from '@ant-design/icons';

// components & styles
import './header.sass'

const { Header } = Layout

const HeaderLayout = ({ showSidebar, title = 'Dashboard Company Profile'}) => {
  const getItem = (label, key, icon, children, type) => ({
    key,
    icon,
    children,
    label,
    type
  })

  const items = [
    getItem((<a href="#" onClick={() => {}}>Log Out</a>), 'menu1'),
  ];

  const menu = (
    <Menu items={items} />
  )

  return (
    <Header>
      <div className='layout-header'>
        <div className='layout-header_brand'>
          <MenuUnfoldOutlined style={{ fontSize: 20 }} onClick={showSidebar} />
          <span className='company-logo'>
            <img src={logo} alt='company-logo' height={30} />
          </span>
        </div>
        <div className='layout-header_title'>
          <span>{title}</span>
        </div>
        <div className='layout-header_user'>
          <Dropdown overlay={menu} trigger={["click"]}>
            <a className="ant-dropdown-link" href="#">
              <Avatar icon={<UserOutlined />} />
              <span className="layout-header_user__username">
                {/* {COOKIES.get(SITE_COOKIES.NAME)}
                 */}
                 testinguser1
              </span>
              <span className="layout-header_user__caret">
                <CaretDownOutlined />
              </span>
            </a>
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}

export default HeaderLayout