import { create } from 'zustand';
import api from '@/lib/api';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isLoading: false,
  isAuthenticated: false,

  setAuth: (user: User, token: string) => {
    localStorage.setItem('auth_token', token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await api.get('/user');
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      get().clearAuth();
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the API call fails, clear local state
    }
    get().clearAuth();
  },
}));
