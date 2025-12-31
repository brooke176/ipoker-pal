import { motion } from "framer-motion";
import { CardSuit } from "./CardSuit";
import { Button } from "./ui/button";
import { Users } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  players: string;
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  delay?: number;
}

export const GameCard = ({ title, description, players, suit, delay = 0 }: GameCardProps) => {
  return (
    <motion.div
      className="group relative bg-card-gradient rounded-2xl border border-border overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
      
      {/* Card content */}
      <div className="relative p-6 space-y-4">
        {/* Suit icon */}
        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <CardSuit suit={suit} size={32} />
        </div>

        {/* Title & description */}
        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Players info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={16} />
          <span>{players}</span>
        </div>

        {/* Play button */}
        <Button variant="hero" className="w-full mt-4">
          Start Game
        </Button>
      </div>

      {/* Decorative corner suit */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <CardSuit suit={suit} size={48} />
      </div>
    </motion.div>
  );
};
