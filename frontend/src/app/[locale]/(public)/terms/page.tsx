'use client';

import { useLocale } from 'next-intl';
import { Shield, Scale } from 'lucide-react';

export default function TermsPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const sections = isRtl ? [
    { title: '1. قبول الشروط', content: 'باستخدامك لمنصة Wed in Click، فأنت توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام المنصة.' },
    { title: '2. وصف الخدمة', content: 'Wed in Click هي منصة إلكترونية تربط العرسان بمقدمي خدمات الأعراس في الجزائر. المنصة ليست طرفاً في أي اتفاق بين الزبون والمزود، ولا تتحمل مسؤولية جودة الخدمات المقدمة من قبل المزودين.' },
    { title: '3. حسابات المستخدمين', content: 'يجب أن تقدم معلومات صحيحة ودقيقة عند التسجيل. أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك وعن جميع الأنشطة التي تتم تحت حسابك. يجب عليك إخطارنا فوراً عن أي استخدام غير مصرح به لحسابك.' },
    { title: '4. اشتراكات المزودين', content: 'توفر المنصة خطط اشتراك متعددة للمزودين (مجاني، فضي، ذهبي، بلاتينيوم). الدفع يتم عبر CCP أو Baridimob. الاشتراكات غير قابلة للاسترداد بعد التفعيل. مدة الاشتراك 12 شهراً من تاريخ التفعيل.' },
    { title: '5. المحتوى والصور', content: 'المزودون مسؤولون عن المحتوى والصور المنشورة على المنصة. يحظر نشر محتوى مضلل أو غير قانوني أو ينتهك حقوق الملكية الفكرية. تحتفظ المنصة بحق حذف أي محتوى مخالف.' },
    { title: '6. التقييمات والمراجعات', content: 'يمكن للزبائن تقييم المزودين فقط بعد إتمام الخدمة. يجب أن تكون التقييمات صادقة وموضوعية. تحتفظ المنصة بحق إزالة التقييمات المسيئة أو المضللة.' },
    { title: '7. الحجوزات', content: 'الحجوزات عبر المنصة هي طلبات أولية تحتاج لقبول المزود. المنصة لا تضمن توفر أي خدمة في تاريخ محدد. التفاصيل النهائية والأسعار يتم الاتفاق عليها مباشرة بين الزبون والمزود.' },
    { title: '8. تعديل الشروط', content: 'تحتفظ Wed in Click بحق تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بالتغييرات الجوهرية. استمرارك في استخدام المنصة بعد التعديل يعني قبولك للشروط الجديدة.' },
    { title: '9. القانون المعمول به', content: 'تخضع هذه الشروط للقانون الجزائري. أي نزاع ينشأ عن استخدام المنصة يخضع لاختصاص المحاكم الجزائرية.' },
  ] : [
    { title: '1. Acceptation des Conditions', content: 'En utilisant la plateforme Wed in Click, vous acceptez de vous conformer à ces conditions d\'utilisation. Si vous n\'êtes pas d\'accord avec une partie de ces conditions, veuillez ne pas utiliser la plateforme.' },
    { title: '2. Description du Service', content: 'Wed in Click est une plateforme en ligne qui connecte les futurs mariés avec des prestataires de services de mariage en Algérie. La plateforme n\'est pas partie aux accords entre le client et le prestataire, et ne saurait être tenue responsable de la qualité des services fournis par les prestataires.' },
    { title: '3. Comptes Utilisateurs', content: 'Vous devez fournir des informations véridiques et exactes lors de l\'inscription. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte. Vous devez nous notifier immédiatement de toute utilisation non autorisée de votre compte.' },
    { title: '4. Abonnements Prestataires', content: 'La plateforme propose plusieurs plans d\'abonnement pour les prestataires (Gratuit, Argent, Or, Platine). Le paiement s\'effectue par CCP ou Baridimob. Les abonnements ne sont pas remboursables après activation. La durée de l\'abonnement est de 12 mois à partir de la date d\'activation.' },
    { title: '5. Contenu et Images', content: 'Les prestataires sont responsables du contenu et des images publiés sur la plateforme. Il est interdit de publier du contenu trompeur, illégal ou portant atteinte aux droits de propriété intellectuelle. La plateforme se réserve le droit de supprimer tout contenu non conforme.' },
    { title: '6. Avis et Évaluations', content: 'Les clients peuvent évaluer les prestataires uniquement après la réalisation de la prestation. Les avis doivent être honnêtes et objectifs. La plateforme se réserve le droit de supprimer les avis abusifs ou trompeurs.' },
    { title: '7. Réservations', content: 'Les réservations via la plateforme sont des demandes préliminaires nécessitant l\'acceptation du prestataire. La plateforme ne garantit pas la disponibilité d\'un service à une date précise. Les détails finaux et les prix sont convenus directement entre le client et le prestataire.' },
    { title: '8. Modification des Conditions', content: 'Wed in Click se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des modifications substantielles. Votre utilisation continue de la plateforme après modification vaut acceptation des nouvelles conditions.' },
    { title: '9. Droit Applicable', content: 'Ces conditions sont régies par le droit algérien. Tout litige découlant de l\'utilisation de la plateforme relève de la compétence des tribunaux algériens.' },
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="py-24 bg-gradient-to-b from-cream via-white to-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <Scale size={16} />
            <span>{isRtl ? 'الإطار القانوني' : 'Cadre juridique'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {isRtl ? 'الشروط والأحكام' : 'Conditions d\'Utilisation'}
          </h1>
          <p className="text-brown">
            {isRtl ? 'آخر تحديث: مايو 2026' : 'Dernière mise à jour : Mai 2026'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gold/10">
              <h2 className="text-lg font-heading font-bold text-charcoal mb-3">{section.title}</h2>
              <p className="text-brown text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
