import React, { useState } from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';
import KnowledgeBaseCard from './KnowledgeBaseCard';
import CreateKBModal from './CreateKBModal';
import FileUploader from './FileUploader';

const KnowledgeSidebar: React.FC = () => {
  const { knowledgeBases, selectedIds, toggleSelection, isLoading } = useKnowledgeStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const totalFiles = knowledgeBases.reduce((sum, kb) => sum + (kb.fileCount || 0), 0);

  return (
    <div className="w-[280px] flex-shrink-0 border-r border-gray-100 bg-[#f5f7fa] flex flex-col h-full overflow-hidden">
      {/* 头部 */}
      <div className="px-4 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-gray-900">知识库</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">知识库选中后即可开始问答</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="small"
            className="rounded-lg"
            onClick={() => setCreateModalOpen(true)}
          >
            新建
          </Button>
        </div>
      </div>

      {/* 知识库列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : knowledgeBases.length === 0 ? (
          <Empty 
            description="暂无知识库" 
            className="py-12"
          />
        ) : (
          knowledgeBases.map((kb) => (
            <KnowledgeBaseCard
              key={kb.id}
              knowledgeBase={kb}
              isSelected={selectedIds.includes(kb.id)}
              onToggle={() => toggleSelection(kb.id)}
            />
          ))
        )}
      </div>

      {/* 文件上传区域 */}
      <div className="px-4 pt-2 pb-4 border-t border-gray-100 bg-white">
        <FileUploader selectedKnowledgeIds={selectedIds} />
      </div>

      {/* 底部统计 */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white text-[12px] text-gray-500 flex justify-between items-center">
        <span>共 {knowledgeBases.length} 个知识库</span>
        <span className="font-medium text-gray-600">{totalFiles} 份文档</span>
      </div>

      {/* 新建知识库弹窗 */}
      <CreateKBModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </div>
  );
};

export default KnowledgeSidebar;

