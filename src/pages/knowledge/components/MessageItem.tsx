import React from 'react';
import type { Message } from '@/types/knowledge';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
          <RobotOutlined className="text-white text-lg" />
        </div>
      )}

      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
            isUser 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {message.content}
        </div>

        {message.sources && message.sources.length > 0 && !isUser && (
          <div className="mt-2 text-[11px] text-gray-500 flex flex-wrap gap-1">
            {message.sources.map((source, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-500"
              >
                📄 {source.documentName}
                {source.pageNumber && ` • P${source.pageNumber}`}
              </span>
            ))}
          </div>
        )}

        <div className="text-[10px] text-gray-400 mt-1.5 px-1">
          {new Date(message.createdAt).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
          <UserOutlined className="text-gray-600" />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
