import React from 'react';
import { Layout, Button, Avatar, Badge } from 'antd';
import { 
  BellOutlined, 
  PlusOutlined, 
  HistoryOutlined,
  UploadOutlined 
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader
      style={{
        background: '#1a1f36',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* 左侧 Logo 和标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          background: 'linear-gradient(135deg, #1890ff, #722ed1)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 18,
        }}>
          ⭐
        </div>
        <div>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
            广东移动
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: -2 }}>
            百思智能平台
          </div>
        </div>
      </div>

      {/* 右侧操作按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button 
          icon={<PlusOutlined />} 
          type="primary"
          style={{ borderRadius: 6 }}
        >
          新对话
        </Button>

        <Button 
          icon={<HistoryOutlined />} 
          style={{ 
            borderRadius: 6,
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.85)'
          }}
        >
          历史记录
        </Button>

        <Button 
          icon={<UploadOutlined />} 
          style={{ 
            borderRadius: 6,
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.85)'
          }}
        >
          上传文档
        </Button>

        <Badge dot>
          <Button 
            icon={<BellOutlined />} 
            style={{ 
              borderRadius: 6,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.85)'
            }}
          />
        </Badge>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar 
            style={{ backgroundColor: '#87d068' }}
            src="https://xsgames.co/randomusers/avatar.php?g=pixel"
          />
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
            管理员
          </div>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
