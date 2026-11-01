import { ChatInterface } from '@/components/shared/ChatInterface';

export default function VendorMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          Messages
        </h1>
        <p className="text-brown mt-1">
          Gérez vos communications avec vos clients.
        </p>
      </div>

      <ChatInterface basePath="/vendor/messages" />
    </div>
  );
}
