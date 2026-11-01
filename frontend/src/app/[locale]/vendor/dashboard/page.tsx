'use client';

import { useAuthStore } from '@/store/authStore';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  Award, 
  Eye, 
  CalendarCheck, 
  TrendingUp,
  ArrowRight,
  Store,
  UserCircle
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [stats, setStats] = useState({
    plan: 'FREE',
    bookings: 0, // Placeholder for Phase 6
    views: 0 // Placeholder
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/vendor/subscription');
        if (res.data) {
          setStats(prev => ({ ...prev, plan: res.data.plan.toUpperCase() }));
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { 
      title: isRtl ? 'الباقة الحالية' : 'Plan Actuel', 
      value: stats.plan, 
      icon: Award, 
      color: 'bg-primary' 
    },
    { 
      title: isRtl ? 'طلبات الحجز' : 'Réservations', 
      value: stats.bookings, 
      icon: CalendarCheck, 
      color: 'bg-green-500' 
    },
    { 
      title: isRtl ? 'المشاهدات' : 'Vues', 
      value: stats.views, 
      icon: Eye, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          {isRtl ? `مرحباً بك، ${user?.name}` : `Bienvenue, ${user?.name}`}
        </h1>
        <p className="text-brown mt-2">
          {isRtl ? 'إليك نظرة سريعة على نشاطك اليوم.' : 'Voici un aperçu de votre activité aujourd\'hui.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-soft border border-gold/5 flex items-center gap-6"
          >
            <div className={`${card.color} p-4 rounded-xl text-white shadow-lg`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-brown font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-charcoal">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-2xl shadow-soft border border-gold/5">
          <h3 className="text-xl font-bold text-charcoal mb-6">
            {isRtl ? 'إجراءات سريعة' : 'Actions rapides'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/vendor/services" 
              className="flex items-center justify-between p-4 bg-gold-pale/10 rounded-xl hover:bg-gold-pale/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Store size={20} className="text-primary" />
                <span className="font-semibold text-charcoal">{isRtl ? 'إدارة نشاطك' : 'Gérer l\'activité'}</span>
              </div>
              <ArrowRight size={18} className={`text-primary opacity-0 group-hover:opacity-100 transition-all ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <Link 
              href="/vendor/profile" 
              className="flex items-center justify-between p-4 bg-gold-pale/10 rounded-xl hover:bg-gold-pale/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <UserCircle size={20} className="text-primary" />
                <span className="font-semibold text-charcoal">{isRtl ? 'تعديل الملف' : 'Editer le profil'}</span>
              </div>
              <ArrowRight size={18} className={`text-primary opacity-0 group-hover:opacity-100 transition-all ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>

        {/* Growth Tip */}
        <div className="bg-primary p-8 rounded-2xl shadow-gold text-white relative overflow-hidden">
          <div className="relative z-10">
            <TrendingUp size={48} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">
              {isRtl ? 'هل تريد المزيد من العملاء؟' : 'Voulez-vous plus de clients ?'}
            </h3>
            <p className="text-white/80">
              {isRtl 
                ? 'تأكد من إضافة صور عالية الجودة ووصف مفصل لخدماتك لجذب المزيد من العرسان.' 
                : 'Assurez-vous d\'ajouter des photos de haute qualité et une description détaillée pour attirer plus de mariés.'}
            </p>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
