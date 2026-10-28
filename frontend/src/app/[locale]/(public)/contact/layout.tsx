import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe Wed in Click. Envoyez-nous vos questions, suggestions ou demandes de partenariat.',
  openGraph: {
    title: 'Contactez-nous — Wed in Click',
    description: 'Nous sommes là pour vous aider. Contactez l\'équipe Wed in Click.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
