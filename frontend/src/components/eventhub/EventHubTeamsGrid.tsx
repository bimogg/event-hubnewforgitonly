import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const teams = [
  {
    title: "Frontend Developer",
    team: "Astana Hub Hackathon Team",
    description: "Building an AI-powered queue system. Need React expertise.",
    match: "Good Match",
    matchColor: "text-[#2563EB]",
    tags: ["React", "TypeScript"],
  },
  {
    title: "UI/UX Designer",
    team: "AI Mini-Project",
    description: "Weekend sprint. Looking for someone who knows Figma.",
    match: "Perfect Match",
    matchColor: "text-green-400",
    tags: ["Figma", "Design Systems"],
  },
  {
    title: "Backend Developer",
    team: "FinTech Startup",
    description: "Building payment infrastructure. Golang or Node.js preferred.",
    match: "Good Match",
    matchColor: "text-[#2563EB]",
    tags: ["Golang", "PostgreSQL"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
    },
  }),
};

export function EventHubTeamsGrid() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12"
        >
          Teams and Open Positions
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{team.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{team.team}</p>
                    <p className="text-slate-300 text-sm">{team.description}</p>
                  </div>
                  <div className={`text-sm font-bold ${team.matchColor}`}>
                    {team.match}
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  {team.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

