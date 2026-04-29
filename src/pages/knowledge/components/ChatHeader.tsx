import React from 'react';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';

const ChatHeader: React.FC = () => {
  const { selectedIds, knowledgeBases } = useKnowledgeStore();

  const selectedBases = knowledgeBases.filter(kb => selectedIds.includes(kb.id));
  const totalFiles = selectedBases.reduce((sum, kb) => sum + (kb.fileCount || 0), 0);

  return (
    <div className="h-16 border-b border-gray-100 bg-white px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-white text-xl">📚</span>
        </div>
        <div>
          <div className="font-semibold text-gray-900">知识库助手</div>
          <div className="text-xs text-gray-500 -mt-0.5">基于所选知识库智能回答</div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2 text-sm">
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              已选 {selectedIds.length} 个知识库
            </div>
            <div className="text-gray-400 text-xs">
              共 {totalFiles} 份文档
            </div>
          </div>
        ) : (
          <div className="text-amber-600 text-xs bg-amber-50 px-3 py-1 rounded-full">
            请从左侧选择知识库
          </div>
        )}

        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          在线
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
