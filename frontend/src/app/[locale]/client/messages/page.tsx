import { ChatInterface } from '@/components/shared/ChatInterface';
import { useLocale } from 'next-intl';

export default function ClientMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          Messages
        </h1>
        <p className="text-brown mt-1">
          Communiquez avec vos prestataires pour l'organisation de votre mariage.
        </p>
      </div>

      <ChatInterface basePath="/client/messages" />
    </div>
  );
}
