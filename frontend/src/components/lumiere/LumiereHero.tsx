import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Instagram } from "lucide-react";

export function LumiereHero() {
  const [instagramUrl, setInstagramUrl] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          Turn your Instagram Feed
          <br />
          <span className="bg-gradient-to-r from-silver-300 via-white to-silver-300 bg-clip-text text-transparent">
            into a Flagship Store.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-silver-400 mb-12 max-w-3xl mx-auto font-light"
        >
          Zero code. AI-generated catalog. Integrated Personal Stylist.
        </motion.p>

        {/* Input + Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16"
        >
          <div className="relative flex-1">
            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-500" size={20} />
            <input
              type="text"
              placeholder="Paste your Instagram Link"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-silver-600 focus:outline-none focus:border-silver-500 focus:ring-2 focus:ring-silver-500/20 transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/30"
          >
            Generate Site
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        {/* 3D Mockup Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-[#333] rounded-2xl p-8 shadow-2xl">
            {/* Instagram Grid Mockup */}
            <div className="grid grid-cols-3 gap-2 mb-6 opacity-60">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg border border-[#333]"
                />
              ))}
            </div>
            
            {/* Arrow Animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-6"
            >
              <ArrowRight size={32} className="text-silver-500 rotate-90" />
            </motion.div>

            {/* Website Mockup */}
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-[#333]" />
                <div className="space-y-4">
                  <div className="h-4 bg-silver-800/30 rounded w-3/4" />
                  <div className="h-4 bg-silver-800/30 rounded w-1/2" />
                  <div className="h-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-[#333]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

