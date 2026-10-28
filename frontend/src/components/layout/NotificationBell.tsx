'use client';

import { useEffect, useRef, useState } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { useLocale } from 'next-intl';
import { 
  Bell, 
  Check, 
  Clock, 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  Star, 
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';

export default function NotificationBell() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  const { user } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    setupEcho, 
    cleanupEcho 
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and listen to Real-Time WebSockets
  useEffect(() => {
    fetchNotifications();

    if (user?.id) {
      setupEcho(user.id);
    }

    return () => {
      cleanupEcho();
    };
  }, [user?.id]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: any) => {
    setIsOpen(false);
    if (!notif.read_at) {
      await markAsRead(notif.id);
    }
    if (notif.data?.action_url) {
      router.push(notif.data.action_url);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_created':
        return <Calendar className="text-amber-500" size={16} />;
      case 'booking_accepted':
      case 'subscription_approved':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'booking_rejected':
      case 'subscription_rejected':
        return <XCircle className="text-red-500" size={16} />;
      case 'subscription_submitted':
        return <CreditCard className="text-primary" size={16} />;
      case 'new_chat_message':
        return <MessageSquare className="text-sky-500" size={16} />;
      default:
        return <Info className="text-brown" size={16} />;
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-gold-pale/10 text-charcoal hover:text-primary transition-all focus:outline-none"
      >
        <Bell size={22} className="transition-transform duration-300 hover:rotate-12" />
        
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Premium Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute mt-3 w-80 sm:w-96 bg-white border border-gold/10 rounded-2xl shadow-xl overflow-hidden ${
              isRtl ? 'left-0 sm:left-auto right-0' : 'right-0 sm:right-auto left-0 sm:left-auto sm:right-0'
            }`}
            style={{ top: '100%' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-cream/20">
              <span className="font-heading font-bold text-charcoal text-sm">
                {isRtl ? 'التنبيهات' : 'Notifications'}
              </span>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  <Check size={12} />
                  {isRtl ? 'تعيين الكل كمقروء' : 'Tout marquer comme lu'}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
              {notifications.length > 0 ? (
                notifications.map((notif) => {
                  const isUnread = !notif.read_at;
                  return (
                    <div 
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 flex gap-3 hover:bg-gray-50/50 cursor-pointer transition-colors relative ${
                        isUnread ? 'bg-gold-pale/5' : ''
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {isUnread && (
                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                      )}
                      
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-bold text-xs text-charcoal mb-0.5 line-clamp-1">
                          {notif.data?.title}
                        </h4>
                        <p className="text-xs text-brown leading-relaxed mb-1 line-clamp-2">
                          {notif.data?.message}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-brown-light">
                          <Clock size={10} />
                          <span>
                            {new Date(notif.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center text-brown-light">
                  <Bell size={36} className="opacity-20 mb-3" />
                  <p className="text-xs font-medium">
                    {isRtl ? 'لا توجد تنبيهات حالياً.' : 'Aucune notification pour le moment.'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50/50 border-t border-gray-50 text-center text-[10px] text-brown-light font-medium">
                {isRtl ? 'تنبيهات فورية ومباشرة' : 'Notifications instantanées en temps réel'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
