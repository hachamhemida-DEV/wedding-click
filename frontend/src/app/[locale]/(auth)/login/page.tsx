'use client';

import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
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

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      setAuth(response.data.user, response.data.token);

      // Redirect based on role
      const role = response.data.user.role;
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
        error.response?.data?.message || (isRtl ? 'حدث خطأ. حاول مرة أخرى.' : 'Une erreur est survenue. Réessayez.')
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gold-pale/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gold-pale/20 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 glass-panel p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgba(184,149,106,0.2)] border border-white relative z-10"
      >
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="font-logo text-3xl font-bold text-primary">Wed in Click</span>
          </Link>
          <h2 className="mt-2 text-3xl font-heading font-bold text-charcoal">
            {isRtl ? 'تسجيل الدخول' : 'Connexion'}
          </h2>
          <p className="mt-2 text-sm text-brown">
            {isRtl ? 'مرحباً بعودتك! أدخل بياناتك للوصول إلى حسابك.' : 'Bon retour ! Entrez vos identifiants pour accéder à votre compte.'}
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-charcoal">
                  {isRtl ? 'كلمة المرور' : 'Mot de passe'}
                </label>
              </div>
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

        <div className="mt-8 pt-6 border-t border-gold-pale/20">
          <p className="text-center text-sm text-brown">
            {isRtl ? 'ليس لديك حساب؟' : 'Pas encore de compte ?'}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register/client" className="text-primary font-medium hover:underline text-sm text-center">
              {isRtl ? 'حساب عريس/عروس' : 'Compte Client'}
            </Link>
            <span className="hidden sm:inline text-brown/30">|</span>
            <Link href="/register/vendor" className="text-primary font-medium hover:underline text-sm text-center">
              {isRtl ? 'حساب مزود خدمة' : 'Compte Prestataire'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
