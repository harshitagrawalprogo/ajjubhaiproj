import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const partners = [
  "Delhi University", "JNU", "IGNOU", "CSIR", "UGC",
  "INFLIBNET", "RRRLF", "NASSCOM", "IIT Delhi", "NIT Rourkela",
];

export default function PartnersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-muted/50">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">
            Trusted By
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-12">
            Our Partners & Collaborators
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {partners.map((partner, i) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              className="px-6 py-3 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-secondary/30 transition-colors"
            >
              {partner}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
