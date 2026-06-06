import { create } from 'zustand';
import type { Group, CreateGroupData, JoinGroupData } from '@/types';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  loading: boolean;
  error: string | null;
  fetchGroups: (status?: string) => Promise<void>;
  fetchGroup: (id: number) => Promise<void>;
  fetchManagedGroups: () => Promise<void>;
  createGroup: (data: CreateGroupData) => Promise<Group | null>;
  joinGroup: (id: number, data: JoinGroupData) => Promise<boolean>;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,

  fetchGroups: async (status?: string) => {
    set({ loading: true, error: null });
    try {
      const url = status
        ? `/api/groups?status=${status}`
        : '/api/groups';
      const res = await fetch(url);
      if (!res.ok) throw new Error('获取拼团列表失败');
      const groups: Group[] = await res.json();
      set({ groups, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : '网络错误' });
    }
  },

  fetchManagedGroups: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/groups/managed');
      if (!res.ok) throw new Error('获取管理的拼团失败');
      const groups: Group[] = await res.json();
      set({ groups, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : '网络错误' });
    }
  },

  fetchGroup: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/groups/${id}`);
      if (!res.ok) throw new Error('获取拼团详情失败');
      const group: Group = await res.json();
      set({ currentGroup: group, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : '网络错误' });
    }
  },

  createGroup: async (data: CreateGroupData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: '创建拼团失败' }));
        throw new Error(err.message || '创建拼团失败');
      }
      const group: Group = await res.json();
      set({ loading: false });
      return group;
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : '网络错误' });
      return null;
    }
  },

  joinGroup: async (id: number, data: JoinGroupData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/groups/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: '参团失败' }));
        throw new Error(err.message || '参团失败');
      }
      set({ loading: false });
      return true;
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : '网络错误' });
      return false;
    }
  },
}));
