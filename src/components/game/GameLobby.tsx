import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameType } from '@/types/game';
import { Users, Play } from 'lucide-react';

interface GameLobbyProps {
  onCreateGame: (gameType: GameType, playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

export const GameLobby = ({ onCreateGame, onJoinGame }: GameLobbyProps) => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameType>('texas-holdem');

  const games = [
    { id: 'texas-holdem' as GameType, name: "Texas Hold'em", players: '2-8', icon: '♠' },
    { id: 'gin-rummy' as GameType, name: 'Gin Rummy', players: '2', icon: '♥' },
    { id: 'blackjack' as GameType, name: 'Blackjack', players: '2-6', icon: '♦' },
    { id: 'war' as GameType, name: 'War', players: '2', icon: '♣' },
  ];

  const handleCreateGame = () => {
    if (playerName.trim()) {
      onCreateGame(selectedGame, playerName);
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim() && gameId.trim()) {
      onJoinGame(gameId, playerName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">DeckDuel</h1>
          <p className="text-gray-400">Play cards with friends in iMessage</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Game</TabsTrigger>
            <TabsTrigger value="join">Join Game</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Game</CardTitle>
                <CardDescription>Start a new game and invite your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Your Name</Label>
                  <Input
                    id="create-name"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Select Game</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setSelectedGame(game.id)}
                        className={`
                          p-4 rounded-lg border-2 transition-all text-left
                          ${selectedGame === game.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{game.icon}</div>
                          <div>
                            <div className="font-semibold text-white">{game.name}</div>
                            <div className="text-xs text-gray-400">
                              <Users className="inline w-3 h-3 mr-1" />
                              {game.players}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateGame}
                  disabled={!playerName.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Create Game
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle>Join Existing Game</CardTitle>
                <CardDescription>Enter a game code to join your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="join-name">Your Name</Label>
                  <Input
                    id="join-name"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game-id">Game Code</Label>
                  <Input
                    id="game-id"
                    placeholder="Enter game code"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleJoinGame}
                  disabled={!playerName.trim() || !gameId.trim()}
                  className="w-full"
                  size="lg"
                >
                  Join Game
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};
