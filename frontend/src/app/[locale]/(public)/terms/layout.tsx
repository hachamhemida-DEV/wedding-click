import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'Utilisation',
  description: 'Conditions générales d\'utilisation de la plateforme Wed in Click. Règles de réservation, abonnements, avis et droit applicable.',
  openGraph: {
    title: 'Conditions d\'Utilisation — Wed in Click',
    description: 'Cadre juridique d\'utilisation de la marketplace du mariage algérienne.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
