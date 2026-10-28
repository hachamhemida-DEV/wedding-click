import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/shared/Hero';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('title'),
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}
