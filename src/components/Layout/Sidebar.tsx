import React from 'react';
import { Menu } from 'antd';
import { 
  HomeOutlined, 
  RobotOutlined, 
  VideoCameraOutlined, 
  FolderOutlined, 
  DatabaseOutlined, 
  FileImageOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { key: 'home', icon: <HomeOutlined />, label: '首页', path: '/' },
  { key: 'ai-micro', icon: <RobotOutlined />, label: 'AI微课开发', path: '/micro-course' },
  { key: 'ai-course', icon: <VideoCameraOutlined />, label: 'AI课程制作', path: '/ai-course' },
  { key: 'kb-resource', icon: <FolderOutlined />, label: '知识库资源', path: '/knowledge-extraction' },
  { key: 'knowledge-base', icon: <DatabaseOutlined />, label: '知识库', path: '/knowledge' },
  { key: 'material', icon: <FileImageOutlined />, label: '素材管理', path: '/materials' },
  { key: 'system', icon: <SettingOutlined />, label: '系统管理', path: '/system/users' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = React.useMemo(() => {
    if (location.pathname === '/knowledge') return 'knowledge-base';
    if (location.pathname === '/ai-course') return 'ai-course';
    if (location.pathname === '/micro-course') return 'ai-micro';
    if (location.pathname === '/knowledge-extraction') return 'kb-resource';
    if (location.pathname.startsWith('/system')) return 'system';
    return 'knowledge-base'; // 默认选中知识库
  }, [location.pathname]);

  const handleMenuClick = (key: string) => {
    const item = menuItems.find(m => m.key === key);
    if (item?.path) {
      navigate(item.path);
    }
  };

  return (
    <div style={{ height: '100%', padding: '16px 0' }}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        style={{ 
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.65)',
          height: '100%',
        }}
        theme="dark"
      />
    </div>
  );
};

export default Sidebar;
