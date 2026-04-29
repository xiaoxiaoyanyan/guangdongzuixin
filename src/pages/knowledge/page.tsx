import React from 'react';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import KnowledgeSidebar from './components/KnowledgeSidebar';
import ChatInterface from './components/ChatInterface';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';

const KnowledgeBasePage: React.FC = () => {
  const { selectedIds } = useKnowledgeStore();

  // 初始化一些演示数据
  React.useEffect(() => {
    const demoData = [
      {
        id: '1',
        name: '企业培训知识库',
        description: '包含公司所有内训课程、绩效考核、KPI管理相关文档',
        icon: 'BookOutlined',
        color: '#1890ff',
        fileCount: 127,
        createdAt: '2026-04-01T00:00:00Z',
        updatedAt: '2026-04-28T00:00:00Z',
      },
      {
        id: '2',
        name: '销售能力知识库',
        description: '销售话术、客户 objection 处理、产品知识库',
        icon: 'TeamOutlined',
        color: '#52c41a',
        fileCount: 86,
        createdAt: '2026-03-15T00:00:00Z',
        updatedAt: '2026-04-20T00:00:00Z',
      },
    ];

    useKnowledgeStore.getState().setKnowledgeBases(demoData);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 全局左侧导航 */}
      <DashboardSidebar />

      {/* 知识库管理侧栏 */}
      <KnowledgeSidebar />

      {/* 主要聊天区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface selectedKnowledgeIds={selectedIds} />
      </div>
    </div>
  );
};

export default KnowledgeBasePage;

