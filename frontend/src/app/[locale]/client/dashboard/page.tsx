'use client';

import { useAuthStore } from '@/store/authStore';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Calendar,
  Sparkles,
  ArrowRight,
  Search
} from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const stats = [
    { title: isRtl ? 'الحجوزات' : 'Réservations', value: 0, icon: Calendar, color: 'bg-gold' },
    { title: isRtl ? 'المفضلة' : 'Wishlist', value: 0, icon: Heart, color: 'bg-red-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal">
            {isRtl ? `مرحباً، ${user?.name}` : `Bonjour, ${user?.name}`}
          </h1>
          <p className="text-brown mt-2">
            {isRtl ? 'استمتع بتخطيط حفل زفافك المثالي.' : 'Profitez de la planification de votre mariage idéal.'}
          </p>
        </div>
        <Link href="/search" className="btn-gold px-6 py-3 rounded-xl flex items-center gap-2 shadow-gold">
          <Search size={20} />
          <span>{isRtl ? 'ابحث عن خدمات' : 'Trouver des services'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-soft border border-gold/5 flex items-center gap-6"
          >
            <div className={`${stat.color} p-4 rounded-xl text-white shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-brown font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary p-8 rounded-2xl shadow-gold text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <Sparkles size={48} className="mb-4 opacity-50" />
          <h3 className="text-2xl font-bold mb-4">
            {isRtl ? 'ابدأ رحلة البحث عن مزودي الخدمة' : 'Commencez à chercher vos prestataires'}
          </h3>
          <p className="text-white/80 mb-6 text-lg">
            {isRtl 
              ? 'تصفح المئات من قاعات الحفلات، المصورين، والحلويات في ولايتك.' 
              : 'Parcourez des centaines de salles, photographes et traiteurs dans votre wilaya.'}
          </p>
          <Link href="/search" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gold-pale transition-all">
            <span>{isRtl ? 'استكشف الآن' : 'Explorer maintenant'}</span>
            <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[40%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
