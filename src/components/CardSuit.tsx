import { motion } from "framer-motion";

interface CardSuitProps {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  className?: string;
  size?: number;
}

const suitPaths = {
  hearts: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  diamonds: "M12 2L2 12l10 10 10-10L12 2z",
  clubs: "M12 2C9.24 2 7 4.24 7 7c0 1.84 1.01 3.44 2.5 4.32-.03.22-.05.45-.05.68 0 2.76 2.24 5 5 5s5-2.24 5-5c0-.23-.02-.46-.05-.68C20.99 10.44 22 8.84 22 7c0-2.76-2.24-5-5-5-1.39 0-2.64.56-3.55 1.47A4.98 4.98 0 0 0 12 2zm0 18l-3 2h6l-3-2z",
  spades: "M12 2C9 6 4 9 4 13c0 2.76 2.24 5 5 5 1.12 0 2.15-.38 2.98-1.01-.01.34-.02.68-.02 1.01H12v2H9l3 2 3-2h-3v-2h.04c0-.33-.01-.67-.02-1.01A4.98 4.98 0 0 0 15 18c2.76 0 5-2.24 5-5 0-4-5-7-8-11z",
};

const suitColors = {
  hearts: "text-ruby",
  diamonds: "text-ruby",
  clubs: "text-foreground",
  spades: "text-foreground",
};

export const CardSuit = ({ suit, className = "", size = 24 }: CardSuitProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${suitColors[suit]} ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
    >
      <path d={suitPaths[suit]} />
    </motion.svg>
  );
};
