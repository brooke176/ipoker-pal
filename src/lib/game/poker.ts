import { Card, Rank } from '@/types/game';
import { getPokerRankValue } from './deck';

export type PokerHandRank = 
  | 'royal-flush'
  | 'straight-flush'
  | 'four-of-a-kind'
  | 'full-house'
  | 'flush'
  | 'straight'
  | 'three-of-a-kind'
  | 'two-pair'
  | 'pair'
  | 'high-card';

export interface PokerHand {
  rank: PokerHandRank;
  value: number; // For comparison
  cards: Card[];
  description: string;
}

const handRankValues: Record<PokerHandRank, number> = {
  'royal-flush': 10,
  'straight-flush': 9,
  'four-of-a-kind': 8,
  'full-house': 7,
  'flush': 6,
  'straight': 5,
  'three-of-a-kind': 4,
  'two-pair': 3,
  'pair': 2,
  'high-card': 1,
};

/**
 * Evaluates the best 5-card poker hand from given cards
 */
export function evaluatePokerHand(cards: Card[]): PokerHand {
  if (cards.length < 5) {
    throw new Error('Need at least 5 cards to evaluate poker hand');
  }

  // Generate all possible 5-card combinations
  const combinations = cards.length === 5 
    ? [cards] 
    : getCombinations(cards, 5);

  // Evaluate each combination and return the best
  let bestHand: PokerHand | null = null;

  for (const combo of combinations) {
    const hand = evaluateFiveCardHand(combo);
    if (!bestHand || compareHands(hand, bestHand) > 0) {
      bestHand = hand;
    }
  }

  return bestHand!;
}

/**
 * Evaluates a specific 5-card hand
 */
function evaluateFiveCardHand(cards: Card[]): PokerHand {
  const sortedCards = [...cards].sort((a, b) => 
    getPokerRankValue(b.rank) - getPokerRankValue(a.rank)
  );

  const isFlush = checkFlush(sortedCards);
  const straight = checkStraight(sortedCards);
  const rankCounts = getRankCounts(sortedCards);

  // Royal Flush
  if (isFlush && straight && sortedCards[0].rank === 'A' && sortedCards[1].rank === 'K') {
    return {
      rank: 'royal-flush',
      value: handRankValues['royal-flush'] * 1000000,
      cards: sortedCards,
      description: 'Royal Flush'
    };
  }

  // Straight Flush
  if (isFlush && straight) {
    return {
      rank: 'straight-flush',
      value: handRankValues['straight-flush'] * 1000000 + getPokerRankValue(sortedCards[0].rank),
      cards: sortedCards,
      description: `Straight Flush, ${sortedCards[0].rank} high`
    };
  }

  // Four of a Kind
  if (rankCounts.some(c => c.count === 4)) {
    const fourKind = rankCounts.find(c => c.count === 4)!;
    return {
      rank: 'four-of-a-kind',
      value: handRankValues['four-of-a-kind'] * 1000000 + getPokerRankValue(fourKind.rank) * 100,
      cards: sortedCards,
      description: `Four ${fourKind.rank}s`
    };
  }

  // Full House
  const threeKind = rankCounts.find(c => c.count === 3);
  const pair = rankCounts.find(c => c.count === 2);
  if (threeKind && pair) {
    return {
      rank: 'full-house',
      value: handRankValues['full-house'] * 1000000 + getPokerRankValue(threeKind.rank) * 100 + getPokerRankValue(pair.rank),
      cards: sortedCards,
      description: `Full House, ${threeKind.rank}s over ${pair.rank}s`
    };
  }

  // Flush
  if (isFlush) {
    const value = handRankValues['flush'] * 1000000 + 
      sortedCards.reduce((sum, card, i) => sum + getPokerRankValue(card.rank) * Math.pow(100, 4 - i), 0);
    return {
      rank: 'flush',
      value,
      cards: sortedCards,
      description: `Flush, ${sortedCards[0].rank} high`
    };
  }

  // Straight
  if (straight) {
    return {
      rank: 'straight',
      value: handRankValues['straight'] * 1000000 + getPokerRankValue(sortedCards[0].rank),
      cards: sortedCards,
      description: `Straight, ${sortedCards[0].rank} high`
    };
  }

  // Three of a Kind
  if (threeKind) {
    return {
      rank: 'three-of-a-kind',
      value: handRankValues['three-of-a-kind'] * 1000000 + getPokerRankValue(threeKind.rank) * 100,
      cards: sortedCards,
      description: `Three ${threeKind.rank}s`
    };
  }

  // Two Pair
  const pairs = rankCounts.filter(c => c.count === 2);
  if (pairs.length >= 2) {
    const [pair1, pair2] = pairs.sort((a, b) => getPokerRankValue(b.rank) - getPokerRankValue(a.rank));
    return {
      rank: 'two-pair',
      value: handRankValues['two-pair'] * 1000000 + getPokerRankValue(pair1.rank) * 100 + getPokerRankValue(pair2.rank),
      cards: sortedCards,
      description: `Two Pair, ${pair1.rank}s and ${pair2.rank}s`
    };
  }

  // One Pair
  if (pair) {
    return {
      rank: 'pair',
      value: handRankValues['pair'] * 1000000 + getPokerRankValue(pair.rank) * 100,
      cards: sortedCards,
      description: `Pair of ${pair.rank}s`
    };
  }

  // High Card
  const value = handRankValues['high-card'] * 1000000 +
    sortedCards.reduce((sum, card, i) => sum + getPokerRankValue(card.rank) * Math.pow(100, 4 - i), 0);
  return {
    rank: 'high-card',
    value,
    cards: sortedCards,
    description: `High Card ${sortedCards[0].rank}`
  };
}

/**
 * Checks if all cards are the same suit
 */
function checkFlush(cards: Card[]): boolean {
  return cards.every(card => card.suit === cards[0].suit);
}

/**
 * Checks if cards form a straight
 */
function checkStraight(cards: Card[]): boolean {
  const values = cards.map(c => getPokerRankValue(c.rank));
  
  // Check regular straight
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] - values[i + 1] !== 1) {
      // Check for A-2-3-4-5 (wheel)
      if (i === 0 && values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
        return true;
      }
      return false;
    }
  }
  
  return true;
}

/**
 * Gets count of each rank
 */
function getRankCounts(cards: Card[]): { rank: Rank; count: number }[] {
  const counts = new Map<Rank, number>();
  
  for (const card of cards) {
    counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
  }
  
  return Array.from(counts.entries())
    .map(([rank, count]) => ({ rank, count }))
    .sort((a, b) => b.count - a.count || getPokerRankValue(b.rank) - getPokerRankValue(a.rank));
}

/**
 * Compares two poker hands. Returns positive if hand1 is better, negative if hand2 is better, 0 if equal
 */
export function compareHands(hand1: PokerHand, hand2: PokerHand): number {
  return hand1.value - hand2.value;
}

/**
 * Gets all combinations of size k from array
 */
function getCombinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > array.length) return [];
  
  const result: T[][] = [];
  
  function combine(start: number, current: T[]) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i <= array.length - (k - current.length); i++) {
      current.push(array[i]);
      combine(i + 1, current);
      current.pop();
    }
  }
  
  combine(0, []);
  return result;
}
