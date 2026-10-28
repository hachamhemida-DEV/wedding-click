'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse, ApiError } from '@/types/auth';
import { AxiosError } from 'axios';

const registerClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
  phone: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type RegisterClientValues = z.infer<typeof registerClientSchema>;

interface Props {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onSwitchToVendor?: () => void;
}

export function RegisterClientForm({ onSuccess, onSwitchToLogin, onSwitchToVendor }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterClientValues>({
    resolver: zodResolver(registerClientSchema),
  });

  const onSubmit = async (data: RegisterClientValues) => {
    setServerError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/register/client', {
        ...data,
        language_preference: locale,
      });
      setAuth(response.data.user, response.data.token);
      if (onSuccess) onSuccess();
      router.push('/client/dashboard' as any);
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
          {isRtl ? 'إنشاء حساب عريس / عروس' : 'Créer un compte Client'}
        </h2>
        <p className="mt-1 text-sm text-brown">
          {isRtl ? 'ابدأ رحلة التخطيط لزفافك اليوم.' : 'Planifiez le mariage de vos rêves.'}
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
          {serverError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'الاسم الكامل' : 'Nom complet'}</label>
          <div className="relative">
            <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center text-brown-light`}><User size={18} /></div>
            <input {...register('name')} className={`w-full border border-gold/20 rounded-xl py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
          <div className="relative">
            <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center text-brown-light`}><Mail size={18} /></div>
            <input type="email" {...register('email')} className={`w-full border border-gold/20 rounded-xl py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'كلمة المرور' : 'Pass'}</label>
            <input type="password" {...register('password')} className="w-full border border-gold/20 rounded-xl py-2.5 px-4" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{isRtl ? 'تأكيد' : 'Conf'}</label>
            <input type="password" {...register('password_confirmation')} className="w-full border border-gold/20 rounded-xl py-2.5 px-4" />
          </div>
        </div>

        <button disabled={isSubmitting} className="w-full btn-gold py-3.5 flex justify-center items-center gap-2 font-semibold rounded-xl">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <>{isRtl ? 'إنشاء حساب' : 'S\'inscrire'} <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="text-center space-y-2">
        <p className="text-sm text-brown">
          {isRtl ? 'هل أنت مزود خدمة؟ ' : 'Vous êtes un professionnel ? '}
          <button onClick={onSwitchToVendor} className="text-primary font-bold">{isRtl ? 'سجل كشريك' : 'Devenir Partenaire'}</button>
        </p>
        <p className="text-sm text-brown">
          {isRtl ? 'لديك حساب؟ ' : 'Déjà un compte ? '}
          <button onClick={onSwitchToLogin} className="text-primary font-bold">{isRtl ? 'دخول' : 'Se connecter'}</button>
        </p>
      </div>
    </div>
  );
}
