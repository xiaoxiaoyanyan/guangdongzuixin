import React, { useState } from 'react';
import { Checkbox, Dropdown, MenuProps, Modal, message } from 'antd';
import type { KnowledgeBase } from '@/types/knowledge';
import { FileTextOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditKBModal from './EditKBModal';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  isSelected: boolean;
  onToggle: () => void;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  knowledgeBase,
  isSelected,
  onToggle,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const items: MenuProps['items'] = [
    {
      label: '编辑',
      key: 'edit',
      icon: <EditOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        setEditModalOpen(true);
      },
    },
    {
      label: '删除',
      key: 'delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        setDeleteModalOpen(true);
      },
    },
  ];

  const handleDelete = () => {
    const { knowledgeBases, setKnowledgeBases, selectedIds, clearSelection } = useKnowledgeStore.getState();
    
    const filtered = knowledgeBases.filter(kb => kb.id !== knowledgeBase.id);
    setKnowledgeBases(filtered);
    
    if (selectedIds.includes(knowledgeBase.id)) {
      clearSelection();
    }
    
    message.success('知识库已删除');
    setDeleteModalOpen(false);
  };

  return (
    <>
      <div
        onClick={onToggle}
        className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3.5 transition-all hover:shadow-md ${
          isSelected 
            ? 'border-blue-500 shadow-sm' 
            : 'border-gray-100 hover:border-gray-200'
        }`}
      >
        {/* 图标 */}
        <div 
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl shadow-sm"
          style={{ 
            background: `linear-gradient(135deg, ${knowledgeBase.color}15, ${knowledgeBase.color}25)`,
            color: knowledgeBase.color 
          }}
        >
          <FileTextOutlined />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-[14px] leading-tight line-clamp-2">
                {knowledgeBase.name}
              </h4>
              {knowledgeBase.description && (
                <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                  {knowledgeBase.description}
                </p>
              )}
            </div>
            <Checkbox 
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5"
            />
          </div>

          <div className="mt-3 text-[12px] text-gray-400 flex items-center gap-1">
            <span>{knowledgeBase.fileCount || 0} 个文件</span>
            <span className="text-gray-300">•</span>
            <span>{new Date(knowledgeBase.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* 更多菜单 */}
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 hover:bg-gray-100 p-1 rounded-md cursor-pointer"
          >
            <MoreOutlined className="text-gray-400 hover:text-gray-600" />
          </div>
        </Dropdown>
      </div>

      {/* 编辑弹窗 */}
      <EditKBModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        knowledgeBase={knowledgeBase}
      />

      {/* 删除确认 */}
      <Modal
        title="删除知识库"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="确认删除"
        okButtonProps={{ danger: true }}
      >
        <p className="text-gray-600">
          确定要删除知识库 <strong>“{knowledgeBase.name}”</strong> 吗？<br />
          该操作不可恢复，且会同时删除其下所有文件。
        </p>
      </Modal>
    </>
  );
};

export default KnowledgeBaseCard;
