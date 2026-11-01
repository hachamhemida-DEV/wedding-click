'use client';

import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, Phone, ArrowRight, ArrowLeft, Grid, Loader2, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse, ApiError } from '@/types/auth';
import { AxiosError } from 'axios';
import { ALGERIA_WILAYAS } from '@/lib/constants';

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

type RegisterVendorForm = z.infer<typeof registerVendorSchema>;

export default function RegisterVendorPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterVendorForm>({
    resolver: zodResolver(registerVendorSchema),
  });

  const onSubmit = async (data: RegisterVendorForm) => {
    setServerError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/register/vendor', {
        ...data,
        language_preference: locale,
      });
      setAuth(response.data.user, response.data.token);
      router.push('/vendor/dashboard' as any);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0]?.[0];
        setServerError(firstError || error.response.data.message);
      } else {
        setServerError(
          error.response?.data?.message || (isRtl ? 'حدث خطأ. حاول مرة أخرى.' : 'Une erreur est survenue.')
        );
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gold-pale/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-gold-pale/20 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full space-y-8 glass-panel p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgba(184,149,106,0.2)] border border-gold/30 relative z-10"
      >
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="font-logo text-3xl font-bold text-primary">Wed in Click</span>
          </Link>
          <span className="block text-primary font-medium text-sm tracking-wider uppercase mb-2">
            {isRtl ? 'حساب أعمال / مزود خدمة' : 'Compte Prestataire'}
          </span>
          <h2 className="text-3xl font-heading font-bold text-charcoal">
            {isRtl ? 'انضم كشريك أعمال' : 'Devenir Partenaire'}
          </h2>
          <p className="mt-2 text-sm text-brown">
            {isRtl ? 'اعرض خدماتك واصل لآلاف العرسان المحتملين في الجزائر.' : 'Présentez vos services et touchez des milliers de futurs mariés en Algérie.'}
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              {isRtl ? 'الاسم الكامل' : 'Nom complet'}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
                <Store className="h-5 w-5" />
              </div>
              <input
                type="text"
                {...register('name')}
                className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              {isRtl ? 'اسم العمل أو الشركة' : 'Nom de l\'entreprise / Marque'}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
                <Store className="h-5 w-5" />
              </div>
              <input
                type="text"
                {...register('business_name')}
                className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                placeholder={isRtl ? 'مثال: ستوديو أحمد للتصوير' : 'Ex: Studio Ahmed Photography'}
              />
            </div>
            {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {isRtl ? 'فئة الخدمة' : 'Catégorie de service'}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
                  <Grid className="h-5 w-5" />
                </div>
                <select
                  {...register('category')}
                  className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-charcoal appearance-none`}
                >
                  <option value="">{isRtl ? 'اختر الفئة' : 'Choisir la catégorie'}</option>
                  <option value="halls">{isRtl ? 'قاعات' : 'Salles des fêtes'}</option>
                  <option value="photography">{isRtl ? 'مصورين' : 'Photographie'}</option>
                  <option value="catering">{isRtl ? 'طباخين' : 'Traiteur'}</option>
                  <option value="decoration">{isRtl ? 'ديكور' : 'Décoration'}</option>
                  <option value="cakes">{isRtl ? 'كعك' : 'Gâteaux de mariage'}</option>
                  <option value="jewelry">{isRtl ? 'مجوهرات' : 'Bijoux'}</option>
                  <option value="makeup">{isRtl ? 'مكياج' : 'Maquillage'}</option>
                  <option value="sweets">{isRtl ? 'حلويات' : 'Pâtisserie & Confiserie'}</option>
                </select>
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {isRtl ? 'الولاية' : 'Wilaya'}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <select
                  {...register('wilaya')}
                  className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-charcoal appearance-none`}
                >
                  <option value="">{isRtl ? 'اختر الولاية' : 'Choisir la wilaya'}</option>
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.id} value={w.name_fr}>
                      {w.id} - {isRtl ? w.name_ar : w.name_fr}
                    </option>
                  ))}
                </select>
              </div>
              {errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">
                {isRtl ? 'رقم الهاتف' : 'Numéro de téléphone'}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  dir="ltr"
                  {...register('phone')}
                  className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-left`}
                  placeholder="+213 "
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

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
                className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
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
                className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              {isRtl ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-brown-light`}>
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                {...register('password_confirmation')}
                className={`w-full bg-white border border-gold/30 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold py-3.5 mt-4 flex justify-center items-center gap-2 text-lg font-semibold rounded-xl disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isRtl ? 'متابعة التسجيل' : 'Continuer l\'inscription'}
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brown">
          {isRtl ? 'لديك حساب أعمال بالفعل؟ ' : 'Vous avez déjà un compte ? '}
          <Link href="/login" className="font-medium text-primary hover:text-gold-dark hover:underline">
            {isRtl ? 'تسجيل الدخول' : 'Connectez-vous'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
