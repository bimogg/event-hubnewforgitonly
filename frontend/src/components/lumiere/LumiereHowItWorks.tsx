import { motion } from "framer-motion";
import { Link as LinkIcon, Sparkles, Rocket } from "lucide-react";

const steps = [
  {
    icon: LinkIcon,
    title: "Paste Link",
    description: "Connect your Instagram profile. We'll scan your posts, stories, and highlights automatically.",
  },
  {
    icon: Sparkles,
    title: "AI Generates Catalog",
    description: "Our AI extracts products, pricing, and styling details. Your site is built in minutes.",
  },
  {
    icon: Rocket,
    title: "Publish & Sell",
    description: "Launch your store instantly. Share the link, start selling, and let the AI Stylist handle customer queries.",
  },
];

export function LumiereHowItWorks() {
  return (
    <section className="py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-6xl font-bold mb-16 text-center"
        >
          How it works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-silver-400 leading-relaxed font-light">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

