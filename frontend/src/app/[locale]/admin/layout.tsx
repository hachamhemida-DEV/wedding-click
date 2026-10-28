'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { 
  LayoutDashboard, 
  Users, 
  Grid,
  ShieldCheck,
  LogOut, 
  ChevronRight,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: isRtl ? 'الإحصائيات' : 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: isRtl ? 'المستخدمين' : 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: isRtl ? 'الفئات' : 'Catégories', href: '/admin/categories', icon: Grid },
    { name: isRtl ? 'الاشتراكات' : 'Abonnements', href: '/admin/subscriptions', icon: CreditCard },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row">
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
          fixed md:sticky top-0 z-40 h-screen w-64 bg-gray-800 border-r border-gray-700 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}
          md:translate-x-0 pt-20
        `}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8 text-primary">
              <ShieldCheck size={28} />
              <h2 className="text-xl font-heading font-bold text-white">
                {isRtl ? 'لوحة المسؤول' : 'Admin Panel'}
              </h2>
            </div>
            
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
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-all mt-8"
              >
                <LogOut size={20} />
                <span className="font-medium">{isRtl ? 'تسجيل الخروج' : 'Déconnexion'}</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
