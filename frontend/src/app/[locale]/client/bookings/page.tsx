'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import api from '@/lib/api';
import { Link } from '@/i18n/routing';
import { 
  Calendar, 
  Search, 
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Loader2,
  ChevronDown,
  MapPin,
  Store
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Booking {
  id: number;
  event_date: string;
  event_type: string | null;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  price: string | null;
  notes: string | null;
  created_at: string;
  service: {
    id: number;
    title: string;
    wilaya: string;
    images: string[] | null;
    category: { name_ar: string; name_fr: string };
  };
  vendor: {
    name: string;
    vendor_profile?: { business_name: string };
  };
}

const statusConfig = {
  pending: { 
    icon: Clock, 
    colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    labelFr: 'En attente', labelAr: 'في انتظار الرد' 
  },
  accepted: { 
    icon: CheckCircle2, 
    colorClass: 'bg-green-50 text-green-700 border-green-200',
    dotClass: 'bg-green-500',
    labelFr: 'Acceptée', labelAr: 'مقبول' 
  },
  rejected: { 
    icon: XCircle, 
    colorClass: 'bg-red-50 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
    labelFr: 'Refusée', labelAr: 'مرفوض' 
  },
  completed: { 
    icon: CheckCircle2, 
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
    labelFr: 'Terminée', labelAr: 'مكتمل' 
  },
  cancelled: { 
    icon: Ban, 
    colorClass: 'bg-gray-50 text-gray-500 border-gray-200',
    dotClass: 'bg-gray-400',
    labelFr: 'Annulée', labelAr: 'ملغى' 
  },
};

export default function ClientBookings() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings?status=${statusFilter}`);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleCancel = async (id: number) => {
    if (!confirm(isRtl ? 'هل تريد إلغاء هذا الحجز؟' : 'Annuler cette réservation ?')) return;
    setCancellingId(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal">
            {isRtl ? 'حجوزاتي' : 'Mes Réservations'}
          </h1>
          <p className="text-brown mt-1">
            {isRtl ? 'تتبع حالة حجوزاتك مع المزودين.' : 'Suivez l\'état de vos réservations.'}
          </p>
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gold/20 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-charcoal"
        >
          <option value="">{isRtl ? 'جميع الحالات' : 'Tous les statuts'}</option>
          <option value="pending">{isRtl ? 'في الانتظار' : 'En attente'}</option>
          <option value="accepted">{isRtl ? 'مقبولة' : 'Acceptée'}</option>
          <option value="completed">{isRtl ? 'مكتملة' : 'Terminée'}</option>
          <option value="rejected">{isRtl ? 'مرفوضة' : 'Refusée'}</option>
          <option value="cancelled">{isRtl ? 'ملغاة' : 'Annulée'}</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, i) => {
            const cfg = statusConfig[booking.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-soft border border-gold/5 p-6 flex flex-col md:flex-row gap-5"
              >
                {/* Service Image */}
                <div className="w-full md:w-32 h-24 md:h-32 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                  {booking.service?.images?.[0] ? (
                    <img src={booking.service.images[0]} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold-pale"><Calendar size={32} /></div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-charcoal truncate">{booking.service?.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${cfg.colorClass}`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                      {isRtl ? cfg.labelAr : cfg.labelFr}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-brown mb-3">
                    <div className="flex items-center gap-1">
                      <Store size={14} className="text-primary" />
                      <span>{booking.vendor?.vendor_profile?.business_name || booking.vendor?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-primary" />
                      <span>{booking.service?.wilaya}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-primary" />
                      <span>{new Date(booking.event_date).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {booking.event_type && (
                    <p className="text-xs text-brown-light mb-2">
                      {isRtl ? 'نوع الحدث: ' : 'Type: '} 
                      <span className="font-semibold text-charcoal">{booking.event_type}</span>
                    </p>
                  )}

                  {booking.price && (
                    <p className="text-primary font-bold">{booking.price} DZD</p>
                  )}

                  {booking.notes && (
                    <p className="text-sm text-brown mt-2 bg-gray-50 rounded-lg p-3 italic">
                      {isRtl ? 'ملاحظة المزود: ' : 'Note du prestataire : '}{booking.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 flex-shrink-0 items-end justify-end">
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {cancellingId === booking.id ? <Loader2 className="animate-spin" size={14} /> : <Ban size={14} />}
                      {isRtl ? 'إلغاء' : 'Annuler'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gold/30">
          <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={40} className="text-gold" />
          </div>
          <h3 className="text-2xl font-bold text-charcoal mb-2">
            {isRtl ? 'لا توجد حجوزات' : 'Aucune réservation'}
          </h3>
          <p className="text-brown max-w-md mx-auto mb-8">
            {isRtl 
              ? 'ابدأ باستكشاف المزودين وحجز خدمات زفافك.' 
              : 'Explorez les prestataires et réservez vos services de mariage.'}
          </p>
          <Link href="/search" className="btn-gold px-8 py-3 rounded-xl font-bold shadow-gold inline-flex items-center gap-2">
            <Search size={20} />
            <span>{isRtl ? 'ابحث عن مزودين' : 'Trouver des prestataires'}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
