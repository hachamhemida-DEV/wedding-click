import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Readex_Pro, Playfair_Display } from 'next/font/google';
import '../globals.css';

const readexPro = Readex_Pro({
  subsets: ['latin', 'arabic'],
  variable: '--font-readex-pro',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  return {
    title: {
      default: 'Wed in Click — Luxury Wedding Services in Algeria',
      template: '%s | Wed in Click',
    },
    description: isRtl
      ? 'أول منصة جزائرية رقمية لتنظيم حفلات الأعراس. اكتشف قاعات، مصورين، طباخين وأفضل مزودي خدمات الأعراس.'
      : 'La première marketplace algérienne dédiée au mariage. Trouvez salles, photographes, traiteurs et les meilleurs prestataires.',
    keywords: ['mariage', 'Algérie', 'wedding', 'salle des fêtes', 'photographe', 'traiteur', 'Wed in Click', 'زواج', 'عرس', 'الجزائر'],
    openGraph: {
      title: 'Wed in Click',
      description: 'La marketplace premium du mariage en Algérie',
      siteName: 'Wed in Click',
      locale: locale === 'ar' ? 'ar_DZ' : 'fr_DZ',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import { ToastProvider } from '@/components/shared/ToastProvider';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Set text direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${readexPro.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans bg-background text-foreground flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <Navbar />
            <main className="flex-grow pt-24">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

