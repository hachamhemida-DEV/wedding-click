'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
  rating: number; // 0 to 5
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: number;
  className?: string;
}

export function StarRating({ rating, interactive = false, onRatingChange, size = 16, className = '' }: Props) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : 'button'}
          disabled={!interactive}
          onClick={() => {
            if (interactive && onRatingChange) onRatingChange(star);
          }}
          onMouseEnter={() => {
            if (interactive) setHoverRating(star);
          }}
          onMouseLeave={() => {
            if (interactive) setHoverRating(0);
          }}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={`${
              star <= displayRating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
