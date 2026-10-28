'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Store, Mail, Lock, Phone, ArrowRight, ArrowLeft, Loader2, MapPin, Grid } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse, ApiError } from '@/types/auth';
import { AxiosError } from 'axios';
import { ALGERIA_WILAYAS } from '@/lib/constants';
import { useEffect } from 'react';

interface Category {
  id: number;
  slug: string;
  name_ar: string;
  name_fr: string;
}

const registerVendorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
  phone: z.string().min(8, 'Phone number is required'),
  business_name: z.string().min(2),
  category: z.string().min(1, 'Category is required'),
  wilaya: z.string().min(1, 'Wilaya is required'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type RegisterVendorValues = z.infer<typeof registerVendorSchema>;

interface Props {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onSwitchToClient?: () => void;
}

export function RegisterVendorForm({ onSuccess, onSwitchToLogin, onSwitchToClient }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterVendorValues>({
    resolver: zodResolver(registerVendorSchema),
  });

  const onSubmit = async (data: RegisterVendorValues) => {
    setServerError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/register/vendor', {
        ...data,
        language_preference: locale,
      });
      setAuth(response.data.user, response.data.token);
      if (onSuccess) onSuccess();
      router.push('/vendor/dashboard' as any);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setServerError(
        error.response?.data?.message || (isRtl ? 'حدث خطأ.' : 'Une erreur est survenue.')
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold text-charcoal">
          {isRtl ? 'انضم كشريك أعمال' : 'Devenir Partenaire'}
        </h2>
        <p className="mt-1 text-sm text-brown">
          {isRtl ? 'اعرض خدماتك لآلاف العرسان.' : 'Développez votre activité avec nous.'}
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
          {serverError}
        </div>
      )}

      <form className="space-y-4 overflow-y-auto max-h-[60vh] px-1" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'الاسم' : 'Nom'}</label>
            <input {...register('name')} className="w-full border border-gold/20 rounded-xl py-2 px-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'اسم العمل' : 'Business'}</label>
            <input {...register('business_name')} className="w-full border border-gold/20 rounded-xl py-2 px-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'الفئة' : 'Catégorie'}</label>
            <select {...register('category')} className="w-full border border-gold/20 rounded-xl py-2 px-3 bg-white">
              <option value="">{isRtl ? '-- اختر الفئة --' : '-- Choisir --'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>
                  {isRtl ? c.name_ar : c.name_fr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'الولاية' : 'Wilaya'}</label>
            <select {...register('wilaya')} className="w-full border border-gold/20 rounded-xl py-2 px-3 bg-white">
              <option value="">--</option>
              {ALGERIA_WILAYAS.map(w => <option key={w.id} value={w.name_fr}>{w.name_fr}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" {...register('email')} className="w-full border border-gold/20 rounded-xl py-2 px-3" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'رقم الهاتف' : 'Téléphone'}</label>
            <input type="tel" dir="ltr" placeholder="+213 " {...register('phone')} className="w-full border border-gold/20 rounded-xl py-2 px-3 text-left" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'كلمة المرور' : 'Pass'}</label>
            <input type="password" {...register('password')} className="w-full border border-gold/20 rounded-xl py-2 px-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'تأكيد' : 'Conf'}</label>
            <input type="password" {...register('password_confirmation')} className="w-full border border-gold/20 rounded-xl py-2 px-3" />
          </div>
        </div>

        <button disabled={isSubmitting} className="w-full btn-gold py-3 flex justify-center items-center gap-2 font-semibold rounded-xl">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <>{isRtl ? 'متابعة التسجيل' : 'S\'inscrire'} <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="text-center space-y-2">
        <p className="text-sm text-brown">
          {isRtl ? 'تبحث عن خدمات؟ ' : 'Vous cherchez des services ? '}
          <button onClick={onSwitchToClient} className="text-primary font-bold">{isRtl ? 'سجل كعميل' : 'Compte Client'}</button>
        </p>
        <p className="text-sm text-brown">
          {isRtl ? 'لديك حساب؟ ' : 'Déjà un compte ? '}
          <button onClick={onSwitchToLogin} className="text-primary font-bold">{isRtl ? 'دخول' : 'Se connecter'}</button>
        </p>
      </div>
    </div>
  );
}
