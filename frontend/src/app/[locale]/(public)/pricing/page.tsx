'use client';

import { useLocale } from 'next-intl';
import { Check, HelpCircle, Star, Sparkles, Trophy, Award } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function PricingPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const plans = [
    {
      name: isRtl ? 'مجاني' : 'Gratuit',
      price: '0 DZD',
      period: isRtl ? '/سنوياً' : '/an',
      description: isRtl ? 'ابدأ حضورك الرقمي مجاناً' : 'Commencez votre présence en ligne gratuitement',
      icon: Award,
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط (قاعة، مصور، إلخ)' : '1 seule annonce de service (salle, photo, etc.)',
        isRtl ? 'حتى 5 صور بجودة عالية' : 'Jusqu\'à 5 photos haute qualité',
        isRtl ? 'رؤية أساسية في نتائج البحث' : 'Visibilité basique dans les résultats',
        isRtl ? 'تلقي طلبات الحجز المباشرة' : 'Réception des demandes de réservation directes',
      ],
      cta: isRtl ? 'ابدأ الآن' : 'Commencer',
      popular: false,
      color: 'border-gray-200 text-charcoal bg-white',
      badgeColor: 'bg-gray-100 text-gray-800'
    },
    {
      name: isRtl ? 'فضي' : 'Argent',
      price: '15,000 DZD',
      period: isRtl ? '/سنوياً' : '/an',
      description: isRtl ? 'مثالي لزيادة عملائك الأوائل' : 'Idéal pour booster vos premiers clients',
      icon: Star,
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط' : '1 seule annonce de service',
        isRtl ? 'حتى 15 صورة لعرض تفاصيل عملك' : 'Jusqu\'à 15 photos pour valoriser votre travail',
        isRtl ? 'شارة "مميز" الفضية على إعلانك' : 'Badge "Recommandé" Argent sur votre annonce',
        isRtl ? 'ترتيب بحث محسّن (أعلى من المجاني)' : 'Classement de recherche amélioré (au-dessus du Gratuit)',
        isRtl ? 'تلقي تقييمات العملاء' : 'Réception des avis clients',
      ],
      cta: isRtl ? 'اشترك الآن' : 'S\'abonner',
      popular: false,
      color: 'border-gray-300 text-charcoal bg-white',
      badgeColor: 'bg-gray-200 text-gray-700'
    },
    {
      name: isRtl ? 'ذهبي' : 'Or',
      price: '35,000 DZD',
      period: isRtl ? '/سنوياً' : '/an',
      description: isRtl ? 'الخيار الأكثر شعبية للمحترفين' : 'Le choix le plus populaire pour les professionnels',
      icon: Sparkles,
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط' : '1 seule annonce de service',
        isRtl ? 'حتى 30 صورة احترافية' : 'Jusqu\'à 30 photos professionnelles',
        isRtl ? 'شارة "شريك ذهبي" ممتازة' : 'Badge "Partenaire Or" premium',
        isRtl ? 'ترتيب أولوية عالي في نتائج البحث' : 'Classement prioritaire dans la recherche',
        isRtl ? 'إحصائيات أساسية للزيارات والمشاهدات' : 'Statistiques basiques (visites et clics)',
        isRtl ? 'دعم فني سريع' : 'Support client prioritaire',
      ],
      cta: isRtl ? 'الأكثر شعبية' : 'Le plus populaire',
      popular: true,
      color: 'border-primary ring-2 ring-primary text-charcoal bg-white',
      badgeColor: 'bg-primary text-white'
    },
    {
      name: isRtl ? 'بلاتينيوم' : 'Platine',
      price: '65,000 DZD',
      period: isRtl ? '/سنوياً' : '/an',
      description: isRtl ? 'أقصى درجات التميز والسيطرة على السوق' : 'L\'excellence ultime pour dominer le marché',
      icon: Trophy,
      features: [
        isRtl ? 'إدراج خدمة واحدة فقط' : '1 seule annonce de service',
        isRtl ? 'صور غير محدودة بجودة كاملة' : 'Photos illimitées en haute résolution',
        isRtl ? 'شارة "شريك النخبة" البلاتينية' : 'Badge "Partenaire Elite" Platine',
        isRtl ? 'ترتيب الصدارة المطلق (أعلى الصفحة)' : 'Classement au sommet absolu des recherches',
        isRtl ? 'ترويج خاص على الصفحة الرئيسية' : 'Mise en avant exclusive sur la page d\'accueil',
        isRtl ? 'لوحة إحصائيات وتحليلات كاملة' : 'Analyses et statistiques complètes',
        isRtl ? 'مدير حساب مخصص لدعمك' : 'Gestionnaire de compte dédié',
      ],
      cta: isRtl ? 'تواصل معنا' : 'Contacter l\'élite',
      popular: false,
      color: 'border-gold text-charcoal bg-gradient-to-b from-white to-gold-pale/5 shadow-gold-sm',
      badgeColor: 'bg-gold text-charcoal'
    }
  ];

  return (
    <div className="py-20 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {isRtl ? 'خطط بسيطة ومميزات واضحة' : 'Des tarifs clairs, aucun frais caché'}
          </h1>
          <p className="text-lg text-brown">
            {isRtl 
              ? 'اختر الباقة المناسبة لأعمالك. ركّز على جودة خدمتك ودعنا نتكفل بجذب العرسان إليك.' 
              : 'Propulsez votre entreprise de mariage en Algérie. Choisissez le plan adapté à vos ambitions.'}
          </p>
          <div className="mt-4 p-3 bg-gold/10 inline-flex items-center gap-2 rounded-xl text-primary font-medium text-sm">
            <HelpCircle size={16} />
            <span>{isRtl ? 'تنبيه: يُسمح بإدراج خدمة واحدة فقط لكل شريك' : 'Important : 1 seul service autorisé par prestataire'}</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div 
                key={index} 
                className={`relative rounded-3xl border p-8 flex flex-col transition-all hover:translate-y-[-4px] hover:shadow-lg ${plan.color}`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-gold-sm">
                    {isRtl ? 'الأكثر طلباً' : 'Recommandé'}
                  </span>
                )}
                
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-heading font-bold">{plan.name}</span>
                    <div className={`p-2 rounded-xl ${plan.badgeColor}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                    <span className="text-brown text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-brown mt-2 min-h-[32px]">{plan.description}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gold/10 w-full mb-6" />

                {/* Features List */}
                <ul className="space-y-4 flex-1 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-sm text-charcoal">
                      <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action CTA */}
                <Link
                  href="/register?role=vendor"
                  className={`w-full py-3 rounded-xl font-bold text-center transition-all ${
                    plan.popular
                      ? 'bg-primary text-white shadow-gold hover:bg-primary-dark'
                      : plan.name === 'Platine' || plan.name === 'بلاتينيوم'
                      ? 'bg-gold text-charcoal hover:bg-gold/90'
                      : 'bg-gold-pale/10 text-primary hover:bg-gold-pale/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Offline Payment Notice */}
        <div className="bg-white rounded-3xl border border-gold/15 p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal mb-1">
                {isRtl ? 'كيف يتم تفعيل الاشتراك؟' : 'Comment activer votre abonnement ?'}
              </h3>
              <p className="text-brown text-sm">
                {isRtl 
                  ? 'الدفع يتم يدوياً عبر الحساب البريدي الجاري (CCP) أو Baridimob. بعد تحويل المبلغ، ترفع صورة الوصل من لوحة التحكم الخاصة بك وسيقوم المشرفون بتفعيل حسابك في أقل من 24 ساعة.'
                  : 'Le paiement s\'effectue hors-ligne par CCP ou Baridimob. Après le transfert, importez simplement le reçu depuis votre espace prestataire pour une activation sous 24h.'}
              </p>
            </div>
          </div>
          <Link
            href="/register?role=vendor"
            className="flex-shrink-0 px-6 py-3 bg-charcoal text-white hover:bg-black transition-colors rounded-xl font-bold"
          >
            {isRtl ? 'سجل كشريك الآن' : 'Créer mon espace prestataire'}
          </Link>
        </div>
      </div>
    </div>
  );
}
