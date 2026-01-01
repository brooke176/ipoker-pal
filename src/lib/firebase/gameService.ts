import { ref, set, onValue, update, push, remove, off } from 'firebase/database';
import { database } from './config';
import { GameState, GameAction } from '@/types/game';

/**
 * Creates a new game session in Firebase
 */
export async function createGameSession(gameState: GameState): Promise<string> {
  const gamesRef = ref(database, 'games');
  const newGameRef = push(gamesRef);
  
  await set(newGameRef, {
    ...gameState,
    id: newGameRef.key,
  });
  
  return newGameRef.key!;
}

/**
 * Updates game state in Firebase
 */
export async function updateGameState(gameId: string, updates: Partial<GameState>): Promise<void> {
  const gameRef = ref(database, `games/${gameId}`);
  await update(gameRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

/**
 * Subscribes to game state changes
 */
export function subscribeToGame(
  gameId: string,
  callback: (gameState: GameState | null) => void
): () => void {
  const gameRef = ref(database, `games/${gameId}`);
  
  onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(gameRef);
}

/**
 * Sends a game action
 */
export async function sendGameAction(gameId: string, action: GameAction): Promise<void> {
  const actionsRef = ref(database, `games/${gameId}/actions`);
  const newActionRef = push(actionsRef);
  
  await set(newActionRef, action);
}

/**
 * Subscribes to game actions
 */
export function subscribeToActions(
  gameId: string,
  callback: (action: GameAction) => void
): () => void {
  const actionsRef = ref(database, `games/${gameId}/actions`);
  
  onValue(actionsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const action = childSnapshot.val();
      callback(action);
    });
  });
  
  return () => off(actionsRef);
}

/**
 * Deletes a game session
 */
export async function deleteGame(gameId: string): Promise<void> {
  const gameRef = ref(database, `games/${gameId}`);
  await remove(gameRef);
}

/**
 * Adds a player to a game
 */
export async function joinGame(gameId: string, playerId: string, playerData: any): Promise<void> {
  const playerRef = ref(database, `games/${gameId}/players/${playerId}`);
  await set(playerRef, playerData);
}

/**
 * Removes a player from a game
 */
export async function leaveGame(gameId: string, playerId: string): Promise<void> {
  const playerRef = ref(database, `games/${gameId}/players/${playerId}`);
  await remove(playerRef);
}

/**
 * Updates player presence
 */
export async function updatePlayerPresence(
  gameId: string,
  playerId: string,
  isOnline: boolean
): Promise<void> {
  const presenceRef = ref(database, `games/${gameId}/presence/${playerId}`);
  await set(presenceRef, {
    isOnline,
    lastSeen: Date.now(),
  });
}

/**
 * Subscribes to player presence changes
 */
export function subscribeToPresence(
  gameId: string,
  callback: (presence: Record<string, { isOnline: boolean; lastSeen: number }>) => void
): () => void {
  const presenceRef = ref(database, `games/${gameId}/presence`);
  
  onValue(presenceRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  });
  
  return () => off(presenceRef);
}
