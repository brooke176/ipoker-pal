import { TexasHoldemState, GamePlayer, GameAction } from '@/types/game';
import { createDeck, shuffleDeck, dealCards } from './deck';
import { evaluatePokerHand, compareHands } from './poker';

/**
 * Creates a new Texas Hold'em game
 */
export function createTexasHoldemGame(
  gameId: string,
  players: Omit<GamePlayer, 'hand' | 'chips' | 'bet' | 'status' | 'position'>[],
  options: {
    smallBlind?: number;
    bigBlind?: number;
    startingChips?: number;
  } = {}
): TexasHoldemState {
  const { smallBlind = 10, bigBlind = 20, startingChips = 1000 } = options;

  // Allow creating with 1 player (host waits for others to join)
  if (players.length < 1 || players.length > 8) {
    throw new Error('Texas Hold\'em supports 1-8 players');
  }

  const gamePlayers: GamePlayer[] = players.map((player, index) => ({
    ...player,
    hand: [],
    chips: startingChips,
    bet: 0,
    status: 'active',
    position: index,
  }));

  const deck = shuffleDeck(createDeck());

  return {
    id: gameId,
    type: 'texas-holdem',
    status: 'waiting',
    players: gamePlayers,
    currentPlayerIndex: 0,
    deck,
    discardPile: [],
    communityCards: [],
    pot: 0,
    currentBet: 0,
    dealerIndex: 0,
    smallBlindIndex: 1 % players.length,
    bigBlindIndex: 2 % players.length,
    round: 'pre-flop',
    smallBlind,
    bigBlind,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    hostId: players[0].id,
  };
}

/**
 * Starts the game and deals initial cards
 */
export function startTexasHoldem(state: TexasHoldemState): TexasHoldemState {
  if (state.status !== 'waiting') {
    throw new Error('Game already started');
  }

  // Validate player count when starting the game
  if (state.players.length < 2) {
    throw new Error('Need at least 2 players to start');
  }

  if (state.players.length > 8) {
    throw new Error('Maximum 8 players allowed');
  }

  const newState = { ...state };
  let currentDeck = [...newState.deck];

  // Deal 2 cards to each player
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < newState.players.length; j++) {
      const { dealt, remaining } = dealCards(currentDeck, 1);
      newState.players[j].hand.push(dealt[0]);
      currentDeck = remaining;
    }
  }

  newState.deck = currentDeck;

  // Post blinds
  const smallBlindPlayer = newState.players[newState.smallBlindIndex];
  const bigBlindPlayer = newState.players[newState.bigBlindIndex];

  const smallBlindAmount = Math.min(smallBlindPlayer.chips!, newState.smallBlind);
  const bigBlindAmount = Math.min(bigBlindPlayer.chips!, newState.bigBlind);

  smallBlindPlayer.chips! -= smallBlindAmount;
  smallBlindPlayer.bet = smallBlindAmount;
  bigBlindPlayer.chips! -= bigBlindAmount;
  bigBlindPlayer.bet = bigBlindAmount;

  newState.pot = smallBlindAmount + bigBlindAmount;
  newState.currentBet = bigBlindAmount;

  // First to act is after big blind
  newState.currentPlayerIndex = (newState.bigBlindIndex + 1) % newState.players.length;
  newState.status = 'active';
  newState.updatedAt = Date.now();

  return newState;
}

/**
 * Processes a player action
 */
export function processTexasHoldemAction(
  state: TexasHoldemState,
  action: GameAction
): TexasHoldemState {
  const newState = { ...state };
  const player = newState.players.find(p => p.id === action.playerId);

  if (!player) {
    throw new Error('Player not found');
  }

  if (newState.players[newState.currentPlayerIndex].id !== action.playerId) {
    throw new Error('Not your turn');
  }

  if (player.status !== 'active') {
    throw new Error('Player is not active');
  }

  switch (action.type) {
    case 'fold':
      player.status = 'folded';
      break;

    case 'check':
      if (player.bet! < newState.currentBet) {
        throw new Error('Cannot check, must call or raise');
      }
      break;

    case 'call': {
      const callAmount = Math.min(
        newState.currentBet - player.bet!,
        player.chips!
      );
      player.chips! -= callAmount;
      player.bet! += callAmount;
      newState.pot += callAmount;

      if (player.chips === 0) {
        player.status = 'all-in';
      }
      break;
    }

    case 'raise': {
      if (!action.amount || action.amount < newState.currentBet * 2) {
        throw new Error('Raise must be at least double the current bet');
      }

      const raiseAmount = Math.min(action.amount - player.bet!, player.chips!);
      player.chips! -= raiseAmount;
      player.bet! += raiseAmount;
      newState.pot += raiseAmount;
      newState.currentBet = player.bet!;

      if (player.chips === 0) {
        player.status = 'all-in';
      }
      break;
    }

    case 'all-in': {
      const allInAmount = player.chips!;
      player.chips = 0;
      player.bet! += allInAmount;
      newState.pot += allInAmount;
      player.status = 'all-in';

      if (player.bet! > newState.currentBet) {
        newState.currentBet = player.bet!;
      }
      break;
    }

    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }

  newState.updatedAt = Date.now();

  // Move to next player or next round
  const nextState = advanceToNextPlayer(newState);
  return nextState;
}

