import { useState } from 'react'
import { Layout } from 'antd';

// components & styles
import HeaderLayout from '../header'
import SidebarLayout from '../sidebar';
import './main.sass'
import { setCookie, SITE_COOKIES } from '../../utils/cookies';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout

const Main = ({ children, title }) => {
  const navigate = useNavigate()
  const [sidebarVisible, setSidebarVisible] = useState(false)

  const handleLogout = () => {
    Object.keys(SITE_COOKIES).forEach((key) => {
      setCookie(SITE_COOKIES[key], null, -1)
    })
    window.location.reload(true)

    navigate('/login')
  }

  return (
    <Layout>
      <SidebarLayout visible={sidebarVisible} showSidebar={() => setSidebarVisible(!sidebarVisible)} />
      <HeaderLayout title={title} showSidebar={() => setSidebarVisible(!sidebarVisible)} handleLogout={handleLogout} />
      <Content className='main_content'>
        {children}
      </Content>
    </Layout>
  )
}

export default Main