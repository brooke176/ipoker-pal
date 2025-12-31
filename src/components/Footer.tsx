import { motion } from "framer-motion";
import { CardSuit } from "./CardSuit";

export const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center">
              <CardSuit suit="spades" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">DeckDuel</span>
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          {/* Suits decoration */}
          <div className="flex items-center gap-2">
            <CardSuit suit="hearts" size={18} className="opacity-50" />
            <CardSuit suit="diamonds" size={18} className="opacity-50" />
            <CardSuit suit="clubs" size={18} className="opacity-50" />
            <CardSuit suit="spades" size={18} className="opacity-50" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DeckDuel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
