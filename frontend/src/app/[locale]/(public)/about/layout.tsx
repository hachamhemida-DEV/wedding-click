import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À Propos',
  description: 'Découvrez Wed in Click, la première marketplace algérienne dédiée au mariage. Notre mission, comment ça marche, et pourquoi nous choisir.',
  openGraph: {
    title: 'À Propos — Wed in Click',
    description: 'La première plateforme numérique algérienne dédiée à l\'organisation de mariages.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
