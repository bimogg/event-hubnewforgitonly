import { motion } from "framer-motion";

export function LumiereWhyItMatters() {
  return (
    <section className="py-32 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl md:text-6xl font-bold mb-8 text-center"
        >
          The bridge between Likes and Sales.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 text-lg text-silver-300 leading-relaxed font-light"
        >
          <p>
            Instagram is fragmented. Your best posts get buried in feeds. Your products live in captions, 
            stories, and DMs. Customers scroll past, save for later, and forget. The demand is there—but 
            there's no bridge to capture it.
          </p>
          <p>
            Lumiere connects the dots. We parse every post, story highlight, and product tag from your 
            Instagram profile. Our AI extracts product details, pricing, and styling notes. In minutes, 
            you have a premium e-commerce site that mirrors your aesthetic—zero coding required.
          </p>
          <p>
            Your customers get more than a catalog. They get a Personal AI Stylist that understands your 
            brand voice and creates outfit recommendations based on occasion, budget, and style preferences. 
            From discovery to checkout, Lumiere turns your Instagram presence into a flagship store.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

