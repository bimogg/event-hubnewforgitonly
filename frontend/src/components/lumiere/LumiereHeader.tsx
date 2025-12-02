import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LumiereHeader() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-[#333]"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-silver-400 to-silver-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-[#050505]" size={18} />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-silver-300 bg-clip-text text-transparent">
            Lumiere
          </span>
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#product" className="text-silver-300 hover:text-white transition-colors text-sm font-medium">
            Product
          </a>
          <a href="#stylist" className="text-silver-300 hover:text-white transition-colors text-sm font-medium">
            AI Stylist
          </a>
          <a href="#showcase" className="text-silver-300 hover:text-white transition-colors text-sm font-medium">
            Showcase
          </a>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-gradient-to-r from-silver-500 to-silver-400 text-[#050505] font-semibold rounded-lg text-sm hover:from-silver-400 hover:to-silver-300 transition-all shadow-lg shadow-silver-500/20"
        >
          Connect Instagram
        </motion.button>
      </nav>
    </motion.header>
  );
}

