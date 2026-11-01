'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLocale } from 'next-intl';
import { Loader2, Store, MapPin, Upload, X, CheckCircle, Award, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/shared/ToastProvider';
import { ALGERIA_WILAYAS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

interface Category {
  id: number;
  slug: string;
  name_ar: string;
  name_fr: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  wilaya: string;
  category_id: number;
  images: string[];
}

export default function VendorServices() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { showToast } = useToast();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  
  const [service, setService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    wilaya: '',
    category_id: '',
    images: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, categoriesRes, subRes] = await Promise.all([
        api.get('/vendor/services'),
        api.get('/categories'),
        api.get('/vendor/subscription')
      ]);
      
      setCategories(categoriesRes.data);
      setSubscription(subRes.data);

      const existingServices = servicesRes.data;
      if (existingServices.length > 0) {
        const s = existingServices[0];
        setService(s);
        setFormData({
          title: s.title,
          description: s.description || '',
          price: s.price.toString(),
          wilaya: s.wilaya,
          category_id: s.category_id.toString(),
          images: s.images || []
        });
      } else if (user?.vendor_profile) {
        const cat = categoriesRes.data.find((c: Category) => c.slug === user.vendor_profile?.category);
        setFormData({
          title: user.vendor_profile.business_name || '',
          description: '',
          price: '',
          wilaya: user.vendor_profile.wilaya || '',
          category_id: cat ? cat.id.toString() : '',
          images: []
        });
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
      showToast(isRtl ? 'فشل تحميل البيانات' : 'Échec du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price) || 0
      };

      if (service) {
        await api.put(`/vendor/services/${service.id}`, payload);
        showToast(isRtl ? 'تم تحديث النشاط بنجاح' : 'Activité mise à jour avec succès', 'success');
      } else {
        await api.post('/vendor/services', payload);
        showToast(isRtl ? 'تم إنشاء النشاط بنجاح' : 'Activité créée avec succès', 'success');
      }
      fetchData();
    } catch (err: any) {
      console.error('Failed to save service', err);
      showToast(err.response?.data?.message || (isRtl ? 'حدث خطأ غير متوقع' : 'Une erreur inattendue est survenue'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxPhotos = subscription?.max_photos || 5;
    if (formData.images.length >= maxPhotos) {
      showToast(isRtl 
        ? `الباقة الحالية تتيح لك رفع ${maxPhotos} صور كحد أقصى.` 
        : `Votre plan actuel limite à ${maxPhotos} photos.`, 'warning');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await api.post('/services/upload-image', uploadData);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, res.data.url]
      }));
      showToast(isRtl ? 'تم رفع الصورة' : 'Photo téléchargée', 'success');
    } catch (err: any) {
      console.error('Upload failed', err);
      const errorMsg = err?.response?.data?.message || (isRtl ? 'فشل رفع الصورة (تأكد من صيغة الصورة وحجمها أقل من 10MB)' : 'Échec du téléchargement (max 10MB, jpg/png/webp)');
      showToast(errorMsg, 'error');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gold/10 shadow-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal flex items-center gap-3">
            <Store className="text-primary" size={32} />
            {isRtl ? 'ملف نشاطك التجاري' : 'Profil de votre Activité'}
          </h1>
          <p className="text-brown mt-2">
            {isRtl ? 'إدارة إعلان الخدمة الخاص بك المعروض للعملاء على المنصة.' : 'Gérez votre annonce de service présentée aux clients.'}
          </p>
        </div>
        
        {subscription && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gold/20 rounded-xl">
            <Award className="text-primary" size={20} />
            <div className="flex flex-col">
              <span className="text-xs text-brown">{isRtl ? 'الباقة الحالية' : 'Plan actuel'}</span>
              <span className="text-sm font-bold text-charcoal uppercase tracking-wider">{subscription.plan}</span>
            </div>
          </div>
        )}
      </div>

      {!service && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 md:p-6 rounded-2xl flex gap-4">
          <AlertTriangle className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-1">
              {isRtl ? 'لم تقم بإنشاء نشاطك التجاري بعد!' : 'Vous n\'avez pas encore créé votre activité !'}
            </h3>
            <p className="text-sm">
              {isRtl ? 'أكمل النموذج أدناه لنشر خدمتك والبدء في استقبال الحجوزات.' : 'Remplissez le formulaire ci-dessous pour publier votre service et commencer à recevoir des réservations.'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gold/10 shadow-sm p-6 md:p-10 space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-charcoal border-b border-gray-100 pb-2">
            {isRtl ? 'المعلومات الأساسية' : 'Informations de base'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                {isRtl ? 'عنوان الخدمة (اسم القاعة، اسم الفرقة...)' : 'Titre du service (Nom de salle, photographe...)'}
              </label>
              <input 
                required
                disabled
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed rounded-xl py-3 px-4 outline-none"
                title={isRtl ? 'اسم العمل التجاري لا يمكن تغييره' : 'Nom de l\'entreprise non modifiable'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                {isRtl ? 'الفئة' : 'Catégorie'}
              </label>
              <select 
                required
                disabled
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed rounded-xl py-3 px-4 outline-none"
                title={isRtl ? 'لا يمكن تغيير الفئة بعد التسجيل' : 'Catégorie définie lors de l\'inscription'}
              >
                <option value="">{isRtl ? 'اختر فئة' : 'Choisir une catégorie'}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{isRtl ? c.name_ar : c.name_fr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                {isRtl ? 'السعر التقديري (DZD)' : 'Prix estimatif (DZD)'}
              </label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-gray-50 border border-gold/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                {isRtl ? 'الولاية' : 'Wilaya'}
              </label>
              <select 
                required
                disabled
                value={formData.wilaya}
                onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed rounded-xl py-3 px-4 outline-none"
                title={isRtl ? 'لا يمكن تغيير الولاية بعد التسجيل' : 'Wilaya définie lors de l\'inscription'}
              >
                <option value="">{isRtl ? 'اختر ولاية' : 'Choisir une wilaya'}</option>
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.id} value={w.name_fr}>
                    {w.id} - {isRtl ? w.name_ar : w.name_fr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              {isRtl ? 'وصف تفصيلي للخدمة' : 'Description détaillée du service'}
            </label>
            <textarea 
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-50 border border-gold/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder={isRtl ? 'ما الذي يميز خدمتك؟' : 'Qu\'est-ce qui rend votre service unique ?'}
            />
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-charcoal">
              {isRtl ? 'الصور' : 'Photos'}
            </h3>
            <span className="text-sm font-medium bg-gray-100 text-charcoal px-3 py-1 rounded-full">
              {formData.images.length} / {subscription?.max_photos || 5} {isRtl ? 'صور' : 'photos'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gold/20 group">
                <img src={img} alt="Service" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
            
            {formData.images.length < (subscription?.max_photos || 5) && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gold/40 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-brown gap-2">
                <Upload size={28} />
                <span className="text-sm font-medium">{isRtl ? 'رفع صورة' : 'Uploader'}</span>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-gold px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {service ? (isRtl ? 'حفظ التعديلات' : 'Enregistrer les modifications') : (isRtl ? 'نشر النشاط التجاري' : 'Publier l\'activité')}
          </button>
        </div>
      </form>
    </div>
  );
}
