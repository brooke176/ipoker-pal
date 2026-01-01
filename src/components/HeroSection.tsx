import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { CardSuit } from "./CardSuit";
import { MessageCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-cards.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Playing cards" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating suits decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%] opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CardSuit suit="hearts" size={60} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-[15%] opacity-15"
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <CardSuit suit="spades" size={80} />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-[20%] opacity-15"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <CardSuit suit="diamonds" size={50} />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-[25%] opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <CardSuit suit="clubs" size={70} />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border"
          >
            <MessageCircle size={16} className="text-primary" />
            <span className="text-sm font-medium">For iMessage</span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-foreground">Play Cards with</span>
            <br />
            <span className="text-gradient-gold">Friends</span>
            <span className="text-foreground"> Anywhere</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            DeckDuel brings classic card games to iMessage. Challenge your friends to Texas Hold'em, 
            Gin Rummy, Blackjack, and more — right in your conversations.
          </p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button variant="gold" size="xl" className="gap-3" onClick={() => navigate('/game')}>
              <Sparkles size={20} />
              Play Now
            </Button>
            <Button variant="glass" size="xl" onClick={() => navigate('/game')}>
              Join Game
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8 flex items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">1M+</div>
              <div className="text-sm">Downloads</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">4.8★</div>
              <div className="text-sm">App Store</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">6+</div>
              <div className="text-sm">Games</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
