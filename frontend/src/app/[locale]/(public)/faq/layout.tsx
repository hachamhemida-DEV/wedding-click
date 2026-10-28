import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Réponses aux questions fréquentes sur Wed in Click : réservation, abonnement prestataire, paiement CCP/Baridimob et sécurité.',
  openGraph: {
    title: 'FAQ — Wed in Click',
    description: 'Trouvez les réponses à vos questions sur la marketplace du mariage en Algérie.',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
