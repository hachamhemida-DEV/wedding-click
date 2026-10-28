import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Globe, Camera, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Index'); // Adjust namespace as needed
  const locale = useLocale();

  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 border-t-[4px] border-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <img src="/logo.jpg" alt="Wed in Click Logo" className="h-14 w-auto object-contain mb-6 rounded-lg" />
            <p className="text-gold-pale leading-relaxed">
              {locale === 'ar' 
                ? 'أول منصة رقمية جزائرية شاملة مخصصة لتنظيم حفلات الأعراس. اكتشف أجود مقدمي الخدمات لاحتفالك المثالي.'
                : 'La première plateforme numérique algérienne dédiée à l\'organisation de mariages. Découvrez les meilleurs prestataires pour votre célébration parfaite.'}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-semibold text-white mb-6">
              {locale === 'ar' ? 'روابط سريعة' : 'Liens Rapides'}
            </h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'من نحن' : 'À Propos'}</Link></li>
              <li><Link href="/search" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'تصفح الخدمات' : 'Découvrir les Services'}</Link></li>
              <li><Link href="/pricing" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'باقات المزودين' : 'Tarifs Prestataires'}</Link></li>
              <li><Link href="/faq" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</Link></li>
              <li><Link href="/contact" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'تواصل معنا' : 'Contact'}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-heading font-semibold text-white mb-6">
              {locale === 'ar' ? 'أقسام الخدمات' : 'Catégories'}
            </h4>
            <ul className="space-y-3">
              <li><Link href="/categories/halls" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'قاعات' : 'Salles des fêtes'}</Link></li>
              <li><Link href="/categories/photography" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'مصورين' : 'Photographie'}</Link></li>
              <li><Link href="/categories/catering" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'طباخين' : 'Traiteur'}</Link></li>
              <li><Link href="/categories/decoration" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'ديكور' : 'Décoration'}</Link></li>
              <li><Link href="/categories/cakes" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'كعك' : 'Gâteaux'}</Link></li>
              <li><Link href="/categories/jewelry" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'مجوهرات' : 'Bijoux'}</Link></li>
              <li><Link href="/categories/makeup" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'مكياج' : 'Maquillage'}</Link></li>
              <li><Link href="/categories/sweets" className="text-gold-pale hover:text-primary transition-colors">{locale === 'ar' ? 'حلويات' : 'Pâtisserie'}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-heading font-semibold text-white mb-6">
              {locale === 'ar' ? 'تواصل معنا' : 'Contactez-nous'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gold-pale">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{locale === 'ar' ? 'الجزائر العاصمة، الجزائر' : 'Alger, Algérie'}</span>
              </li>
              <li className="flex items-center gap-3 text-gold-pale">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr">+213 (0) 555 12 34 56</span>
              </li>
              <li className="flex items-center gap-3 text-gold-pale">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:contact@wedinclick.dz" className="hover:text-primary transition-colors">contact@wedinclick.dz</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold-pale/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gold-pale/60 text-sm">
            © {new Date().getFullYear()} Wed in Click. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
          </p>
          <div className="flex gap-6 text-sm text-gold-pale/60">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              {locale === 'ar' ? 'سياسة الخصوصية' : 'Politique de Confidentialité'}
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              {locale === 'ar' ? 'الشروط والأحكام' : 'Conditions d\'utilisation'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
