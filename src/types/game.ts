export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export type GameType = 'texas-holdem' | 'gin-rummy' | 'blackjack' | 'war' | 'go-fish' | 'crazy-eights';

export type GameStatus = 'waiting' | 'active' | 'completed' | 'cancelled';

export type PlayerStatus = 'active' | 'folded' | 'all-in' | 'disconnected';

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  joinedAt: number;
}

export interface GamePlayer extends Player {
  hand: Card[];
  chips?: number; // For poker games
  bet?: number; // Current bet in poker
  status: PlayerStatus;
  position: number;
}

export interface BaseGameState {
  id: string;
  type: GameType;
  status: GameStatus;
  players: GamePlayer[];
  currentPlayerIndex: number;
  deck: Card[];
  discardPile: Card[];
  createdAt: number;
  updatedAt: number;
  hostId: string;
}

// Texas Hold'em specific state
export interface TexasHoldemState extends BaseGameState {
  type: 'texas-holdem';
  communityCards: Card[];
  pot: number;
  currentBet: number;
  dealerIndex: number;
  smallBlindIndex: number;
  bigBlindIndex: number;
  round: 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';
  smallBlind: number;
  bigBlind: number;
}

// Gin Rummy specific state
export interface GinRummyState extends BaseGameState {
  type: 'gin-rummy';
  knocker?: string;
  deadwood?: Record<string, number>;
}

// Blackjack specific state
export interface BlackjackState extends BaseGameState {
  type: 'blackjack';
  dealerHand: Card[];
  dealerRevealed: boolean;
  currentHandValues: Record<string, number[]>;
}

export type GameState = TexasHoldemState | GinRummyState | BlackjackState | BaseGameState;

export interface GameAction {
  type: 'deal' | 'draw' | 'discard' | 'bet' | 'call' | 'raise' | 'fold' | 'check' | 'all-in' | 'knock' | 'gin' | 'hit' | 'stand' | 'double-down' | 'split';
  playerId: string;
  amount?: number;
  card?: Card;
  cards?: Card[];
  timestamp: number;
}

export interface GameSession {
  gameState: GameState;
  history: GameAction[];
  messageId?: string; // For iMessage integration
}
