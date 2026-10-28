'use client';

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gold/10 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-gray-200 rounded-full" />
          <div className="w-12 h-4 bg-gray-100 rounded-full" />
        </div>
        <div className="w-3/4 h-5 bg-gray-200 rounded" />
        <div className="w-full h-3 bg-gray-100 rounded" />
        <div className="w-2/3 h-3 bg-gray-100 rounded" />
        <div className="flex justify-between pt-2">
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-24 h-6 bg-primary/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gold/10 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="w-20 h-3 bg-gray-200 rounded" />
          <div className="w-16 h-6 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function BookingRowSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gold/10 p-5 animate-pulse flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-48 h-4 bg-gray-200 rounded" />
        <div className="w-32 h-3 bg-gray-100 rounded" />
      </div>
      <div className="w-20 h-7 bg-gray-200 rounded-full" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className={`h-4 bg-gray-200 rounded ${i === 0 ? 'w-32' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="w-48 h-8 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <DashboardCardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <BookingRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
