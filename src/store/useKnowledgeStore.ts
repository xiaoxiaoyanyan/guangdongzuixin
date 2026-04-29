import { create } from 'zustand';
import type { KnowledgeBase } from '@/types/knowledge';
import knowledgeApi from '@/services/knowledgeApi';

interface KnowledgeState {
  knowledgeBases: KnowledgeBase[];
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterType: 'all' | 'mostFiles' | 'recent';
  setKnowledgeBases: (bases: KnowledgeBase[]) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addKnowledgeBase: (base: KnowledgeBase) => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: 'all' | 'mostFiles' | 'recent') => void;
  fetchKnowledgeBases: () => Promise<void>;
  filteredBases: () => KnowledgeBase[];
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  knowledgeBases: [],
  selectedIds: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  filterType: 'all',

  setKnowledgeBases: (bases) => set({ knowledgeBases: bases }),

  toggleSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedIds.includes(id);
      return {
        selectedIds: isSelected
          ? state.selectedIds.filter((selectedId) => selectedId !== id)
          : [...state.selectedIds, id],
      };
    }),

  clearSelection: () => set({ selectedIds: [] }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addKnowledgeBase: (base) =>
    set((state) => ({
      knowledgeBases: [base, ...state.knowledgeBases],
      selectedIds: [...state.selectedIds, base.id],
      error: null,
    })),

  setSearchTerm: (term) => set({ searchTerm: term.toLowerCase(), error: null }),

  setFilterType: (type) => set({ filterType: type, error: null }),

  fetchKnowledgeBases: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await knowledgeApi.getList();
      set({ knowledgeBases: data, error: null });
    } catch (error: any) {
      console.warn('API 获取知识库失败，使用 Mock 数据', error);
      const mockData: KnowledgeBase[] = [
        {
          id: '1',
          name: '企业培训知识库',
          description: '包含公司所有内训课程、绩效考核、KPI管理相关文档',
          icon: 'FileTextOutlined',
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
      set({ 
        knowledgeBases: mockData, 
        error: error.message || '获取知识库失败，已使用本地演示数据' 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // 计算过滤后的知识库列表
  filteredBases: () => {
    const state = get();
    let result = [...state.knowledgeBases];

    // 搜索过滤
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      result = result.filter(
        (kb) =>
          kb.name.toLowerCase().includes(term) ||
          (kb.description && kb.description.toLowerCase().includes(term))
      );
    }

    // 筛选过滤
    if (state.filterType === 'mostFiles') {
      result.sort((a, b) => (b.fileCount || 0) - (a.fileCount || 0));
    } else if (state.filterType === 'recent') {
      result.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return result;
  },
}));
