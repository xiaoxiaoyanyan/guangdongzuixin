import { create } from 'zustand';
import type { Message, Conversation } from '@/types/knowledge';

interface ChatStore {
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  setCurrentConversationId: (id: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentConversationId: null,
  messages: [],
  isLoading: false,
  
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  
  setMessages: (messages) => set({ messages }),
  
  clearMessages: () => set({ messages: [] }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));
