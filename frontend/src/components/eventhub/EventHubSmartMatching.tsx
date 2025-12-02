import { motion } from "framer-motion";
import { MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";

export function EventHubSmartMatching() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Smart Team Matching
            </h2>
            <p className="text-lg text-slate-400 mb-6 leading-relaxed">
              We don't just match keywords. We analyze soft skills and playstyles. Our algorithm 
              considers communication styles, work preferences, and complementary strengths to find 
              teammates who actually work well together.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#2563EB] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white mb-1">Compatibility Scoring</h4>
                  <p className="text-slate-400 text-sm">
                    See a percentage match based on skills overlap, role complement, and interest alignment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#2563EB] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white mb-1">AI-Powered Suggestions</h4>
                  <p className="text-slate-400 text-sm">
                    Get personalized recommendations for teammates who fit your project goals and working style.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#2563EB] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-white mb-1">Instant Connections</h4>
                  <p className="text-slate-400 text-sm">
                    Chat directly, share profiles, and form teams without leaving the platform.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Floating Match Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Aliya S.</h3>
                    <p className="text-slate-400 text-sm">AITU '25</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-green-400 bg-green-400/20 px-3 py-1 rounded-full">
                  94% Match
                </div>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white font-medium mb-3">
                  Product Designer
                </span>
                <p className="text-slate-300 text-sm mb-4">
                  Looking for a teammate for Forte Bank hackathon. Need a backend developer.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
                    Figma
                  </span>
                  <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
                    UX Research
                  </span>
                  <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
                    Blender
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2.5 rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-500/20"
                >
                  <MessageCircle size={16} /> Chat
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 py-2.5 rounded-lg text-sm font-semibold transition border border-white/10"
                >
                  Profile
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

