'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import api from '@/lib/api';
import { 
  Calendar, 
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Loader2,
  User,
  Phone,
  MapPin,
  PartyPopper,
  Check,
  X
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
  client: {
    name: string;
    phone: string | null;
    email: string;
  };
}

const statusConfig = {
  pending: { colorClass: 'bg-amber-50 text-amber-700 border-amber-200', dotClass: 'bg-amber-500', labelFr: 'En attente', labelAr: 'في الانتظار' },
  accepted: { colorClass: 'bg-green-50 text-green-700 border-green-200', dotClass: 'bg-green-500', labelFr: 'Acceptée', labelAr: 'مقبول' },
  rejected: { colorClass: 'bg-red-50 text-red-700 border-red-200', dotClass: 'bg-red-500', labelFr: 'Refusée', labelAr: 'مرفوض' },
  completed: { colorClass: 'bg-blue-50 text-blue-700 border-blue-200', dotClass: 'bg-blue-500', labelFr: 'Terminée', labelAr: 'مكتمل' },
  cancelled: { colorClass: 'bg-gray-50 text-gray-500 border-gray-200', dotClass: 'bg-gray-400', labelFr: 'Annulée', labelAr: 'ملغى' },
};

export default function VendorBookings() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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

  useEffect(() => { fetchBookings(); }, [statusFilter]);

  const handleAction = async (id: number, action: 'accept' | 'reject' | 'complete') => {
    setActionLoading(id);
    try {
      await api.put(`/bookings/${id}/${action}`);
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal">
            {isRtl ? 'طلبات الحجز' : 'Demandes de réservation'}
          </h1>
          <p className="text-brown mt-1">
            {isRtl ? 'إدارة طلبات الحجز الواردة من العملاء.' : 'Gérez les demandes de réservation de vos clients.'}
          </p>
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gold/20 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">{isRtl ? 'جميع الحالات' : 'Tous'}</option>
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
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-soft border border-gold/5 p-6"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-charcoal">{booking.service?.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User size={14} className="text-primary" />
                          <span className="text-sm font-medium text-charcoal">{booking.client?.name}</span>
                          {booking.client?.phone && (
                            <>
                              <span className="text-gray-300">|</span>
                              <Phone size={14} className="text-primary" />
                              <span className="text-sm text-brown" dir="ltr">{booking.client.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 flex-shrink-0 ${cfg.colorClass}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                        {isRtl ? cfg.labelAr : cfg.labelFr}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-brown mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-primary" />
                        <span>{new Date(booking.event_date).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {booking.event_type && (
                        <div className="flex items-center gap-1">
                          <PartyPopper size={14} className="text-primary" />
                          <span>{booking.event_type}</span>
                        </div>
                      )}
                      {booking.price && (
                        <span className="font-bold text-primary">{booking.price} DZD</span>
                      )}
                    </div>

                    {booking.message && (
                      <div className="bg-cream rounded-xl p-4 text-sm text-brown mt-2">
                        <p className="font-semibold text-charcoal text-xs mb-1">{isRtl ? 'رسالة العميل:' : 'Message du client :'}</p>
                        <p>{booking.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 flex-shrink-0 justify-end">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleAction(booking.id, 'accept')}
                          disabled={actionLoading === booking.id}
                          className="px-5 py-2.5 text-sm font-bold text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                        >
                          {actionLoading === booking.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                          {isRtl ? 'قبول' : 'Accepter'}
                        </button>
                        <button 
                          onClick={() => handleAction(booking.id, 'reject')}
                          disabled={actionLoading === booking.id}
                          className="px-5 py-2.5 text-sm font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <X size={14} />
                          {isRtl ? 'رفض' : 'Refuser'}
                        </button>
                      </>
                    )}
                    {booking.status === 'accepted' && (
                      <button 
                        onClick={() => handleAction(booking.id, 'complete')}
                        disabled={actionLoading === booking.id}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                      >
                        {actionLoading === booking.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                        {isRtl ? 'إكمال' : 'Terminer'}
                      </button>
                    )}
                  </div>
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
            {isRtl ? 'لا توجد طلبات حجز' : 'Aucune demande'}
          </h3>
          <p className="text-brown">
            {isRtl ? 'ستظهر هنا طلبات الحجز الجديدة من العملاء.' : 'Les nouvelles demandes de vos clients apparaîtront ici.'}
          </p>
        </div>
      )}
    </div>
  );
}
