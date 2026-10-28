'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLocale } from 'next-intl';
import { 
  Check, 
  X, 
  Loader2, 
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSubscriptions() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/subscriptions?status=${activeTab}`);
      setData(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [activeTab]);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedSub) return;
    setSubmitting(true);

    try {
      await api.put(`/admin/subscriptions/${selectedSub.id}/${action}`, {
        admin_notes: adminNotes
      });
      setSelectedSub(null);
      setAdminNotes('');
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      alert(isRtl ? 'فشلت العملية.' : 'L\'opération a échoué.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 size={10} />
            {isRtl ? 'نشط' : 'Actif'}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock size={10} />
            {isRtl ? 'قيد المراجعة' : 'En attente'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle size={10} />
            {isRtl ? 'مرفوض' : 'Refusé'}
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <AlertCircle size={10} />
            {isRtl ? 'منتهي الصلاحية' : 'Expiré'}
          </span>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'pending', label: isRtl ? 'طلبات الانتظار' : 'En attente' },
    { id: 'active', label: isRtl ? 'الاشتراكات النشطة' : 'Actifs' },
    { id: 'rejected', label: isRtl ? 'الطلبات المرفوضة' : 'Refusés' },
    { id: 'expired', label: isRtl ? 'منتهي الصلاحية' : 'Expirés' }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          {isRtl ? 'إدارة الاشتراكات' : 'Gestion des Abonnements'}
        </h1>
        <p className="text-brown mt-1">
          {isRtl ? 'مراجعة وتفعيل اشتراكات المزودين بناءً على وصول CCP.' : 'Validez les demandes d\'abonnement des prestataires sur réception des virements CCP.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-brown hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : data.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-soft border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-brown font-bold text-xs uppercase tracking-wider">
                  <th className="p-4">{isRtl ? 'المزود' : 'Prestataire'}</th>
                  <th className="p-4">{isRtl ? 'الباقة' : 'Plan'}</th>
                  <th className="p-4">{isRtl ? 'تاريخ التقديم' : 'Soumis le'}</th>
                  <th className="p-4">{isRtl ? 'وصل الدفع' : 'Preuve'}</th>
                  <th className="p-4">{isRtl ? 'الحالة' : 'Statut'}</th>
                  <th className="p-4 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {data.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-charcoal">
                        {sub.vendor?.vendor_profile?.business_name || sub.vendor?.name}
                      </div>
                      <div className="text-xs text-brown-light">{sub.vendor?.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="uppercase text-primary font-bold">{sub.plan}</span>
                    </td>
                    <td className="p-4 text-brown-light">
                      {new Date(sub.created_at).toLocaleDateString(locale)}
                    </td>
                    <td className="p-4">
                      {sub.payment_proof && (
                        <a 
                          href={sub.payment_proof} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-xs"
                        >
                          <ExternalLink size={12} />
                          {isRtl ? 'عرض الصورة' : 'Voir le reçu'}
                        </a>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(sub.status)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setAdminNotes(sub.admin_notes || '');
                        }}
                        className="px-4 py-1.5 bg-gold-pale/10 hover:bg-gold-pale/25 border border-gold/15 text-primary rounded-lg text-xs font-bold transition-all"
                      >
                        {activeTab === 'pending' ? (isRtl ? 'مراجعة' : 'Examiner') : (isRtl ? 'تفاصيل' : 'Détails')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gold/30">
          <Clock size={48} className="mx-auto text-gold-pale mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-charcoal">
            {isRtl ? 'لا توجد طلبات' : 'Aucune demande'}
          </h3>
          <p className="text-brown mt-2">
            {isRtl ? 'لا توجد أي اشتراكات في هذا القسم حالياً.' : 'Aucun abonnement trouvé dans cette catégorie.'}
          </p>
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSub(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-cream/30">
                <h2 className="text-2xl font-heading font-bold text-charcoal">
                  {isRtl ? 'تفاصيل طلب الاشتراك' : 'Examen de l\'abonnement'}
                </h2>
                <button onClick={() => setSelectedSub(null)} className="text-brown hover:text-charcoal transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Vendor Details */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs border border-gray-100">
                  <div>
                    <span className="text-brown block">{isRtl ? 'المزود:' : 'Prestataire :'}</span>
                    <span className="font-bold text-charcoal">{selectedSub.vendor?.vendor_profile?.business_name || selectedSub.vendor?.name}</span>
                  </div>
                  <div>
                    <span className="text-brown block">{isRtl ? 'الباقة المطلوبة:' : 'Plan demandé :'}</span>
                    <span className="font-bold uppercase text-primary text-sm">{selectedSub.plan}</span>
                  </div>
                  <div>
                    <span className="text-brown block">{isRtl ? 'البريد الإلكتروني:' : 'Email :'}</span>
                    <span className="font-bold text-charcoal">{selectedSub.vendor?.email}</span>
                  </div>
                  <div>
                    <span className="text-brown block">{isRtl ? 'تاريخ التقديم:' : 'Soumis le :'}</span>
                    <span className="font-bold text-charcoal">{new Date(selectedSub.created_at).toLocaleString(locale)}</span>
                  </div>
                </div>

                {/* Proof Image */}
                {selectedSub.payment_proof && (
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      {isRtl ? 'وصل دفع CCP / Baridimob المرفق:' : 'Reçu CCP / Baridimob reçu :'}
                    </label>
                    <div className="border border-gold/10 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center max-h-[300px]">
                      <img src={selectedSub.payment_proof} alt="CCP Proof" className="max-h-[300px] w-auto object-contain" />
                    </div>
                  </div>
                )}

                {/* Notes Input */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    {isRtl ? 'ملاحظات الإدارة (اختياري):' : 'Note d\'administration (facultatif) :'}
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gold/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none resize-none text-sm"
                    placeholder={isRtl ? 'اكتب ملاحظتك للمزود هنا...' : 'Écrivez un message ou une note au prestataire...'}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
                {selectedSub.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction('reject')}
                      disabled={submitting}
                      className="flex-1 py-3 px-6 rounded-xl border border-red-200 bg-white text-red-500 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-1"
                    >
                      <X size={18} />
                      <span>{isRtl ? 'رفض الطلب' : 'Refuser'}</span>
                    </button>
                    <button
                      onClick={() => handleAction('approve')}
                      disabled={submitting}
                      className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-bold shadow-gold hover:bg-primary-dark transition-all flex items-center justify-center gap-1"
                    >
                      <Check size={18} />
                      <span>{isRtl ? 'تفعيل وتأكيد' : 'Approuver & Activer'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedSub(null)}
                    className="w-full py-3 px-6 rounded-xl border border-gold/20 bg-white text-charcoal font-bold hover:bg-gray-50 transition-all"
                  >
                    {isRtl ? 'إغلاق' : 'Fermer'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
