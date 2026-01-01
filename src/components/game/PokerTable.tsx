import { motion, AnimatePresence } from 'framer-motion';
import { TexasHoldemState } from '@/types/game';
import { Card } from './Card';
import { PlayerSeat } from './PlayerSeat';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface PokerTableProps {
  gameState: TexasHoldemState;
  currentPlayerId: string;
  onAction: (action: { type: string; amount?: number }) => void;
  isMyTurn: boolean;
}

export const PokerTable = ({ gameState, currentPlayerId, onAction, isMyTurn }: PokerTableProps) => {
  const [raiseAmount, setRaiseAmount] = useState(gameState.currentBet * 2);
  
  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const maxRaise = currentPlayer?.chips || 0;
  
  const canCheck = currentPlayer?.bet === gameState.currentBet;
  const canCall = currentPlayer && currentPlayer.bet < gameState.currentBet && currentPlayer.chips > 0;
  const callAmount = canCall ? gameState.currentBet - currentPlayer.bet : 0;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-hidden">
      {/* Poker table felt */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[90%] h-[70%] max-w-5xl">
          {/* Table oval */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-700 to-green-800 border-8 border-amber-900 shadow-2xl" />
          
          {/* Inner felt */}
          <div className="absolute inset-8 rounded-full bg-green-800 border-4 border-green-900" />
          
          {/* Community cards area */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-4">
            <AnimatePresence>
              {gameState.communityCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card card={card} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Pot */}
          {gameState.pot > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-amber-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg"
            >
              Pot: ${gameState.pot}
            </motion.div>
          )}
          
          {/* Player seats */}
          {gameState.players.map((player, index) => {
            const angle = (index / gameState.players.length) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + 45 * Math.cos(angle);
            const y = 50 + 35 * Math.sin(angle);
            
            return (
              <div
                key={player.id}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <PlayerSeat
                  player={player}
                  isCurrentPlayer={gameState.players[gameState.currentPlayerIndex].id === player.id}
                  isDealer={gameState.dealerIndex === index}
                  isMe={player.id === currentPlayerId}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Action panel */}
      {isMyTurn && currentPlayer?.status === 'active' && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                     bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-700"
        >
          <div className="space-y-4 min-w-[400px]">
            <div className="text-center text-white mb-4">
              <p className="text-sm text-gray-400">Your Turn</p>
              <p className="text-xl font-bold">Current Bet: ${gameState.currentBet}</p>
              <p className="text-sm text-gray-400">Your Chips: ${currentPlayer.chips}</p>
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                variant="destructive"
                onClick={() => onAction({ type: 'fold' })}
                className="px-6"
              >
                Fold
              </Button>
              
              {canCheck && (
                <Button
                  variant="default"
                  onClick={() => onAction({ type: 'check' })}
                  className="px-6"
                >
                  Check
                </Button>
              )}
              
              {canCall && (
                <Button
                  variant="default"
                  onClick={() => onAction({ type: 'call' })}
                  className="px-6"
                >
                  Call ${callAmount}
                </Button>
              )}
              
              <Button
                variant="gold"
                onClick={() => onAction({ type: 'raise', amount: raiseAmount })}
                disabled={raiseAmount > maxRaise}
                className="px-6"
              >
                Raise ${raiseAmount}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onAction({ type: 'all-in' })}
                className="px-6"
              >
                All In ${currentPlayer.chips}
              </Button>
            </div>
            
            {/* Raise slider */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Raise Amount:</label>
              <Slider
                value={[raiseAmount]}
                onValueChange={(values) => setRaiseAmount(values[0])}
                min={gameState.currentBet * 2}
                max={maxRaise + (currentPlayer.bet || 0)}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Round indicator */}
      <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-gray-700">
        {gameState.round.replace('-', ' ').toUpperCase()}
      </div>
    </div>
  );
};
