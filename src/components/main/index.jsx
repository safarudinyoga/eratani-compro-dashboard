import { useState } from 'react'
import { Layout } from 'antd';

// components & styles
import HeaderLayout from '../header'
import SidebarLayout from '../sidebar';
import './main.sass'

const { Content } = Layout

const Main = ({ children, title }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false)

  return (
    <Layout>
      <SidebarLayout visible={sidebarVisible} showSidebar={() => setSidebarVisible(!sidebarVisible)} />
      <HeaderLayout title={title} showSidebar={() => setSidebarVisible(!sidebarVisible)} />
      <Content className='main_content'>
        {children}
      </Content>
    </Layout>
  )
}

export default Main