import { motion } from "framer-motion";
import { MessageCircle, Users, Gamepad2, Trophy } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Open iMessage",
    description: "Tap the app drawer in any conversation to find DeckDuel.",
  },
  {
    icon: Users,
    title: "Pick a Friend",
    description: "Choose who you want to challenge — individuals or groups.",
  },
  {
    icon: Gamepad2,
    title: "Select a Game",
    description: "Browse our collection and pick your favorite card game.",
  },
  {
    icon: Trophy,
    title: "Play & Win",
    description: "Take turns, strategize, and claim victory over your friends!",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Get started in seconds. No downloads, no sign-ups — just open and play.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              {/* Step number */}
              <motion.div
                className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center z-10"
                whileHover={{ scale: 1.1 }}
              >
                {index + 1}
              </motion.div>

              {/* Icon container */}
              <div className="w-20 h-20 rounded-2xl bg-card border border-border mx-auto mb-6 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-glow transition-all duration-300">
                <step.icon size={32} className="text-primary" />
              </div>

              {/* Text */}
              <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
