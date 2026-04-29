import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Empty, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ChatHeader from './ChatHeader';
import MessageItem from './MessageItem';
import { useChatStore } from '@/store/useChatStore';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';
import type { Message } from '@/types/knowledge';

const ChatInterface: React.FC<{ selectedKnowledgeIds: string[] }> = ({ 
  selectedKnowledgeIds 
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const { selectedIds } = useKnowledgeStore();

  const hasSelection = selectedIds.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !hasSelection || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    const currentInput = inputValue.trim();
    setInputValue('');
    setLoading(true);

    // 模拟基于知识库的智能回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: `我已从您选择的知识库中检索到相关内容。\n\n针对“${currentInput}”，以下是基于企业培训知识库和销售能力知识库的分析建议：\n\n1. 明确KPI指标并SMART化\n2. 建立360度评估机制\n3. 定期复盘与迭代\n\n需要我帮您生成具体的考核方案模板吗？`,
        sources: [
          {
            documentId: "doc-1",
            documentName: "绩效考核管理办法.pdf",
            pageNumber: 12,
            relevance: 0.92,
          },
          {
            documentId: "doc-2",
            documentName: "销售团队能力模型v2.1.docx",
            pageNumber: 5,
            relevance: 0.87,
          },
        ],
        createdAt: new Date().toISOString(),
      };
      addMessage(aiMessage);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-6 opacity-75">📚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">知识库助手已就绪</h3>
            <p className="text-gray-500 text-center max-w-xs">
              {hasSelection 
                ? "请选择左侧知识库后，在下方输入您的问题" 
                : "请从左侧面板选择一个或多个知识库\n以开始基于企业知识的智能问答"}
            </p>
            {!hasSelection && (
              <div className="mt-8 text-xs text-amber-500 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                ⚠️ 必须选择知识库才能开始对话
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="relative">
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={hasSelection 
              ? "输入问题，按 Enter 发送..." 
              : "请先选择左侧知识库..."}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={!hasSelection}
            className="pr-14 py-3 text-[14px] rounded-2xl border-gray-200 focus:border-blue-400"
          />
          
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || !hasSelection || isLoading}
            className="absolute bottom-3 right-3 rounded-xl"
            loading={isLoading}
          />
        </div>
        
        <div className="text-center text-[10px] text-gray-400 mt-3">
          AI 回答基于所选知识库内容生成 • 请遵守企业信息安全规范
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
