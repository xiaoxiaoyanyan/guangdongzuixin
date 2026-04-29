import axios from 'axios';
import type { KnowledgeBase, Document, Conversation, Message } from '@/types/knowledge';

const API_BASE = '/api/knowledge';

export const knowledgeApi = {
  // ==================== 知识库 CRUD ====================
  
  /** 获取知识库列表 */
  getList: async (): Promise<KnowledgeBase[]> => {
    const response = await axios.get(`${API_BASE}/bases`);
    return response.data;
  },

  /** 创建知识库 */
  create: async (data: {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
  }): Promise<KnowledgeBase> => {
    const response = await axios.post(`${API_BASE}/bases`, data);
    return response.data;
  },

  /** 更新知识库 */
  update: async (id: string, data: Partial<KnowledgeBase>): Promise<KnowledgeBase> => {
    const response = await axios.put(`${API_BASE}/bases/${id}`, data);
    return response.data;
  },

  /** 删除知识库 */
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/bases/${id}`);
  },

  // ==================== 文件（文档）管理 ====================

  /** 上传文件到指定知识库 */
  uploadFile: async (file: File, knowledgeBaseId: string): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('knowledgeBaseId', knowledgeBaseId);

    const response = await axios.post(`${API_BASE}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`上传进度: ${percentCompleted}%`);
      },
    });
    return response.data;
  },

  /** 获取知识库下的文件列表 */
  getDocuments: async (knowledgeBaseId?: string): Promise<Document[]> => {
    const url = knowledgeBaseId 
      ? `${API_BASE}/documents?knowledgeBaseId=${knowledgeBaseId}`
      : `${API_BASE}/documents`;
    const response = await axios.get(url);
    return response.data;
  },

  /** 删除文件 */
  deleteDocument: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/documents/${id}`);
  },

  // ==================== 知识库问答 ====================

  /** 发送消息（基于选择的知识库） */
  sendMessage: async (data: {
    content: string;
    knowledgeBaseIds: string[];
    conversationId?: string;
  }): Promise<Message> => {
    const response = await axios.post(`${API_BASE}/chat`, data);
    return response.data;
  },

  /** 获取对话历史 */
  getConversations: async (): Promise<Conversation[]> => {
    const response = await axios.get(`${API_BASE}/conversations`);
    return response.data;
  },

  /** 获取特定对话详情 */
  getConversation: async (id: string): Promise<Conversation> => {
    const response = await axios.get(`${API_BASE}/conversations/${id}`);
    return response.data;
  },
};

// 导出默认实例，方便直接使用
export default knowledgeApi;