/**
 * Advances to the next active player or next round
 */
function advanceToNextPlayer(state: TexasHoldemState): TexasHoldemState {
  const newState = { ...state };
  const activePlayers = newState.players.filter(p => p.status === 'active' || p.status === 'all-in');

  // Check if round is complete (all active players have matched the current bet)
  const roundComplete = newState.players
    .filter(p => p.status === 'active')
    .every(p => p.bet === newState.currentBet);

  if (activePlayers.length === 1) {
    // Only one player left, they win
    return finishHand(newState);
  }

  if (roundComplete) {
    return advanceRound(newState);
  }

  // Find next active player
  let nextIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
  while (newState.players[nextIndex].status !== 'active') {
    nextIndex = (nextIndex + 1) % newState.players.length;
  }

  newState.currentPlayerIndex = nextIndex;
  return newState;
}

/**
 * Advances to the next betting round
 */
function advanceRound(state: TexasHoldemState): TexasHoldemState {
  const newState = { ...state };

  // Reset bets for next round
  newState.players.forEach(p => {
    p.bet = 0;
  });
  newState.currentBet = 0;

  let currentDeck = [...newState.deck];

  switch (newState.round) {
    case 'pre-flop': {
      // Deal flop (3 cards)
      const { dealt, remaining } = dealCards(currentDeck, 3);
      newState.communityCards = dealt;
      newState.deck = remaining;
      newState.round = 'flop';
      break;
    }

    case 'flop': {
      // Deal turn (1 card)
      const { dealt, remaining } = dealCards(currentDeck, 1);
      newState.communityCards.push(dealt[0]);
      newState.deck = remaining;
      newState.round = 'turn';
      break;
    }

    case 'turn': {
      // Deal river (1 card)
      const { dealt, remaining } = dealCards(currentDeck, 1);
      newState.communityCards.push(dealt[0]);
      newState.deck = remaining;
      newState.round = 'river';
      break;
    }

    case 'river': {
      // Showdown
      newState.round = 'showdown';
      return finishHand(newState);
    }

    default:
      break;
  }

  // Start betting with player after dealer
  newState.currentPlayerIndex = (newState.dealerIndex + 1) % newState.players.length;
  while (newState.players[newState.currentPlayerIndex].status !== 'active') {
    newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
  }

  return newState;
}

/**
 * Finishes the hand and determines winner(s)
 */
function finishHand(state: TexasHoldemState): TexasHoldemState {
  const newState = { ...state };
  const activePlayers = newState.players.filter(
    p => p.status === 'active' || p.status === 'all-in'
  );

  if (activePlayers.length === 1) {
    // Only one player left, they win the pot
    activePlayers[0].chips! += newState.pot;
    newState.pot = 0;
  } else {
    // Evaluate hands
    const playerHands = activePlayers.map(player => ({
      player,
      hand: evaluatePokerHand([...player.hand, ...newState.communityCards]),
    }));

    // Sort by hand strength
    playerHands.sort((a, b) => compareHands(b.hand, a.hand));

    // Award pot to winner(s) (handle ties)
    const winners = [playerHands[0]];
    for (let i = 1; i < playerHands.length; i++) {
      if (compareHands(playerHands[i].hand, playerHands[0].hand) === 0) {
        winners.push(playerHands[i]);
      } else {
        break;
      }
    }

    const potShare = Math.floor(newState.pot / winners.length);
    winners.forEach(({ player }) => {
      player.chips! += potShare;
    });

    newState.pot = 0;
  }

  newState.status = 'completed';
  newState.updatedAt = Date.now();

  return newState;
}
