'use client';

import { useLocale } from 'next-intl';
import { Shield, Eye, Lock, Database, UserCheck, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const sections = [
    {
      icon: Database,
      title: isRtl ? 'البيانات التي نجمعها' : 'Données que nous collectons',
      content: isRtl 
        ? 'نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل: الاسم، البريد الإلكتروني، رقم الهاتف، والولاية. بالنسبة للمزودين، نجمع أيضاً: اسم النشاط التجاري، الفئة، العنوان، والصور المنشورة.'
        : 'Nous collectons les informations que vous nous fournissez directement lors de l\'inscription : nom, adresse e-mail, numéro de téléphone et wilaya. Pour les prestataires, nous collectons également : nom de l\'entreprise, catégorie, adresse et photos publiées.',
    },
    {
      icon: Eye,
      title: isRtl ? 'كيف نستخدم بياناتك' : 'Comment nous utilisons vos données',
      content: isRtl 
        ? 'نستخدم بياناتك لـ: تشغيل حسابك على المنصة، معالجة طلبات الحجز، عرض الخدمات في نتائج البحث، إرسال إشعارات متعلقة بحجوزاتك واشتراكاتك، وتحسين تجربة المستخدم.'
        : 'Nous utilisons vos données pour : faire fonctionner votre compte sur la plateforme, traiter les demandes de réservation, afficher les services dans les résultats de recherche, envoyer des notifications relatives à vos réservations et abonnements, et améliorer l\'expérience utilisateur.',
    },
    {
      icon: Lock,
      title: isRtl ? 'حماية البيانات' : 'Protection des données',
      content: isRtl 
        ? 'نستخدم تقنيات تشفير متقدمة لحماية بياناتك. كلمات المرور مشفرة بتقنية Bcrypt ولا يمكن قراءتها حتى من قبل فريقنا. نستخدم بروتوكول HTTPS لتأمين جميع الاتصالات. الوصول إلى قاعدة البيانات محدود ومراقب.'
        : 'Nous utilisons des technologies de chiffrement avancées pour protéger vos données. Les mots de passe sont chiffrés avec Bcrypt et sont illisibles même par notre équipe. Nous utilisons le protocole HTTPS pour sécuriser toutes les communications. L\'accès à la base de données est restreint et surveillé.',
    },
    {
      icon: UserCheck,
      title: isRtl ? 'مشاركة البيانات' : 'Partage des données',
      content: isRtl 
        ? 'لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة. يتم مشاركة المعلومات الضرورية فقط بين الزبون والمزود عند إتمام الحجز (مثل الاسم وتاريخ الحدث). نستخدم Cloudinary لتخزين الصور بشكل آمن.'
        : 'Nous ne vendons ni ne louons vos données personnelles à des tiers. Seules les informations nécessaires sont partagées entre le client et le prestataire lors d\'une réservation (comme le nom et la date de l\'événement). Nous utilisons Cloudinary pour stocker les images en toute sécurité.',
    },
    {
      icon: Trash2,
      title: isRtl ? 'حقوقك' : 'Vos droits',
      content: isRtl 
        ? 'لديك الحق في: الوصول إلى بياناتك الشخصية، تصحيح المعلومات غير الدقيقة، طلب حذف حسابك وبياناتك. لممارسة هذه الحقوق، تواصل معنا عبر contact@wedinclick.dz.'
        : 'Vous avez le droit de : accéder à vos données personnelles, rectifier les informations inexactes, demander la suppression de votre compte et de vos données. Pour exercer ces droits, contactez-nous à contact@wedinclick.dz.',
    },
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="py-24 bg-gradient-to-b from-cream via-white to-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <Shield size={16} />
            <span>{isRtl ? 'حماية بياناتك' : 'Protection de vos données'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {isRtl ? 'سياسة الخصوصية' : 'Politique de Confidentialité'}
          </h1>
          <p className="text-brown">
            {isRtl ? 'آخر تحديث: مايو 2026' : 'Dernière mise à jour : Mai 2026'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gold/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-lg font-heading font-bold text-charcoal pt-1.5">{section.title}</h2>
                </div>
                <p className="text-brown text-sm leading-relaxed">{section.content}</p>
              </div>
            );
          })}

          {/* Contact for Privacy */}
          <div className="bg-charcoal rounded-2xl p-8 text-center mt-8">
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {isRtl ? 'أسئلة حول الخصوصية؟' : 'Questions sur la confidentialité ?'}
            </h3>
            <p className="text-gold-pale text-sm mb-4">
              {isRtl ? 'تواصل معنا على' : 'Contactez-nous à'} <a href="mailto:contact@wedinclick.dz" className="text-primary hover:underline">contact@wedinclick.dz</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
