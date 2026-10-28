'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse, ApiError } from '@/types/auth';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface Props {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      setAuth(response.data.user, response.data.token);

      const role = response.data.user.role;
      if (onSuccess) {
        onSuccess();
      }
      
      if (role === 'vendor') {
        router.push('/vendor/dashboard' as any);
      } else if (role === 'admin') {
        router.push('/admin/dashboard' as any);
      } else if (role === 'client') {
        router.push('/client/dashboard' as any);
      } else {
        router.push('/');
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setServerError(
        error.response?.data?.message || (isRtl ? 'حدث خطأ. حاول مرة أخرى.' : 'Une erreur est survenue.')
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold text-charcoal">
          {isRtl ? 'تسجيل الدخول' : 'Connexion'}
        </h2>
        <p className="mt-2 text-sm text-brown">
          {isRtl ? 'مرحباً بعودتك! أدخل بياناتك للوصول إلى حسابك.' : 'Bon retour ! Accédez à votre compte.'}
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
          {serverError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            {isRtl ? 'البريد الإلكتروني' : 'Adresse Email'}
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              {...register('email')}
              className={`w-full bg-white border border-gold/20 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              placeholder="name@example.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            {isRtl ? 'كلمة المرور' : 'Mot de passe'}
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
              <Lock className="h-5 w-5" />
            </div>
            <input
              type="password"
              {...register('password')}
              className={`w-full bg-white border border-gold/20 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-gold py-3.5 flex justify-center items-center gap-2 text-lg font-semibold rounded-xl disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isRtl ? 'دخول' : 'Se Connecter'}
              {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-gold-pale/20 text-center">
        <p className="text-sm text-brown">
          {isRtl ? 'ليس لديك حساب؟' : 'Pas encore de compte ?'}
        </p>
        <button 
          onClick={onSwitchToRegister}
          className="mt-2 text-primary font-bold hover:underline"
        >
          {isRtl ? 'إنشاء حساب جديد' : 'Créer un compte'}
        </button>
      </div>
    </div>
  );
}
