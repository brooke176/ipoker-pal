import { motion } from 'framer-motion';
import { GamePlayer } from '@/types/game';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PlayerSeatProps {
  player: GamePlayer;
  isCurrentPlayer: boolean;
  isDealer: boolean;
  isMe: boolean;
}

export const PlayerSeat = ({ player, isCurrentPlayer, isDealer, isMe }: PlayerSeatProps) => {
  const getStatusColor = () => {
    switch (player.status) {
      case 'active':
        return 'border-green-500';
      case 'folded':
        return 'border-gray-500 opacity-50';
      case 'all-in':
        return 'border-yellow-500';
      case 'disconnected':
        return 'border-red-500 opacity-50';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <motion.div
      animate={isCurrentPlayer ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, repeat: isCurrentPlayer ? Infinity : 0 }}
      className="relative"
    >
      {/* Dealer button */}
      {isDealer && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center 
                        font-bold text-xs border-2 border-amber-500 shadow-lg z-10">
          D
        </div>
      )}

      {/* Player info card */}
      <div
        className={cn(
          'bg-gray-900/95 backdrop-blur-sm rounded-xl p-3 border-2 shadow-xl min-w-[140px]',
          getStatusColor(),
          isCurrentPlayer && 'ring-4 ring-blue-500 ring-opacity-50'
        )}
      >
        {/* Avatar and name */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {player.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={cn('text-white font-semibold truncate text-sm', isMe && 'text-yellow-400')}>
              {player.name} {isMe && '(You)'}
            </p>
            <p className="text-gray-400 text-xs">${player.chips}</p>
          </div>
        </div>

        {/* Cards */}
        {player.hand.length > 0 && (
          <div className="flex gap-1 mb-2">
            {player.hand.map((card, index) => (
              <Card
                key={index}
                card={card}
                faceDown={!isMe}
                size="sm"
              />
            ))}
          </div>
        )}

        {/* Current bet */}
        {player.bet && player.bet > 0 && (
          <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full text-center">
            Bet: ${player.bet}
          </div>
        )}

        {/* Status indicator */}
        {player.status !== 'active' && (
          <div className="text-xs text-gray-400 text-center mt-1 capitalize">
            {player.status}
          </div>
        )}
      </div>
    </motion.div>
  );
};
