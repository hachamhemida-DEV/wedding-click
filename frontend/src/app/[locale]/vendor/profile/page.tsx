'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLocale } from 'next-intl';
import api from '@/lib/api';
import { 
  User, 
  Store, 
  Lock, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '@/lib/constants';

export default function VendorProfile() {
  const { user, setAuth } = useAuthStore();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [businessInfo, setBusinessInfo] = useState({
    business_name: user?.vendor_profile?.business_name || '',
    description: user?.vendor_profile?.description || '',
    wilaya: user?.vendor_profile?.wilaya || '',
    address: user?.vendor_profile?.address || '',
  });

  const [passwords, setPasswords] = useState({
    password: '',
    password_confirmation: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/profile', {
        ...personalInfo,
        ...passwords
      });
      setAuth(res.data.user, localStorage.getItem('token') || '');
      setMessage({ type: 'success', text: isRtl ? 'تم تحديث الملف الشخصي بنجاح' : 'Profil mis à jour avec succès' });
      setPasswords({ password: '', password_confirmation: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/profile/vendor', businessInfo);
      setAuth(res.data.user, localStorage.getItem('token') || '');
      setMessage({ type: 'success', text: isRtl ? 'تم تحديث معلومات العمل بنجاح' : 'Infos professionnelles mises à jour' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          {isRtl ? 'إعدادات الملف الشخصي' : 'Paramètres du Profil'}
        </h1>
        <p className="text-brown mt-1">
          {isRtl ? 'إدارة معلوماتك الشخصية وتفاصيل عملك.' : 'Gérez vos informations personnelles et professionnelles.'}
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <section className="bg-white p-8 rounded-2xl shadow-soft border border-gold/5 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <User size={24} />
            <h2 className="text-xl font-bold text-charcoal">{isRtl ? 'المعلومات الشخصية' : 'Infos Personnelles'}</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">{isRtl ? 'الاسم الكامل' : 'Nom Complet'}</label>
              <input 
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">{isRtl ? 'رقم الهاتف' : 'Téléphone'}</label>
              <input 
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-4">
                <Lock size={16} />
                <span>{isRtl ? 'تغيير كلمة المرور (اختياري)' : 'Changer le mot de passe (optionnel)'}</span>
              </div>
              <div>
                <input 
                  type="password"
                  placeholder={isRtl ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
                  value={passwords.password}
                  onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                  className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none mb-3"
                />
                <input 
                  type="password"
                  placeholder={isRtl ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
                  value={passwords.password_confirmation}
                  onChange={(e) => setPasswords({...passwords, password_confirmation: e.target.value})}
                  className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>{isRtl ? 'حفظ التغييرات' : 'Enregistrer'}</span>
            </button>
          </form>
        </section>

        {/* Business Info */}
        <section className="bg-white p-8 rounded-2xl shadow-soft border border-gold/5 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Store size={24} />
            <h2 className="text-xl font-bold text-charcoal">{isRtl ? 'معلومات العمل' : 'Infos Business'}</h2>
          </div>

          <form onSubmit={handleUpdateVendor} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">{isRtl ? 'اسم العمل التجاري' : 'Nom du Business'}</label>
              <input 
                value={businessInfo.business_name}
                onChange={(e) => setBusinessInfo({...businessInfo, business_name: e.target.value})}
                className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">{isRtl ? 'الولاية' : 'Wilaya'}</label>
              <select 
                value={businessInfo.wilaya}
                onChange={(e) => setBusinessInfo({...businessInfo, wilaya: e.target.value})}
                className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">{isRtl ? 'اختر الولاية' : 'Choisir la wilaya'}</option>
                {ALGERIA_WILAYAS.map(w => (
                  <option key={w.id} value={w.name_fr}>{w.id} - {isRtl ? w.name_ar : w.name_fr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">{isRtl ? 'وصف العمل' : 'Description'}</label>
              <textarea 
                rows={5}
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder={isRtl ? 'تحدث عن خدماتك وخبرتك...' : 'Décrivez vos services et votre expérience...'}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>{isRtl ? 'تحديث معلومات العمل' : 'Mettre à jour business'}</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
