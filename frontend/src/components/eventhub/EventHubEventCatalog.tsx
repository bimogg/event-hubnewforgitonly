import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function EventHubEventCatalog() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Event Catalog
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We automatically parse events from universities and tech hubs. No more scrolling Telegram channels.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all">
            <div className="flex flex-col md:flex-row">
              {/* Date Box */}
              <div className="bg-white/10 w-full md:w-32 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/10">
                <Calendar className="text-[#2563EB] mb-2" size={24} />
                <span className="text-white font-bold text-sm">Apr 15-17</span>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase mb-1 block">
                      Hackathon • NU
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#2563EB] transition mb-2">
                      HackNU 2025
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                      <MapPin size={14} />
                      Nazarbayev University • Astana • Offline
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs">
                        AI
                      </span>
                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs">
                        HealthTech
                      </span>
                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs">
                        Student
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 flex items-center justify-center bg-white/5">
                <Link
                  to="/events"
                  className="px-4 py-2 bg-white text-[#020617] font-semibold rounded-lg hover:bg-slate-100 transition w-full md:w-auto text-center flex items-center justify-center gap-2"
                >
                  Find a Team
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

