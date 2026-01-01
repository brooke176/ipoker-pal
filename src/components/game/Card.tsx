import { Card as CardType } from '@/types/game';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const suitColors = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-gray-900',
  spades: 'text-gray-900',
};

const sizes = {
  sm: 'w-12 h-16 text-xs',
  md: 'w-16 h-24 text-sm',
  lg: 'w-20 h-28 text-base',
};

export const Card = ({ card, faceDown = false, size = 'md', className }: CardProps) => {
  if (faceDown) {
    return (
      <div
        className={cn(
          'rounded-lg border-2 border-gray-300 shadow-lg flex items-center justify-center',
          'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900',
          'relative overflow-hidden',
          sizes[size],
          className
        )}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`
          }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border-2 border-gray-300 shadow-lg bg-white',
        'flex flex-col justify-between p-2',
        sizes[size],
        className
      )}
    >
      {/* Top rank and suit */}
      <div className={cn('font-bold leading-none', suitColors[card.suit])}>
        <div>{card.rank}</div>
        <div className="text-lg">{suitSymbols[card.suit]}</div>
      </div>

      {/* Center suit symbol */}
      <div className={cn('text-4xl text-center', suitColors[card.suit])}>
        {suitSymbols[card.suit]}
      </div>

      {/* Bottom rank and suit (rotated) */}
      <div className={cn('font-bold leading-none text-right transform rotate-180', suitColors[card.suit])}>
        <div>{card.rank}</div>
        <div className="text-lg">{suitSymbols[card.suit]}</div>
      </div>
    </div>
  );
};
