export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  knowledgeBaseId: string;
  knowledgeBaseName?: string;
  uploadedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: DocumentSource[];
  createdAt: string;
}

export interface DocumentSource {
  documentId: string;
  documentName: string;
  pageNumber?: number;
  relevance?: number;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  knowledgeBaseIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSelection {
  knowledgeBases: KnowledgeBase[];
  totalFiles: number;
}
