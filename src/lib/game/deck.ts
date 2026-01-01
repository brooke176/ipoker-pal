import { Card, Suit, Rank } from '@/types/game';

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/**
 * Creates a standard 52-card deck
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        id: `${rank}-${suit}`
      });
    }
  }
  
  return deck;
}

/**
 * Shuffles a deck using Fisher-Yates algorithm with crypto random
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Use crypto for better randomness (important for fairness)
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const j = randomArray[0] % (i + 1);
    
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Deals cards from the deck
 */
export function dealCards(deck: Card[], count: number): { dealt: Card[], remaining: Card[] } {
  const dealt = deck.slice(0, count);
  const remaining = deck.slice(count);
  
  return { dealt, remaining };
}

/**
 * Gets the numeric value of a card (for games like Blackjack)
 * Returns array for Ace (can be 1 or 11)
 */
export function getCardValue(card: Card): number[] {
  const { rank } = card;
  
  if (rank === 'A') {
    return [1, 11];
  } else if (['J', 'Q', 'K'].includes(rank)) {
    return [10];
  } else {
    return [parseInt(rank)];
  }
}

/**
 * Gets the rank value for poker comparison (2=2, 3=3... J=11, Q=12, K=13, A=14)
 */
export function getPokerRankValue(rank: Rank): number {
  const rankValues: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return rankValues[rank];
}

/**
 * Calculates all possible hand values (for Blackjack with Aces)
 */
export function calculateHandValues(cards: Card[]): number[] {
  let values = [0];
  
  for (const card of cards) {
    const cardValues = getCardValue(card);
    const newValues: number[] = [];
    
    for (const existingValue of values) {
      for (const cardValue of cardValues) {
        const sum = existingValue + cardValue;
        if (sum <= 21 && !newValues.includes(sum)) {
          newValues.push(sum);
        } else if (sum > 21 && !newValues.some(v => v > 21)) {
          newValues.push(sum);
        }
      }
    }
    
    values = newValues;
  }
  
  return values.sort((a, b) => b - a); // Sort descending (prefer higher valid values)
}

/**
 * Gets the best valid hand value (under or equal to 21), or bust value
 */
export function getBestHandValue(cards: Card[]): number {
  const values = calculateHandValues(cards);
  const validValues = values.filter(v => v <= 21);
  return validValues.length > 0 ? Math.max(...validValues) : Math.min(...values);
}

/**
 * Checks if a hand is a blackjack (21 with 2 cards)
 */
export function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && getBestHandValue(cards) === 21;
}

/**
 * Checks if a hand is busted
 */
export function isBusted(cards: Card[]): boolean {
  return calculateHandValues(cards).every(v => v > 21);
}
