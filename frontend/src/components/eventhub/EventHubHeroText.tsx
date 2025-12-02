import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function EventHubHeroText() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          >
            Why EventHub is crucial
            <br />
            <span className="text-[#2563EB]">for Kazakhstan.</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="space-y-6 text-lg text-slate-400 leading-relaxed"
          >
            <motion.p variants={itemVariants}>
              Kazakhstan's tech ecosystem is growing fast, but it's fragmented. Students at NU don't know 
              about hackathons at AITU. Developers in Almaty miss opportunities in Astana. Great ideas die 
              because teams never form.
            </motion.p>
            <motion.p variants={itemVariants}>
              EventHub connects the dots. We unite tech youth across universities, cities, and communities. 
              We support hackathon culture by making it easier to find teams and events. We help colleges 
              build stronger tech communities by giving students a platform to collaborate, not just compete.
            </motion.p>
            <motion.p variants={itemVariants}>
              Most importantly, we reduce friction. Creating a team should take minutes, not weeks. Finding 
              a hackathon should be one search, not fifty Telegram channels. EventHub makes Kazakhstan's tech 
              ecosystem accessible, connected, and ready to build.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

