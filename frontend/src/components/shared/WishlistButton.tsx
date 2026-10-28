'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Props {
  serviceId: number;
  className?: string;
  size?: number;
}

export function WishlistButton({ serviceId, className = '', size = 20 }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'client') {
      api.get(`/wishlist/check/${serviceId}`)
        .then(res => setWishlisted(res.data.wishlisted))
        .catch(() => {});
    }
  }, [serviceId, isAuthenticated, user]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation when inside a card
    e.stopPropagation();

    if (!isAuthenticated || user?.role !== 'client') return;
    
    // Optimistic update
    setWishlisted(!wishlisted);
    setLoading(true);

    try {
      const res = await api.post(`/wishlist/${serviceId}`);
      setWishlisted(res.data.wishlisted);
    } catch {
      setWishlisted(wishlisted); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'client') return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`transition-all duration-300 ${className}`}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          wishlisted 
            ? 'fill-red-500 text-red-500 scale-110' 
            : 'fill-transparent text-white hover:text-red-400'
        }`}
      />
    </button>
  );
}
