'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Send, Loader2, MessageSquare, User, Clock, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Note: Echo integration will be added here once Pusher/Reverb are installed.

interface Message {
  id: number;
  body: string;
  sender_id: number;
  created_at: string;
  sender?: {
    id: number;
    name: string;
  };
}

interface Conversation {
  id: number;
  client_id: number;
  vendor_id: number;
  created_at: string;
  latestMessage?: Message;
  client?: { name: string };
  vendor?: {
    name: string;
    vendorProfile?: { business_name: string };
  };
}

export function ChatInterface({ basePath }: { basePath: string }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user } = useAuthStore();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/conversations');
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch Messages when conversation changes
  useEffect(() => {
    if (!activeConversation) return;
    
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/conversations/${activeConversation.id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [activeConversation]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const messageBody = newMessage;
    setNewMessage('');
    setSending(true);

    try {
      const res = await api.post(`/conversations/${activeConversation.id}/messages`, {
        body: messageBody,
      });
      setMessages((prev) => [...prev, res.data]);
      
      // Update latest message in sidebar
      setConversations((prev) => 
        prev.map(c => c.id === activeConversation.id ? { ...c, latestMessage: res.data } : c)
      );
    } catch (err) {
      console.error('Failed to send message', err);
      setNewMessage(messageBody); // Restore input on failure
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPartnerName = (conv: Conversation) => {
    if (user?.role === 'client') {
      return conv.vendor?.vendorProfile?.business_name || conv.vendor?.name || 'Vendor';
    }
    return conv.client?.name || 'Client';
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gold/10 h-[75vh] min-h-[500px] flex">
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-1/3 border-${isRtl ? 'l' : 'r'} border-gold/10 flex flex-col bg-gray-50/50 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-gold/10 bg-white">
          <h2 className="text-xl font-heading font-bold text-charcoal">
            {isRtl ? 'الرسائل' : 'Messagerie'}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : conversations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full text-${isRtl ? 'right' : 'left'} p-4 hover:bg-gold/5 transition-colors ${activeConversation?.id === conv.id ? 'bg-gold/10' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-charcoal truncate pr-2">
                      {getPartnerName(conv)}
                    </span>
                    {conv.latestMessage && (
                      <span className="text-xs text-brown-light flex-shrink-0">
                        {formatTime(conv.latestMessage.created_at)}
                      </span>
                    )}
                  </div>
                  {conv.latestMessage && (
                    <p className="text-sm text-brown truncate">
                      {conv.latestMessage.sender_id === user?.id ? (isRtl ? 'أنت: ' : 'Vous: ') : ''}
                      {conv.latestMessage.body}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-brown flex flex-col items-center gap-3">
              <MessageSquare size={32} className="text-gold/50" />
              <p>{isRtl ? 'لا توجد محادثات' : 'Aucune conversation'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gold/10 flex items-center gap-3 shadow-sm z-10 relative">
              <button 
                onClick={() => setActiveConversation(null)}
                className="md:hidden p-2 -ml-2 text-brown hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={24} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <h3 className="font-bold text-lg text-charcoal">
                {getPartnerName(activeConversation)}
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/noise.png')] bg-repeat opacity-[0.99]">
              {loadingMessages ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 rounded-2xl ${
                            isMe 
                              ? 'bg-primary text-white rounded-br-none' 
                              : 'bg-gray-100 text-charcoal rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          {formatTime(msg.created_at)}
                        </span>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gold/10 bg-gray-50/50">
              <div className="flex gap-2 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={isRtl ? 'اكتب رسالة...' : 'Écrivez un message...'}
                  className="flex-1 resize-none h-12 py-3 px-4 pr-12 rounded-full border border-gold/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-charcoal"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className={`absolute ${isRtl ? 'left-2' : 'right-2'} top-1.5 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className={isRtl ? 'rotate-180 -ml-1' : 'ml-1'} />}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-brown bg-gray-50/50">
            <MessageSquare size={64} className="text-gold/20 mb-4" />
            <p className="text-lg font-medium">{isRtl ? 'اختر محادثة للبدء' : 'Sélectionnez une conversation'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
