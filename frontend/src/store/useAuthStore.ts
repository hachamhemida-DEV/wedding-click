import { create } from 'zustand';
import axios from '@/lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'client' | 'vendor';
    phone: string | null;
    language_preference: string;
    vendor_profile?: any;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    registerClient: (data: any) => Promise<void>;
    registerVendor: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    error: null,

    fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/user');
            set({ user: response.data, isLoading: false });
        } catch (error: any) {
            set({ user: null, isLoading: false });
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            await axios.get(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + '/sanctum/csrf-cookie');
            const response = await axios.post('/auth/login', credentials);
            set({ user: response.data.user, isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'Login failed', 
                isLoading: false 
            });
            throw error;
        }
    },

    registerClient: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await axios.get(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + '/sanctum/csrf-cookie');
            const response = await axios.post('/auth/register/client', data);
            set({ user: response.data.user, isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'Registration failed', 
                isLoading: false 
            });
            throw error;
        }
    },

    registerVendor: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await axios.get(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + '/sanctum/csrf-cookie');
            const response = await axios.post('/auth/register/vendor', data);
            set({ user: response.data.user, isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'Registration failed', 
                isLoading: false 
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post('/logout');
            set({ user: null, isLoading: false });
        } catch (error: any) {
            set({ error: 'Logout failed', isLoading: false });
        }
    }
}));
