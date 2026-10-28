'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function FaqPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const faqGroups = [
    {
      title: isRtl ? 'للعرسان والزبائن' : 'Pour les Mariés & Clients',
      faqs: [
        {
          q: isRtl ? 'كيف أبحث عن مزود خدمات أعراس؟' : 'Comment trouver un prestataire de mariage ?',
          a: isRtl 
            ? 'اذهب إلى صفحة البحث واختر الفئة (قاعة، مصور، طباخ...) والولاية. يمكنك أيضاً تحديد نطاق سعري. ستظهر لك النتائج مرتبة حسب الأفضلية.'
            : 'Rendez-vous sur la page Recherche, sélectionnez une catégorie (salle, photographe, traiteur...) et une wilaya. Vous pouvez aussi définir une fourchette de prix. Les résultats s\'affichent par ordre de pertinence.',
        },
        {
          q: isRtl ? 'هل الحجز عبر المنصة مجاني؟' : 'La réservation via la plateforme est-elle gratuite ?',
          a: isRtl 
            ? 'نعم، التسجيل والحجز مجاني تماماً للزبائن. لا توجد أي رسوم خفية. المنصة تربح فقط من اشتراكات المزودين.'
            : 'Oui, l\'inscription et la réservation sont totalement gratuites pour les clients. Aucun frais caché. La plateforme se finance uniquement par les abonnements des prestataires.',
        },
        {
          q: isRtl ? 'كيف أضيف خدمة إلى قائمة الأمنيات؟' : 'Comment ajouter un service à ma liste de souhaits ?',
          a: isRtl 
            ? 'انقر على أيقونة القلب ❤️ على بطاقة أي خدمة. ستحتاج إلى تسجيل الدخول أولاً. يمكنك مراجعة جميع مفضلاتك من صفحة "قائمة الأمنيات" في لوحة التحكم.'
            : 'Cliquez sur l\'icône cœur ❤️ sur la carte d\'un service. Vous devrez être connecté. Retrouvez tous vos favoris depuis la page « Liste de souhaits » de votre espace.',
        },
        {
          q: isRtl ? 'كيف يعمل نظام التقييمات؟' : 'Comment fonctionne le système d\'avis ?',
          a: isRtl 
            ? 'يمكنك كتابة تقييم فقط بعد إتمام الخدمة (حالة الحجز: مكتمل). هذا يضمن أن جميع التقييمات حقيقية وموثوقة.'
            : 'Vous ne pouvez laisser un avis qu\'après la réalisation de la prestation (statut de réservation : terminé). Cela garantit que tous les avis sont authentiques et fiables.',
        },
      ],
    },
    {
      title: isRtl ? 'لمقدمي الخدمات' : 'Pour les Prestataires',
      faqs: [
        {
          q: isRtl ? 'كيف أسجل كمزود خدمة؟' : 'Comment m\'inscrire comme prestataire ?',
          a: isRtl 
            ? 'اضغط على "انضم كمزود خدمة" في الموقع، أدخل بياناتك التجارية (اسم النشاط، الولاية، الفئة) وستبدأ بخطة مجانية فوراً.'
            : 'Cliquez sur « Devenir Partenaire » sur le site, renseignez vos informations professionnelles (nom d\'activité, wilaya, catégorie) et vous démarrerez immédiatement avec le plan Gratuit.',
        },
        {
          q: isRtl ? 'كم عدد الخدمات التي يمكنني إضافتها؟' : 'Combien de services puis-je publier ?',
          a: isRtl 
            ? 'كل مزود يمكنه إنشاء إعلان خدمة واحد فقط. ركّز على جودة خدمتك وأضف صوراً احترافية لجذب المزيد من العملاء.'
            : 'Chaque prestataire peut créer une seule annonce de service. Concentrez-vous sur la qualité de votre offre et ajoutez des photos professionnelles pour attirer plus de clients.',
        },
        {
          q: isRtl ? 'كيف أرقّي اشتراكي؟' : 'Comment mettre à niveau mon abonnement ?',
          a: isRtl 
            ? 'اذهب إلى صفحة "الاشتراك" في لوحة التحكم، اختر الباقة المطلوبة (فضي، ذهبي، بلاتينيوم)، ادفع عبر CCP أو Baridimob، ثم ارفع صورة وصل الدفع. سيتم التفعيل خلال 24 ساعة.'
            : 'Rendez-vous sur la page « Abonnement » de votre espace, choisissez le plan souhaité (Argent, Or, Platine), payez par CCP ou Baridimob, puis importez le reçu de paiement. L\'activation se fait sous 24h.',
        },
        {
          q: isRtl ? 'ما فائدة الترقية إلى باقة أعلى؟' : 'Quels avantages offre un plan supérieur ?',
          a: isRtl 
            ? 'الباقات الأعلى تقدم: عدد صور أكثر، شارة مميزة على إعلانك، ترتيب أعلى في نتائج البحث، وترويج خاص. كلما كانت باقتك أعلى، زادت فرصتك في جذب العملاء.'
            : 'Les plans supérieurs offrent : plus de photos, un badge distinctif sur votre annonce, un meilleur classement dans les recherches, et une promotion spéciale. Plus votre plan est élevé, plus vous avez de chances d\'attirer des clients.',
        },
      ],
    },
    {
      title: isRtl ? 'الدفع والأمان' : 'Paiement & Sécurité',
      faqs: [
        {
          q: isRtl ? 'ما هي طرق الدفع المتاحة للمزودين؟' : 'Quels modes de paiement pour les prestataires ?',
          a: isRtl 
            ? 'حالياً ندعم الدفع عبر الحساب البريدي الجاري (CCP) و Baridimob. بعد التحويل، ارفع صورة الوصل من لوحة التحكم وسيتم التفعيل من طرف الإدارة.'
            : 'Actuellement, nous acceptons le paiement par CCP (compte courant postal) et Baridimob. Après le virement, importez le reçu depuis votre espace et l\'activation sera effectuée par l\'administration.',
        },
        {
          q: isRtl ? 'هل بياناتي الشخصية محمية؟' : 'Mes données personnelles sont-elles protégées ?',
          a: isRtl 
            ? 'نعم، نستخدم بروتوكولات أمان متقدمة لحماية بياناتك. كلمات المرور مشفرة ولا نشارك معلوماتك مع أطراف ثالثة.'
            : 'Oui, nous utilisons des protocoles de sécurité avancés pour protéger vos données. Les mots de passe sont chiffrés et nous ne partageons jamais vos informations avec des tiers.',
        },
      ],
    },
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="py-24 bg-gradient-to-b from-cream via-white to-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <HelpCircle size={16} />
            <span>{isRtl ? 'مركز المساعدة' : 'Centre d\'aide'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {isRtl ? 'الأسئلة الشائعة' : 'Questions Fréquentes'}
          </h1>
          <p className="text-lg text-brown">
            {isRtl 
              ? 'إجابات على أكثر الأسئلة شيوعاً حول استخدام منصة Wed in Click.'
              : 'Réponses aux questions les plus fréquentes sur l\'utilisation de la plateforme Wed in Click.'}
          </p>
        </div>
      </section>

      {/* FAQ Groups */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          {faqGroups.map((group, gi) => (
            <div key={gi}>
              <h2 className="text-2xl font-heading font-bold text-charcoal mb-6 pb-3 border-b-2 border-primary/20">
                {group.title}
              </h2>
              <div className="space-y-3">
                {group.faqs.map((faq, fi) => (
                  <AccordionItem key={fi} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still need help CTA */}
      <section className="py-16 bg-charcoal text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">
            {isRtl ? 'لم تجد إجابتك؟' : 'Vous n\'avez pas trouvé votre réponse ?'}
          </h2>
          <p className="text-gold-pale mb-8">
            {isRtl ? 'تواصل معنا مباشرة وسنجيبك في أقرب وقت.' : 'Contactez-nous directement et nous vous répondrons rapidement.'}
          </p>
          <Link href="/contact" className="btn-gold px-8 py-3 font-bold inline-block">
            {isRtl ? 'تواصل معنا' : 'Nous Contacter'}
          </Link>
        </div>
      </section>
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gold/10 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-cream/20 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-charcoal text-sm">{question}</span>
        <ChevronDown
          size={20}
          className={`text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5 text-sm text-brown leading-relaxed border-t border-gold/5">
          <div className="pt-4">{answer}</div>
        </div>
      </div>
    </div>
  );
}
