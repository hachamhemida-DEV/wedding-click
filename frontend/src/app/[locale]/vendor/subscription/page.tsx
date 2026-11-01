'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLocale } from 'next-intl';
import { 
  CreditCard, 
  Check, 
  Upload, 
  Loader2, 
  HelpCircle, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export default function VendorSubscription() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<any>(null);
  
  // Upgrade Request State
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/subscription');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch subscription', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/services/upload-image', formData);
      setPaymentProof(res.data.url);
    } catch (err) {
      console.error('Upload failed', err);
      alert(isRtl ? 'فشل تحميل الصورة.' : 'Le téléchargement de l\'image a échoué.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      alert(isRtl ? 'الرجاء اختيار باقة.' : 'Veuillez choisir un plan.');
      return;
    }
    if (selectedPlan !== 'free' && !paymentProof) {
      alert(isRtl ? 'الرجاء تحميل وصل الدفع.' : 'Veuillez télécharger le reçu de paiement.');
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await api.post('/vendor/subscriptions', {
        plan: selectedPlan,
        payment_proof: selectedPlan === 'free' ? 'https://res.cloudinary.com/demo/image/upload/v1580976541/sample.jpg' : paymentProof
      });
      setMessage({
        type: 'success',
        text: isRtl 
          ? 'تم تقديم طلبك بنجاح! سيقوم المشرفون بمراجعته في أقرب وقت.' 
          : 'Votre demande a été soumise avec succès ! Les administrateurs la valideront sous peu.'
      });
      setSelectedPlan('');
      setPaymentProof('');
      fetchSubscription();
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || (isRtl ? 'حدث خطأ غير متوقع.' : 'Une erreur inattendue est survenue.')
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 size={12} />
            {isRtl ? 'نشط' : 'Actif'}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock size={12} />
            {isRtl ? 'قيد المراجعة' : 'En attente'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle size={12} />
            {isRtl ? 'مرفوض' : 'Refusé'}
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <AlertCircle size={12} />
            {isRtl ? 'منتهي الصلاحية' : 'Expiré'}
          </span>
        );
      default:
        return null;
    }
  };

  const plans = [
    {
      id: 'free',
      name: isRtl ? 'مجاني' : 'Gratuit',
      price: '0 DZD',
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط' : '1 seule annonce de service',
        isRtl ? 'حتى 5 صور عالية الدقة' : 'Jusqu\'à 5 photos',
        isRtl ? 'رؤية أساسية' : 'Visibilité basique',
      ]
    },
    {
      id: 'silver',
      name: isRtl ? 'فضي' : 'Argent',
      price: '15,000 DZD',
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط' : '1 seule annonce de service',
        isRtl ? 'حتى 15 صورة' : 'Jusqu\'à 15 photos',
        isRtl ? 'شارة "مميز" فضية' : 'Badge "Recommandé" Argent',
        isRtl ? 'ترتيب بحث محسّن' : 'Classement amélioré',
      ]
    },
    {
      id: 'gold',
      name: isRtl ? 'ذهبي' : 'Or',
      price: '35,000 DZD',
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط' : '1 seule annonce de service',
        isRtl ? 'حتى 30 صورة' : 'Jusqu\'à 30 photos',
        isRtl ? 'شارة "شريك ذهبي" ممتازة' : 'Badge "Or" premium',
        isRtl ? 'أولوية الظهور في البحث' : 'Classement prioritaire',
        isRtl ? 'إحصائيات أساسية للزيارات' : 'Statistiques basiques',
      ]
    },
    {
      id: 'platinum',
      name: isRtl ? 'بلاتينيوم' : 'Platine',
      price: '65,000 DZD',
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط' : '1 seule annonce de service',
        isRtl ? 'صور غير محدودة' : 'Photos illimitées',
        isRtl ? 'شارة النخبة البلاتينية' : 'Badge Elite Platine',
        isRtl ? 'الصدارة المطلقة في البحث' : 'Classement sommet absolu',
        isRtl ? 'ترويج خاص على الصفحة الرئيسية' : 'Promotion sur page d\'accueil',
        isRtl ? 'تحليلات وإحصائيات كاملة' : 'Analyses complètes',
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const activeSub = data?.active;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          {isRtl ? 'اشتراكي وباقاتي' : 'Mon Abonnement & Forfaits'}
        </h1>
        <p className="text-brown mt-1">
          {isRtl ? 'تابع باقتك الحالية أو قم بترقيتها لزيادة التفاعل وعملاءك.' : 'Suivez votre abonnement actuel ou passez au niveau supérieur.'}
        </p>
      </div>

      {/* Current Subscription Status */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-primary">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading font-bold text-lg text-charcoal">
                {isRtl ? 'الباقة الحالية:' : 'Plan actuel :'} <span className="uppercase text-primary">{data?.plan || 'free'}</span>
              </span>
              {activeSub ? getStatusBadge('active') : getStatusBadge('expired')}
            </div>
            <p className="text-xs text-brown">
              {activeSub 
                ? (isRtl 
                  ? `تنتهي الصلاحية في: ${new Date(activeSub.expires_at).toLocaleDateString(locale)}` 
                  : `Expire le : ${new Date(activeSub.expires_at).toLocaleDateString(locale)}`)
                : (isRtl 
                  ? 'أنت تستخدم الباقة المجانية ذات الرؤية المحدودة.' 
                  : 'Vous utilisez le forfait gratuit avec visibilité de base.')}
            </p>
          </div>
        </div>

        <div className="text-sm font-semibold flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <span className="text-brown block text-xs">{isRtl ? 'الخدمات المسموحة' : 'Annonces autorisées'}</span>
            <span className="font-bold text-charcoal">1 / 1</span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <span className="text-brown block text-xs">{isRtl ? 'الحد الأقصى للصور' : 'Limite de photos'}</span>
            <span className="font-bold text-charcoal">{data?.max_photos || 5}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment & Request Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gold/10 p-6 shadow-soft space-y-6">
            <h3 className="font-heading font-bold text-xl text-charcoal">
              {isRtl ? 'طلب ترقية أو تجديد الباقة' : 'Demander un surclassement / renouvellement'}
            </h3>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-6">
              
              {/* Choose Plan */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-3">
                  {isRtl ? '1. اختر باقة الاشتراك الجديدة:' : '1. Sélectionnez votre forfait :'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plans.filter(p => p.id !== 'free').map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex justify-between items-center ${
                        selectedPlan === plan.id 
                          ? 'border-primary bg-gold-pale/10 shadow-gold-sm' 
                          : 'border-gray-100 hover:border-gold/20'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-charcoal uppercase block text-sm">{plan.name}</span>
                        <span className="text-xs text-primary font-bold">{plan.price} {isRtl ? '/سنة' : '/an'}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPlan === plan.id ? 'border-primary bg-primary text-white' : 'border-gray-300'
                      }`}>
                        {selectedPlan === plan.id && <Check size={12} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPlan && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* CCP details */}
                  <div className="bg-cream/40 rounded-xl p-4 border border-gold/15 space-y-3">
                    <h4 className="font-bold text-primary flex items-center gap-1.5 text-sm">
                      <HelpCircle size={16} />
                      {isRtl ? 'تعليمات الدفع خارج الإنترنت (CCP):' : 'Instructions de paiement hors-ligne :'}
                    </h4>
                    <p className="text-xs text-brown leading-relaxed">
                      {isRtl 
                        ? 'يرجى تحويل المبلغ المالي الخاص بالباقة المختارة إلى الحساب البريدي التالي:' 
                        : 'Veuillez effectuer le transfert sur le compte postal suivant :'}
                    </p>
                    <div className="bg-white border border-gold/10 p-3 rounded-lg text-xs space-y-1.5 font-mono text-charcoal">
                      <div><span className="font-bold text-brown">{isRtl ? 'الاسم واللقب:' : 'Nom & Prénom :'}</span> REDOUANE ABDELKADER</div>
                      <div><span className="font-bold text-brown">{isRtl ? 'رقم الحساب الجاري (CCP):' : 'Compte CCP :'}</span> 0012345678 / 90</div>
                      <div><span className="font-bold text-brown">{isRtl ? 'مفتاح الحساب البريدي (Clé):' : 'Clé CCP :'}</span> 12</div>
                    </div>
                  </div>

                  {/* Payment Receipt Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      {isRtl ? '2. قم برفع صورة وصل تحويل الأموال:' : '2. Téléversez le reçu de virement :'}
                    </label>
                    <div className="flex items-center gap-4">
                      {paymentProof ? (
                        <div className="relative w-28 aspect-[3/4] rounded-lg overflow-hidden border border-gold/20 shadow-sm">
                          <img src={paymentProof} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setPaymentProof('')}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full max-w-[200px] aspect-[4/3] rounded-xl border-2 border-dashed border-gold/20 hover:border-primary flex flex-col items-center justify-center text-brown-light hover:text-primary cursor-pointer transition-all">
                          {uploadingImage ? (
                            <Loader2 className="animate-spin text-primary" size={24} />
                          ) : (
                            <>
                              <Upload size={24} />
                              <span className="text-[10px] mt-1.5 font-bold uppercase">{isRtl ? 'رفع الوصل' : 'Charger le reçu'}</span>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                      )}
                      <p className="text-xs text-brown leading-relaxed max-w-xs">
                        {isRtl 
                          ? 'ارفع لقطة شاشة من تطبيق Baridimob أو صورة واضحة لوصل CCP الورقي.' 
                          : 'Fournissez une capture d\'écran claire du virement Baridimob ou du reçu de bureau de poste.'}
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="w-full btn-gold py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold disabled:opacity-75"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                    <span>{isRtl ? 'إرسال طلب التفعيل' : 'Envoyer la demande d\'activation'}</span>
                  </button>

                </div>
              )}

            </form>
          </div>
        </div>

        {/* History & Timeline */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gold/10 p-6 shadow-soft space-y-6">
            <h3 className="font-heading font-bold text-lg text-charcoal">
              {isRtl ? 'سجل الطلبات' : 'Historique des demandes'}
            </h3>

            {data?.history && data.history.length > 0 ? (
              <div className="space-y-4">
                {data.history.map((h: any) => (
                  <div key={h.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="uppercase font-bold text-xs text-charcoal">{h.plan} plan</span>
                      {getStatusBadge(h.status)}
                    </div>
                    <div className="text-[10px] text-brown-light space-y-0.5">
                      <div>{isRtl ? 'تاريخ التقديم:' : 'Soumis le :'} {new Date(h.created_at).toLocaleDateString(locale)}</div>
                      {h.expires_at && (
                        <div>{isRtl ? 'تاريخ الانتهاء:' : 'Expire le :'} {new Date(h.expires_at).toLocaleDateString(locale)}</div>
                      )}
                    </div>
                    {h.admin_notes && (
                      <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100 text-[10px] text-brown">
                        <span className="font-bold">{isRtl ? 'ملاحظة الإدارة:' : 'Note Admin :'}</span> {h.admin_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brown text-center py-6">
                {isRtl ? 'لا يوجد سجل اشتراكات حتى الآن.' : 'Aucun historique de demande trouvé.'}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
