'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterClientForm } from './RegisterClientForm';
import { RegisterVendorForm } from './RegisterVendorForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register-client' | 'register-vendor';
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: Props) {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-cream w-full max-w-xl rounded-3xl shadow-[0_20px_50px_rgba(184,149,106,0.3)] relative z-10 overflow-hidden border border-white"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-brown hover:text-primary transition-colors z-20"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <LoginForm 
                  onSuccess={onClose} 
                  onSwitchToRegister={() => setView('register-client')} 
                />
              </motion.div>
            )}

            {view === 'register-client' && (
              <motion.div
                key="register-client"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RegisterClientForm 
                  onSuccess={onClose} 
                  onSwitchToLogin={() => setView('login')}
                  onSwitchToVendor={() => setView('register-vendor')}
                />
              </motion.div>
            )}

            {view === 'register-vendor' && (
              <motion.div
                key="register-vendor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RegisterVendorForm 
                  onSuccess={onClose} 
                  onSwitchToLogin={() => setView('login')}
                  onSwitchToClient={() => setView('register-client')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
