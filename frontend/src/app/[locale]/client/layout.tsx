'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { 
  LayoutDashboard, 
  Heart, 
  Calendar,
  MessageSquare,
  UserCircle, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: isRtl ? 'لوحة التحكم' : 'Tableau de bord', href: '/client/dashboard', icon: LayoutDashboard },
    { name: isRtl ? 'حجوزاتي' : 'Mes Réservations', href: '/client/bookings', icon: Calendar },
    { name: isRtl ? 'الرسائل' : 'Messagerie', href: '/client/messages', icon: MessageSquare },
    { name: isRtl ? 'المفضلة' : 'Ma Wishlist', href: '/client/wishlist', icon: Heart },
    { name: isRtl ? 'الملف الشخصي' : 'Profil', href: '/client/profile', icon: UserCircle },
  ];

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-20 z-50 p-2 bg-primary text-white rounded-r-lg shadow-lg"
          style={{ [isRtl ? 'right' : 'left']: 0 }}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 z-40 h-screen w-64 bg-white border-r border-gold/10 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}
          md:translate-x-0 pt-20
        `}>
          <div className="p-6">
            <h2 className="text-xl font-heading font-bold text-charcoal mb-8">
              {isRtl ? 'لوحة العميل' : 'Espace Mariés'}
            </h2>
            
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-primary text-white shadow-gold-sm' 
                        : 'text-brown hover:bg-gold-pale/10 hover:text-primary'}
                    `}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && <ChevronRight size={16} className={`ml-auto ${isRtl ? 'rotate-180' : ''}`} />}
                  </Link>
                );
              })}

              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all mt-8"
              >
                <LogOut size={20} />
                <span className="font-medium">{isRtl ? 'تسجيل الخروج' : 'Déconnexion'}</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
