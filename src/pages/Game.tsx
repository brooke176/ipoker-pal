import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import { GameLobby } from '@/components/game/GameLobby';
import { PokerTable } from '@/components/game/PokerTable';
import { createTexasHoldemGame, startTexasHoldem, processTexasHoldemAction } from '@/lib/game/texasHoldem';
import { GameType, TexasHoldemState, GamePlayer } from '@/types/game';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Copy, LogOut, Share2 } from 'lucide-react';

// Check if running in iMessage
declare global {
  interface Window {
    isIMessage?: boolean;
    iMessageGameId?: string;
    iMessagePresentationStyle?: 'compact' | 'expanded';
    webkit?: {
      messageHandlers?: {
        deckduel?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

const Game = () => {
  const [searchParams] = useSearchParams();
  const gameIdFromUrl = searchParams.get('gameId');

  const {
    currentGame,
    currentPlayerId,
    setCurrentPlayer,
    createGame,
    joinGame,
    performAction,
    leaveGame,
    updateGame,
  } = useGameStore();

  const [isInLobby, setIsInLobby] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [isIMessage, setIsIMessage] = useState(false);

  useEffect(() => {
    // Check if running in iMessage
    setIsIMessage(!!window.isIMessage);

    // Listen for messages from native iMessage extension
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'joinGame' && event.data.gameId) {
        const playerName = prompt('Enter your name to join the game:');
        if (playerName) {
          handleJoinGame(event.data.gameId, playerName);
        }
      } else if (event.data.type === 'presentationStyleChanged') {
        console.log('Presentation style:', event.data.style);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    // Auto-join if game ID in URL or from iMessage
    const gameId = gameIdFromUrl || window.iMessageGameId;
    if (gameId && !currentGame) {
      // Auto-generate player name for iMessage, or prompt for web
      let playerName: string | null;

      if (window.isIMessage) {
        // Auto-generate name for iMessage users
        playerName = `Player ${Math.floor(Math.random() * 1000)}`;
      } else {
        // Prompt for web users
        playerName = prompt('Enter your name to join the game:');
      }

      if (playerName) {
        handleJoinGame(gameId, playerName);
      }
    }
  }, [gameIdFromUrl, currentGame]);

  useEffect(() => {
    // Set game as started if status is active
    if (currentGame?.status === 'active') {
      setGameStarted(true);
      setIsInLobby(false);
    }
  }, [currentGame?.status]);

  const handleCreateGame = async (gameType: GameType, playerName: string) => {
    try {
      // Generate player ID
      const playerId = `player-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setCurrentPlayer(playerId);

      // For now, only Texas Hold'em is fully implemented
      if (gameType === 'texas-holdem') {
        const newGame = createTexasHoldemGame(
          `game-${Date.now()}`,
          [
            {
              id: playerId,
              name: playerName,
              isHost: true,
              joinedAt: Date.now(),
            },
          ]
        );

        const gameId = await createGame(newGame);
        setIsInLobby(false);

        // Copy game ID to clipboard for sharing
        const gameUrl = `${window.location.origin}${window.location.pathname}?gameId=${gameId}`;
        await navigator.clipboard.writeText(gameUrl);
        toast.success('Game created! Link copied to clipboard.');
      } else {
        toast.error('This game type is not yet implemented.');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
    }
  };

  const handleJoinGame = async (gameId: string, playerName: string) => {
    try {
      const playerId = `player-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setCurrentPlayer(playerId);

      // First, join/load the game
      await joinGame(gameId);

      // Wait a moment for game to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the current game state
      const game = useGameStore.getState().currentGame;
      if (!game) {
        throw new Error('Game not found');
      }

      // Check if player already exists
      const existingPlayer = game.players.find(p => p.id === playerId);
      if (!existingPlayer) {
        // Add player to the game with required GamePlayer properties
        const newPlayer: GamePlayer = {
          id: playerId,
          name: playerName,
          isHost: false,
          joinedAt: Date.now(),
          hand: [],
          status: 'active',
          position: game.players.length,
          chips: game.type === 'texas-holdem' ? 1000 : undefined,
          bet: game.type === 'texas-holdem' ? 0 : undefined,
        };

        await updateGame({
          players: [...game.players, newPlayer],
        });
      }

      setIsInLobby(false);
      toast.success(`Joined game as ${playerName}!`);
    } catch (error) {
      console.error('Error joining game:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to join game: ${errorMessage}`);
    }
  };

  const handleStartGame = async () => {
    if (!currentGame || currentGame.type !== 'texas-holdem') {
      return;
    }

    try {
      const startedGame = startTexasHoldem(currentGame as TexasHoldemState);
      await updateGame(startedGame);
      setGameStarted(true);
      toast.success('Game started!');
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start game');
    }
  };

  const handleAction = async (action: { type: string; amount?: number }) => {
    if (!currentGame || !currentPlayerId) {
      return;
    }

    try {
      await performAction(action as any);
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to perform action');
    }
  };

  const handleLeaveGame = async () => {
    await leaveGame();
    setIsInLobby(true);
    setGameStarted(false);
    toast.success('Left game');
  };

  const copyGameLink = async () => {
    if (currentGame) {
      const gameUrl = `${window.location.origin}${window.location.pathname}?gameId=${currentGame.id}`;
      await navigator.clipboard.writeText(gameUrl);
      toast.success('Game link copied!');
    }
  };

  const shareGameViaIMessage = () => {
    if (currentGame && window.webkit?.messageHandlers?.deckduel) {
      // Send message to native iMessage extension
      window.webkit.messageHandlers.deckduel.postMessage({
        action: 'shareGame',
        gameId: currentGame.id,
      });
      toast.success('Sharing via iMessage...');
    } else {
      // Fallback to copying link
      copyGameLink();
    }
  };

  const expandIMessageView = () => {
    if (window.webkit?.messageHandlers?.deckduel) {
      window.webkit.messageHandlers.deckduel.postMessage({
        action: 'expandView',
      });
    }
  };

  if (isInLobby) {
    return <GameLobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />;
  }

  if (!currentGame || !currentPlayerId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading game...</p>
      </div>
    );
  }

  // Waiting room (before game starts)
  if (!gameStarted && currentGame.status === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Waiting for Players</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Share this game with your friends:</p>
              <div className="flex gap-2">
                {isIMessage ? (
                  <Button onClick={shareGameViaIMessage} className="flex-1" size="lg">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share in iMessage
                  </Button>
                ) : (
                  <>
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}${window.location.pathname}?gameId=${currentGame.id}`}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                    />
                    <Button onClick={copyGameLink} size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Players ({currentGame.players.length}):</h3>
              <div className="space-y-2">
                {currentGame.players.map((player) => (
                  <div key={player.id} className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white">{player.name}</span>
                    {player.isHost && (
                      <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">Host</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {currentGame.players.find(p => p.id === currentPlayerId)?.isHost && (
              <Button
                onClick={handleStartGame}
                disabled={currentGame.players.length < 2}
                className="flex-1"
                size="lg"
              >
                Start Game
              </Button>
            )}
            <Button onClick={handleLeaveGame} variant="outline" size="lg">
              <LogOut className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active game
  if (currentGame.type === 'texas-holdem' && gameStarted) {
    const isMyTurn = currentGame.players[currentGame.currentPlayerIndex]?.id === currentPlayerId;

    return (
      <>
        <PokerTable
          gameState={currentGame as TexasHoldemState}
          currentPlayerId={currentPlayerId}
          onAction={handleAction}
          isMyTurn={isMyTurn}
        />
        <Button
          onClick={handleLeaveGame}
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 z-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Leave
        </Button>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white">Game type not supported yet</p>
    </div>
  );
};

export default Game;
