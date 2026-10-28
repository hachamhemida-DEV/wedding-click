'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLocale } from 'next-intl';
import { 
  Users, 
  Package, 
  Grid, 
  UserCheck,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Metrics {
  total_users: number;
  total_clients: number;
  total_vendors: number;
  total_services: number;
  active_services: number;
  total_categories: number;
}

export default function AdminDashboard() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to fetch metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { title: isRtl ? 'إجمالي المستخدمين' : 'Utilisateurs', value: metrics?.total_users, icon: Users, color: 'text-blue-400' },
    { title: isRtl ? 'المزودين' : 'Prestataires', value: metrics?.total_vendors, icon: UserCheck, color: 'text-green-400' },
    { title: isRtl ? 'الخدمات النشطة' : 'Services Actifs', value: metrics?.active_services, icon: Package, color: 'text-purple-400' },
    { title: isRtl ? 'الفئات' : 'Catégories', value: metrics?.total_categories, icon: Grid, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">
          {isRtl ? 'نظرة عامة على المنصة' : 'Aperçu de la Plateforme'}
        </h1>
        <p className="text-gray-400 mt-2">
          {isRtl ? 'إليك إحصائيات الأداء الحالية.' : 'Voici les statistiques de performance actuelles.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color}`}>
                <card.icon size={28} />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-gray-400 text-sm font-medium">{card.title}</p>
            <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">
          {isRtl ? 'توزيع المستخدمين' : 'Répartition des Utilisateurs'}
        </h3>
        <div className="flex items-center gap-4 h-8 rounded-full overflow-hidden bg-gray-700">
          <div 
            style={{ width: `${(metrics?.total_vendors || 0) / (metrics?.total_users || 1) * 100}%` }} 
            className="h-full bg-primary"
          />
          <div 
            style={{ width: `${(metrics?.total_clients || 0) / (metrics?.total_users || 1) * 100}%` }} 
            className="h-full bg-blue-500"
          />
        </div>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-gray-400">{isRtl ? 'مزودين' : 'Prestataires'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-400">{isRtl ? 'عملاء' : 'Clients'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
