import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Globe2, Landmark, Users } from "lucide-react";

const collaborators = [
  { icon: Building2, label: "LIS Professionals" },
  { icon: Users, label: "Publishing Industry" },
  { icon: Globe2, label: "Academic Community" },
  { icon: Landmark, label: "Professional Associations" },
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
          <span className="text-secondary font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-3 block">
            Collaborations
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Working With Diverse Stakeholders
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            The LIS Academy actively collaborates with diverse stakeholders, including academic institutions, national and international professional associations, and government bodies, to drive innovation and professional growth in the library sector.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {collaborators.map((partner, i) => (
            <motion.div
              key={partner.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-3 px-6 py-4 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-secondary/30 transition-colors"
            >
              <partner.icon className="text-secondary" size={18} />
              {partner.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
