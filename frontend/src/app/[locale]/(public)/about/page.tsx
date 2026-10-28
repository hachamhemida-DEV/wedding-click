'use client';

import { useLocale } from 'next-intl';
import { 
  Heart, 
  Search, 
  CalendarCheck, 
  Star,
  Shield,
  Users,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AboutPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const steps = [
    {
      icon: Search,
      title: isRtl ? 'ابحث واكتشف' : 'Recherchez & Découvrez',
      description: isRtl 
        ? 'تصفح مئات مقدمي خدمات الأعراس المعتمدين عبر كل ولايات الجزائر. قاعات، مصورين، طباخين والمزيد.'
        : 'Parcourez des centaines de prestataires de mariage vérifiés à travers les 58 wilayas d\'Algérie. Salles, photographes, traiteurs et plus.',
    },
    {
      icon: Heart,
      title: isRtl ? 'احفظ واقارن' : 'Enregistrez & Comparez',
      description: isRtl 
        ? 'أضف مزوديك المفضلين إلى قائمة الأمنيات. قارن الأسعار والتقييمات واختر الأفضل لحفلك.'
        : 'Ajoutez vos prestataires favoris à votre liste de souhaits. Comparez les prix, les avis et choisissez le meilleur pour votre célébration.',
    },
    {
      icon: CalendarCheck,
      title: isRtl ? 'احجز بثقة' : 'Réservez en Confiance',
      description: isRtl 
        ? 'أرسل طلبات الحجز مباشرة إلى المزود. تابع حالة حجزك في الوقت الفعلي من لوحة التحكم.'
        : 'Envoyez des demandes de réservation directement au prestataire. Suivez le statut de votre réservation en temps réel depuis votre espace.',
    },
    {
      icon: Star,
      title: isRtl ? 'قيّم وشارك تجربتك' : 'Évaluez & Partagez',
      description: isRtl 
        ? 'بعد إتمام الخدمة، شارك تقييمك لمساعدة العرسان القادمين على اتخاذ قرارات أفضل.'
        : 'Après votre événement, partagez votre avis pour aider les futurs mariés à faire les meilleurs choix.',
    },
  ];

  const stats = [
    { value: '58', label: isRtl ? 'ولاية مغطاة' : 'Wilayas couvertes' },
    { value: '8+', label: isRtl ? 'فئة خدمات' : 'Catégories de services' },
    { value: '24/7', label: isRtl ? 'منصة متاحة' : 'Plateforme accessible' },
    { value: '100%', label: isRtl ? 'جزائرية' : 'Algérienne' },
  ];

  return (
    <div className="bg-background">

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-cream via-white to-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8956A\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <Sparkles size={16} />
            <span>{isRtl ? 'منصة 100% جزائرية' : 'Plateforme 100% Algérienne'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-charcoal mb-6 leading-tight">
            {isRtl 
              ? <>عرسك، <span className="text-primary">بنقرة واحدة</span></>
              : <>Votre mariage, <span className="text-primary">en un clic</span></>}
          </h1>
          <p className="text-lg md:text-xl text-brown max-w-2xl mx-auto leading-relaxed">
            {isRtl 
              ? 'Wed in Click هي أول منصة رقمية جزائرية متخصصة في ربط العرسان بأفضل مقدمي خدمات الأعراس عبر كل ولايات الوطن.'
              : 'Wed in Click est la première marketplace algérienne dédiée à connecter les futurs mariés avec les meilleurs prestataires de mariage à travers tout le pays.'}
          </p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-charcoal py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gold-pale text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              {isRtl ? 'كيف يعمل الموقع؟' : 'Comment ça marche ?'}
            </h2>
            <p className="text-brown text-lg max-w-xl mx-auto">
              {isRtl ? 'أربع خطوات بسيطة لتنظيم عرس أحلامك' : 'Quatre étapes simples pour organiser le mariage de vos rêves'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="group bg-white rounded-2xl p-8 border border-gold/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon size={26} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                        {isRtl ? `الخطوة ${i + 1}` : `Étape ${i + 1}`}
                      </div>
                      <h3 className="text-xl font-heading font-bold text-charcoal mb-2">{step.title}</h3>
                      <p className="text-brown text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-cream/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-6">
                {isRtl ? 'مهمتنا' : 'Notre Mission'}
              </h2>
              <div className="space-y-4 text-brown leading-relaxed">
                <p>
                  {isRtl 
                    ? 'نؤمن بأن كل عروسين يستحقون تجربة تنظيم عرس سلسة وممتعة. لذلك أنشأنا Wed in Click — منصة تجمع أفضل مقدمي خدمات الأعراس في الجزائر في مكان واحد.'
                    : 'Nous croyons que chaque couple mérite une expérience de planification de mariage fluide et agréable. C\'est pourquoi nous avons créé Wed in Click — une plateforme qui rassemble les meilleurs prestataires de mariage d\'Algérie en un seul endroit.'}
                </p>
                <p>
                  {isRtl 
                    ? 'نسعى لرقمنة قطاع الأعراس في الجزائر وتقديم تجربة حجز شفافة وموثوقة لكل من العرسان ومقدمي الخدمات.'
                    : 'Notre objectif est de digitaliser le secteur du mariage en Algérie et d\'offrir une expérience de réservation transparente et fiable pour les mariés et les prestataires.'}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { icon: Shield, title: isRtl ? 'مزودون معتمدون' : 'Prestataires vérifiés', desc: isRtl ? 'كل مزود يخضع لمراجعة دقيقة قبل نشره على المنصة.' : 'Chaque prestataire est vérifié avant d\'être publié sur la plateforme.' },
                { icon: MapPin, title: isRtl ? 'تغطية وطنية' : 'Couverture nationale', desc: isRtl ? 'خدمات متاحة في جميع ولايات الجزائر الـ 58.' : 'Services disponibles dans les 58 wilayas d\'Algérie.' },
                { icon: Users, title: isRtl ? 'مجتمع متنامي' : 'Communauté grandissante', desc: isRtl ? 'انضم لآلاف العرسان والمزودين الذين يثقون بمنصتنا.' : 'Rejoignez des milliers de mariés et prestataires qui font confiance à notre plateforme.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-gold/10">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal mb-1">{item.title}</h4>
                      <p className="text-sm text-brown">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-charcoal text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            {isRtl ? 'مستعد لبدء التخطيط لعرسك؟' : 'Prêt à planifier votre mariage ?'}
          </h2>
          <p className="text-gold-pale text-lg mb-10 max-w-xl mx-auto">
            {isRtl 
              ? 'اكتشف أفضل مقدمي الخدمات في منطقتك وابدأ رحلتك نحو عرس أحلامك اليوم.'
              : 'Découvrez les meilleurs prestataires près de chez vous et commencez votre voyage vers le mariage de vos rêves.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-gold px-8 py-4 text-base font-bold inline-flex items-center justify-center gap-2">
              <Search size={18} />
              {isRtl ? 'ابحث عن خدمات' : 'Rechercher des services'}
            </Link>
            <Link href="/pricing" className="px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-charcoal rounded-xl font-bold transition-all inline-flex items-center justify-center gap-2">
              <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
              {isRtl ? 'انضم كشريك' : 'Devenir prestataire'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
