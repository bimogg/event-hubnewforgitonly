import { motion } from "framer-motion";
import { Scan, ImageIcon, CreditCard, ArrowRight } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export function LumiereBentoGrid() {
  return (
    <section className="py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-6xl font-bold mb-16 text-center"
        >
          Powered by AI
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card - Auto-Parsing Engine */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 bg-[#0a0a0a] border border-[#333] rounded-2xl p-8 hover:border-silver-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Scan className="text-white" size={24} />
                </div>
                <h3 className="font-serif text-3xl font-bold">Auto-Parsing Engine</h3>
              </div>
              <p className="text-silver-400 mb-6 text-lg">
                Our AI scans your Instagram posts, extracts product details, pricing, and styling information automatically.
              </p>
              {/* Visual: Code scanning animation */}
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-silver-600">Scanning post...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="text-silver-600">Extracting product data...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                  <span className="text-silver-600">Catalog generated ✓</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Small Card - AI Image Upscaling */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-[#0a0a0a] border border-[#333] rounded-2xl p-8 hover:border-silver-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-white" size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold">AI Image Upscaling</h3>
              </div>
              <p className="text-silver-400 text-sm mb-4">
                Enhance product images to 4K quality automatically.
              </p>
              {/* Before/After visual */}
              <div className="space-y-2">
                <div className="h-20 bg-gradient-to-r from-silver-800/30 to-silver-700/30 rounded-lg border border-[#333]" />
                <div className="flex items-center gap-2 text-xs text-silver-600">
                  <ArrowRight className="rotate-90" size={12} />
                  <span>Enhanced</span>
                </div>
                <div className="h-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30" />
              </div>
            </div>
          </motion.div>

          {/* Tall Card - Instant Checkout */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="md:row-span-2 bg-[#0a0a0a] border border-[#333] rounded-2xl p-8 hover:border-silver-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-white" size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold">Instant Checkout</h3>
              </div>
              <p className="text-silver-400 mb-6 text-sm">
                Seamless payment integration. One-click purchases.
              </p>
              {/* Payment UI Mockup */}
              <div className="flex-1 bg-[#050505] border border-[#333] rounded-xl p-6 space-y-4">
                <div className="space-y-3">
                  <div className="h-12 bg-silver-800/30 rounded-lg border border-[#333]" />
                  <div className="h-12 bg-silver-800/30 rounded-lg border border-[#333]" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-silver-800/30 rounded-lg border border-[#333]" />
                    <div className="h-12 bg-silver-800/30 rounded-lg border border-[#333]" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white"
                >
                  Complete Purchase
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

