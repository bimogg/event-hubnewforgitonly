import { motion } from "framer-motion";
import { FileText, Sparkles, Zap } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Tell us about yourself",
    description: "Upload your resume, tag your skills, and share your interests. We parse your experience automatically and build your profile in seconds.",
  },
  {
    icon: Sparkles,
    title: "We match you",
    description: "Our AI analyzes skills, interests, experience levels, and psychotype to find teammates who complement you. See compatibility scores for every match.",
  },
  {
    icon: Zap,
    title: "Build and Win",
    description: "Join a team, discover hackathons, and build something real. From idea to MVP in one weekend. From solo to squad in one click.",
  },
];

export function EventHubHowItWorks() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          How it works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 relative"
                >
                  <Icon className="text-white" size={28} />
                  {/* Blue glow effect */}
                  <div className="absolute inset-0 bg-[#2563EB] rounded-xl blur-xl opacity-50" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

