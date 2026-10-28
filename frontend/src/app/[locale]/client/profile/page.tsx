'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLocale } from 'next-intl';
import api from '@/lib/api';
import { 
  User, 
  Lock, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ClientProfile() {
  const { user, setAuth } = useAuthStore();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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
      setAuth(res.data.user, localStorage.getItem('auth_token') || '');
      setMessage({ 
        type: 'success', 
        text: isRtl ? 'تم تحديث بياناتك بنجاح' : 'Vos informations ont été mises à jour.' 
      });
      setPasswords({ password: '', password_confirmation: '' });
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          {isRtl ? 'إعدادات الحساب' : 'Paramètres du compte'}
        </h1>
        <p className="text-brown mt-1">
          {isRtl ? 'إدارة معلوماتك الشخصية وكلمة المرور.' : 'Gérez vos informations personnelles et votre mot de passe.'}
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-soft border border-gold/5 space-y-8">
        <div className="flex items-center gap-3 text-primary">
          <User size={24} />
          <h2 className="text-xl font-bold text-charcoal">{isRtl ? 'المعلومات الشخصية' : 'Informations personnelles'}</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">{isRtl ? 'الاسم الكامل' : 'Nom complet'}</label>
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
          </div>

          <div className="pt-6 border-t border-gray-50 space-y-6">
            <div className="flex items-center gap-2 text-charcoal/60 text-sm">
              <Lock size={16} />
              <span>{isRtl ? 'تغيير كلمة المرور (اتركها فارغة إذا كنت لا تريد التغيير)' : 'Changer le mot de passe (laisser vide pour ne pas changer)'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="password"
                placeholder={isRtl ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
                value={passwords.password}
                onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                className="w-full bg-gray-50 border border-gold/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
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
            className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{isRtl ? 'حفظ التغييرات' : 'Enregistrer les modifications'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
