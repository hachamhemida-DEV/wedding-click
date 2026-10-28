'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { AuthModal } from '../auth/AuthModal';
import NotificationBell from './NotificationBell';

export function Navbar() {
  const t = useTranslations('Index'); 
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, view: 'login' | 'register-client' | 'register-vendor'}>({
    isOpen: false,
    view: 'login'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = () => {
    const nextLocale = locale === 'ar' ? 'fr' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { name: 'الرئيسية', nameFr: 'Accueil', href: '/' },
    { name: 'بحث', nameFr: 'Recherche', href: '/search' },
    { name: 'الباقات', nameFr: 'Tarifs', href: '/pricing' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-panel shadow-soft py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Wed in Click" className="h-12 lg:h-14 w-auto object-contain rounded-lg" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  {locale === 'ar' ? link.name : link.nameFr}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={switchLanguage}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label="Switch Language"
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium text-sm uppercase">{locale === 'ar' ? 'FR' : 'AR'}</span>
          </button>
          
          {isAuthenticated && (
            <>
              <div className="h-6 w-px bg-border mx-1"></div>
              <NotificationBell />
            </>
          )}

          <div className="h-6 w-px bg-border mx-2"></div>

          {isAuthenticated ? (
            <Link
              href={`/${user?.role}/dashboard` as any}
              className="btn-gold px-6 py-2.5 text-sm font-semibold tracking-wide flex items-center gap-2"
            >
              <User size={16} />
              {locale === 'ar' ? 'لوحة التحكم' : 'Mon Espace'}
            </Link>
          ) : (
            <>
              <button
                onClick={() => setAuthModal({ isOpen: true, view: 'login' })}
                className="text-foreground hover:text-primary font-medium text-sm px-4 py-2 transition-colors"
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
              </button>
              <button
                onClick={() => setAuthModal({ isOpen: true, view: 'register-vendor' })}
                className="btn-gold px-6 py-2.5 text-sm font-semibold tracking-wide"
              >
                {locale === 'ar' ? 'انضم كمزود خدمة' : 'Devenir Partenaire'}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass-panel border-b border-gold/15 shadow-gold lg:hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-foreground hover:text-primary"
                    >
                      {locale === 'ar' ? link.name : link.nameFr}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4 pt-4 border-t border-border">
                {isAuthenticated && (
                  <div className="flex items-center justify-between py-2 border-b border-gold/10">
                    <span className="text-sm font-semibold">{locale === 'ar' ? 'التنبيهات' : 'Notifications'}</span>
                    <NotificationBell />
                  </div>
                )}
                <button
                  onClick={switchLanguage}
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <Globe className="w-5 h-5" />
                  <span>{locale === 'ar' ? 'Passer en Français' : 'التبديل للعربية'}</span>
                </button>
                
                {isAuthenticated ? (
                  <Link
                    href={`/${user?.role}/dashboard` as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-gold text-center py-3 font-semibold flex items-center justify-center gap-2"
                  >
                    <User size={18} />
                    {locale === 'ar' ? 'لوحة التحكم' : 'Mon Espace'}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthModal({ isOpen: true, view: 'login' });
                      }}
                      className="text-center font-medium py-2 border border-primary text-primary rounded-xl"
                    >
                      {locale === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthModal({ isOpen: true, view: 'register-vendor' });
                      }}
                      className="btn-gold text-center py-3 font-semibold"
                    >
                      {locale === 'ar' ? 'انضم كمزود خدمة' : 'Devenir Partenaire'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        initialView={authModal.view}
      />
    </header>
  );
}
