'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { AlertOctagon, RefreshCcw, Home } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-red-100 shadow-xl shadow-red-500/5">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon size={40} />
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">
          {isRtl ? 'عذراً، حدث خطأ غير متوقع' : 'Oups, une erreur inattendue est survenue'}
        </h2>
        
        <p className="text-brown text-sm mb-8 leading-relaxed">
          {isRtl 
            ? 'نعتذر عن هذا الخلل. لقد تم تسجيل الخطأ وسيقوم فريقنا بمراجعته. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.'
            : 'Nous nous excusons pour ce désagrément. L\'erreur a été enregistrée et notre équipe va l\'examiner. Veuillez réessayer ou retourner à l\'accueil.'}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-charcoal text-white hover:bg-charcoal/90 rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCcw size={18} />
            {isRtl ? 'حاول مرة أخرى' : 'Réessayer'}
          </button>
          
          <Link
            href="/"
            className="w-full bg-cream/50 text-charcoal hover:bg-cream rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Home size={18} />
            {isRtl ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
          </Link>
        </div>
      </div>
    </div>
  );
}
