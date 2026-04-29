import React, { useState, useRef, useCallback } from 'react';
import { Upload, Button, Progress, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';
import type { Document } from '@/types/knowledge';

interface FileUploaderProps {
  selectedKnowledgeIds: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ selectedKnowledgeIds }) => {
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { knowledgeBases, setKnowledgeBases } = useKnowledgeStore();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (selectedKnowledgeIds.length === 0) {
      message.warning('请先选择一个知识库');
      return;
    }

    const newFiles = Array.from(files).map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      originalName: file.name,
      filePath: URL.createObjectURL(file),
      fileSize: file.size,
      fileType: file.type || 'unknown',
      knowledgeBaseId: selectedKnowledgeIds[0],
      uploadedAt: new Date().toISOString(),
      progress: 0,
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);

    // 模拟上传进度
    newFiles.forEach((fileItem, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress > 100) progress = 100;

        setUploadProgress(prev => ({
          ...prev,
          [fileItem.id]: Math.floor(progress)
        }));

        if (progress >= 100) {
          clearInterval(interval);
          
          // 添加到知识库
          setTimeout(() => {
            const updatedBases = knowledgeBases.map(kb => {
              if (kb.id === selectedKnowledgeIds[0]) {
                return {
                  ...kb,
                  fileCount: (kb.fileCount || 0) + 1
                };
              }
              return kb;
            });
            
            setKnowledgeBases(updatedBases);
            
            // 添加到文档列表（这里简化处理，实际应有单独的文档状态）
            message.success(`${fileItem.name} 上传成功`);
            
            setUploadingFiles(prev => prev.filter(f => f.id !== fileItem.id));
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileItem.id];
              return newProgress;
            });
          }, 600);
        }
      }, 200);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [selectedKnowledgeIds]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="mt-4">
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white"
      >
        <div className="mx-auto w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <UploadOutlined className="text-3xl text-blue-500" />
        </div>
        <div className="text-[15px] font-medium text-gray-700 mb-1">
          点击或拖拽文件到此处上传
        </div>
        <div className="text-xs text-gray-500">
          支持 PDF、Word、Excel、TXT 等格式<br />
          文件将自动归属于已选知识库
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* 上传中的文件 */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="text-xs font-medium text-gray-500 px-1">上传中 ({uploadingFiles.length})</div>
          {uploadingFiles.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex-1 truncate pr-3">{file.name}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {(file.fileSize / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
              <Progress 
                percent={uploadProgress[file.id] || 0} 
                size="small" 
                strokeColor="#1890ff"
                className="mt-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
