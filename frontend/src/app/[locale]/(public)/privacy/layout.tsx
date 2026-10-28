import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité de Wed in Click. Comment nous collectons, utilisons et protégeons vos données personnelles.',
  openGraph: {
    title: 'Politique de Confidentialité — Wed in Click',
    description: 'Protection des données personnelles sur la marketplace du mariage algérienne.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
