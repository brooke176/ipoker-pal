import { motion } from "framer-motion";
import { GameCard } from "./GameCard";

const games = [
  {
    title: "Texas Hold'em",
    description: "The world's most popular poker game. Bluff, bet, and outsmart your friends in intense showdowns.",
    players: "2-8 players",
    suit: "spades" as const,
  },
  {
    title: "Gin Rummy",
    description: "Classic two-player rummy. Form melds, reduce deadwood, and knock before your opponent.",
    players: "2 players",
    suit: "hearts" as const,
  },
  {
    title: "Blackjack",
    description: "Beat the dealer to 21. Simple rules, deep strategy, endless fun with friends.",
    players: "2-6 players",
    suit: "diamonds" as const,
  },
  {
    title: "War",
    description: "The ultimate game of luck. Flip cards and battle for supremacy in this fast-paced classic.",
    players: "2 players",
    suit: "clubs" as const,
  },
  {
    title: "Go Fish",
    description: "A family favorite. Collect sets of four and be the first to empty your hand.",
    players: "2-6 players",
    suit: "hearts" as const,
  },
  {
    title: "Crazy Eights",
    description: "Match suits or numbers to shed your cards. Play an eight to switch things up!",
    players: "2-7 players",
    suit: "spades" as const,
  },
];

export const GamesSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_1px)] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Pick Your <span className="text-gradient-emerald">Game</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From intense poker battles to relaxing card classics — we've got a game for every mood.
          </p>
        </motion.div>

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <GameCard
              key={game.title}
              {...game}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
