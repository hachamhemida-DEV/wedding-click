import { ReactNode } from 'react';
import { FileQuestion, SearchX, CalendarX, ListX } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface EmptyStateProps {
  icon?: 'search' | 'calendar' | 'list' | 'file';
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  actionCallback?: () => void;
  className?: string;
}

export function EmptyState({
  icon = 'file',
  title,
  description,
  actionText,
  actionHref,
  actionCallback,
  className = '',
}: EmptyStateProps) {
  const IconComponent = {
    search: SearchX,
    calendar: CalendarX,
    list: ListX,
    file: FileQuestion,
  }[icon];

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white border border-gold/10 rounded-2xl ${className}`}>
      <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-6 text-primary">
        <IconComponent size={32} />
      </div>
      <h3 className="text-xl font-heading font-bold text-charcoal mb-2">{title}</h3>
      <p className="text-brown text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionText && (
        actionHref ? (
          <Link href={actionHref} className="btn-gold px-6 py-2.5 text-sm font-bold">
            {actionText}
          </Link>
        ) : actionCallback ? (
          <button onClick={actionCallback} className="btn-gold px-6 py-2.5 text-sm font-bold">
            {actionText}
          </button>
        ) : null
      )}
    </div>
  );
}
