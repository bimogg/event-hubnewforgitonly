import { motion } from "framer-motion";

export function EventHubFooter() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">EventHub</span>
          </div>

          <p className="text-slate-500 text-sm">
            © 2025 EventHub Platform. Built for builders in Kazakhstan 🇰🇿
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Telegram</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

