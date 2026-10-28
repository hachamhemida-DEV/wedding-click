import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarifs Prestataires',
  description: 'Découvrez nos plans d\'abonnement pour les prestataires de mariage en Algérie : Gratuit, Argent, Or et Platine.',
  openGraph: {
    title: 'Tarifs — Wed in Click',
    description: 'Plans d\'abonnement clairs et sans frais cachés pour les prestataires de mariage.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
