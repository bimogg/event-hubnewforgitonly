import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function EventHubMissionCTA() {
  return (
    <section className="py-32 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          Don't build alone.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto"
        >
          Central platform for Kazakhstan's tech ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          <Link
            to="/events"
            className="px-8 py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg"
          >
            <Calendar size={20} />
            View 42 Active Events
          </Link>
          <Link
            to="/talents"
            className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Users size={20} />
            Find a Teammate
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-sm text-slate-500"
        >
          Used by students from NU, AITU, KBTU, IITU.
        </motion.p>
      </div>
    </section>
  );
}

