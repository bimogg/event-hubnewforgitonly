import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

export function LumiereAIStylist() {
  return (
    <section id="stylist" className="py-32 px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Your customers get a
              <br />
              <span className="bg-gradient-to-r from-silver-300 to-white bg-clip-text text-transparent">
                Personal AI Stylist
              </span>
            </h2>
            <p className="text-lg text-silver-300 mb-6 leading-relaxed font-light">
              Every visitor gets an AI assistant that understands your brand voice and catalog. 
              They can ask for outfit recommendations based on occasion, budget, and style preferences.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white mb-1">Context-Aware Recommendations</h4>
                  <p className="text-silver-400 text-sm">
                    AI analyzes occasion, weather, and personal style to suggest perfect outfits.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white mb-1">Budget-Conscious Matching</h4>
                  <p className="text-silver-400 text-sm">
                    Filters recommendations by price range while maintaining style quality.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white mb-1">Brand Voice Integration</h4>
                  <p className="text-silver-400 text-sm">
                    Speaks in your brand's tone, using your product descriptions and styling notes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Chat Interface Simulation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#050505] border border-[#333] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold">AI Stylist</h3>
                <p className="text-silver-500 text-sm">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mb-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-silver-800/30 border border-[#333] rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                  <p className="text-white text-sm">
                    I need an outfit for a summer wedding. Budget around $500.
                  </p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="bg-[#0a0a0a] border border-[#333] rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <p className="text-silver-300 text-sm mb-3">
                    Based on your catalog, here's a perfect match:
                  </p>
                  <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-3 mb-2">
                    <div className="aspect-[4/5] bg-silver-800/30 rounded mb-2" />
                    <p className="text-white font-semibold text-sm mb-1">Silk Slip Dress</p>
                    <p className="text-silver-400 text-xs">$320</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-3">
                    <div className="aspect-[4/5] bg-silver-800/30 rounded mb-2" />
                    <p className="text-white font-semibold text-sm mb-1">Silver Heels</p>
                    <p className="text-silver-400 text-xs">$180</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 font-semibold">
                      94% Match
                    </div>
                    <span className="text-silver-500 text-xs">Total: $500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask for styling advice..."
                className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-silver-600 text-sm focus:outline-none focus:border-silver-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
              >
                <MessageCircle className="text-white" size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

