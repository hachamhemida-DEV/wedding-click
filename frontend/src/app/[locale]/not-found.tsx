'use client';

import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        {/* Large 404 Number */}
        <div className="relative mb-8">
          <span className="text-[160px] md:text-[200px] font-heading font-bold text-gold/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles size={36} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
          {isRtl ? 'الصفحة غير موجودة' : 'Page introuvable'}
        </h1>
        <p className="text-brown text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          {isRtl 
            ? 'يبدو أن هذه الصفحة غير موجودة أو تم نقلها. دعنا نعيدك إلى الطريق الصحيح!'
            : 'Cette page n\'existe pas ou a été déplacée. Laissez-nous vous remettre sur la bonne voie !'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-gold px-8 py-3.5 font-bold inline-flex items-center justify-center gap-2"
          >
            <Home size={18} />
            {isRtl ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
          </Link>
          <Link
            href="/search"
            className="px-8 py-3.5 border-2 border-gold text-primary hover:bg-cream rounded-xl font-bold transition-all inline-flex items-center justify-center gap-2"
          >
            <Search size={18} />
            {isRtl ? 'ابحث عن خدمات' : 'Rechercher des services'}
          </Link>
        </div>
      </div>
    </div>
  );
}
