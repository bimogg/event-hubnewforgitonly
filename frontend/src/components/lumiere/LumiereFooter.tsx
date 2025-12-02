import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LumiereFooter() {
  return (
    <footer className="border-t border-[#333] py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-silver-400 to-silver-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-[#050505]" size={18} />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-silver-300 bg-clip-text text-transparent">
              Lumiere
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm text-silver-400">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#stylist" className="hover:text-white transition-colors">AI Stylist</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <p className="text-silver-500 text-sm">
            © 2025 Lumiere AI. Built for fashion brands.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

