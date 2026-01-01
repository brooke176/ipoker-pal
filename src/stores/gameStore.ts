import { create } from 'zustand';
import { GameState, GameAction, Player } from '@/types/game';
import {
  createGameSession,
  updateGameState,
  subscribeToGame,
  sendGameAction,
  updatePlayerPresence,
  subscribeToPresence,
} from '@/lib/firebase/gameService';

interface GameStore {
  // Current game state
  currentGame: GameState | null;
  currentPlayerId: string | null;
  
  // Player presence
  playerPresence: Record<string, { isOnline: boolean; lastSeen: number }>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Subscriptions
  unsubscribeGame: (() => void) | null;
  unsubscribePresence: (() => void) | null;
  
  // Actions
  setCurrentPlayer: (playerId: string) => void;
  createGame: (gameState: GameState) => Promise<string>;
  joinGame: (gameId: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  performAction: (action: Omit<GameAction, 'playerId' | 'timestamp'>) => Promise<void>;
  updateGame: (updates: Partial<GameState>) => Promise<void>;
  setPlayerOnline: (isOnline: boolean) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: null,
  currentPlayerId: null,
  playerPresence: {},
  isLoading: false,
  error: null,
  unsubscribeGame: null,
  unsubscribePresence: null,

  setCurrentPlayer: (playerId: string) => {
    set({ currentPlayerId: playerId });
  },

  createGame: async (gameState: GameState) => {
    set({ isLoading: true, error: null });
    
    try {
      const gameId = await createGameSession(gameState);
      
      // Subscribe to game updates
      const unsubGame = subscribeToGame(gameId, (updatedState) => {
        set({ currentGame: updatedState });
      });
      
      // Subscribe to player presence
      const unsubPresence = subscribeToPresence(gameId, (presence) => {
        set({ playerPresence: presence });
      });
      
      set({
        unsubscribeGame: unsubGame,
        unsubscribePresence: unsubPresence,
        isLoading: false,
      });
      
      return gameId;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create game',
        isLoading: false,
      });
      throw error;
    }
  },

  joinGame: async (gameId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Subscribe to game updates
      const unsubGame = subscribeToGame(gameId, (updatedState) => {
        set({ currentGame: updatedState });
      });
      
      // Subscribe to player presence
      const unsubPresence = subscribeToPresence(gameId, (presence) => {
        set({ playerPresence: presence });
      });
      
      set({
        unsubscribeGame: unsubGame,
        unsubscribePresence: unsubPresence,
        isLoading: false,
      });
      
      // Set player as online
      const { currentPlayerId } = get();
      if (currentPlayerId) {
        await updatePlayerPresence(gameId, currentPlayerId, true);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to join game',
        isLoading: false,
      });
      throw error;
    }
  },

  leaveGame: async () => {
    const { currentGame, currentPlayerId, unsubscribeGame, unsubscribePresence } = get();
    
    if (currentGame && currentPlayerId) {
      try {
        // Set player as offline
        await updatePlayerPresence(currentGame.id, currentPlayerId, false);
      } catch (error) {
        console.error('Failed to update presence:', error);
      }
    }
    
    // Unsubscribe from listeners
    if (unsubscribeGame) unsubscribeGame();
    if (unsubscribePresence) unsubscribePresence();
    
    set({
      currentGame: null,
      playerPresence: {},
      unsubscribeGame: null,
      unsubscribePresence: null,
    });
  },

  performAction: async (action: Omit<GameAction, 'playerId' | 'timestamp'>) => {
    const { currentGame, currentPlayerId } = get();
    
    if (!currentGame || !currentPlayerId) {
      throw new Error('No active game or player');
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const fullAction: GameAction = {
        ...action,
        playerId: currentPlayerId,
        timestamp: Date.now(),
      };
      
      await sendGameAction(currentGame.id, fullAction);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to perform action',
        isLoading: false,
      });
      throw error;
    }
  },

  updateGame: async (updates: Partial<GameState>) => {
    const { currentGame } = get();
    
    if (!currentGame) {
      throw new Error('No active game');
    }
    
    set({ isLoading: true, error: null });
    
    try {
      await updateGameState(currentGame.id, updates);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update game',
        isLoading: false,
      });
      throw error;
    }
  },

  setPlayerOnline: async (isOnline: boolean) => {
    const { currentGame, currentPlayerId } = get();
    
    if (!currentGame || !currentPlayerId) {
      return;
    }
    
    try {
      await updatePlayerPresence(currentGame.id, currentPlayerId, isOnline);
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    const { unsubscribeGame, unsubscribePresence } = get();
    
    if (unsubscribeGame) unsubscribeGame();
    if (unsubscribePresence) unsubscribePresence();
    
    set({
      currentGame: null,
      currentPlayerId: null,
      playerPresence: {},
      isLoading: false,
      error: null,
      unsubscribeGame: null,
      unsubscribePresence: null,
    });
  },
}));
