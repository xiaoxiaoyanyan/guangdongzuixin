import React from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* 顶部导航栏 */}
      <Header />

      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        {/* 左侧全局导航 */}
        <Sider 
          width={240} 
          style={{ 
            background: '#1a1f36',
            overflow: 'auto',
            height: '100%',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}
        >
          <Sidebar />
        </Sider>

        {/* 知识库管理面板 */}
        <div 
          style={{ 
            width: 280, 
            background: '#f5f7fa',
            marginLeft: 240,
            height: '100%',
            overflow: 'auto',
            borderRight: '1px solid #e8e8e8',
            zIndex: 1,
          }}
        >
          {children}
        </div>

        {/* 主内容区 */}
        <Content 
          style={{ 
            marginLeft: 280,
            background: '#fff',
            padding: '24px',
            overflow: 'auto',
            height: '100%',
          }}
        >
          {/* 这里会放置具体的页面内容，比如聊天界面 */}
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
