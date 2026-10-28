import { create } from 'zustand';
import api from '@/lib/api';
import { getEcho } from '@/lib/echo';

interface NotificationData {
  type: string;
  title: string;
  message: string;
  action_url?: string;
  extra_data?: any;
}

interface NotificationItem {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setupEcho: (userId: number) => void;
  cleanupEcho: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/notifications');
      set({ 
        notifications: res.data.notifications.data || [], 
        unreadCount: res.data.unread_count || 0 
      });
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const res = await api.put(`/notifications/read/${id}`);
      set((state) => ({
        notifications: state.notifications.map((n) => 
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        ),
        unreadCount: res.data.unread_count
      }));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })),
        unreadCount: 0
      }));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  },

  setupEcho: (userId: number) => {
    const echo = getEcho();
    if (!echo) return;

    // Leave previous channel if different user
    const channelName = `App.Models.User.${userId}`;
    echo.private(channelName)
      .stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated')
      .notification((notification: any) => {
        // Map Laravel broadcast structure to database notification item structure
        const newItem: NotificationItem = {
          id: notification.id,
          type: notification.type,
          data: {
            type: notification.type,
            title: notification.title,
            message: notification.message,
            action_url: notification.action_url,
            extra_data: notification.extra_data,
          },
          read_at: null,
          created_at: new Date().toISOString()
        };

        // Prepend new notification and set unread count from broadcast payload
        set((state) => ({
          notifications: [newItem, ...state.notifications],
          unreadCount: notification.unread_count || (state.unreadCount + 1)
        }));
      });
  },

  cleanupEcho: () => {
    // Keep connection alive across navigation unless logging out
  }
}));
