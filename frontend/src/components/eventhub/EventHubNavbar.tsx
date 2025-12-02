import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export function EventHubNavbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#020617]/80 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">EventHub</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link to="/events" className="hover:text-white transition-colors">
            Events
          </Link>
          <Link to="/talents" className="hover:text-white transition-colors">
            Talent
          </Link>
          <a href="#startups" className="hover:text-white transition-colors">
            Startups
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Search size={18} />
          </motion.button>
          <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Log In
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20"
          >
            Join
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

