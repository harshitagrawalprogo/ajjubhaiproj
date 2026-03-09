import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "LIS Academy transformed my career. The research training program gave me the tools to publish in top journals.",
    name: "Dr. Priya Sharma",
    role: "Senior Librarian, Delhi University",
  },
  {
    quote: "The workshops are incredibly well-structured. I learned more in one week than in months of self-study.",
    name: "Rajesh Kumar",
    role: "Information Scientist, CSIR",
  },
  {
    quote: "Being part of the LIS community has opened doors to collaborations I never imagined possible.",
    name: "Anita Desai",
    role: "Research Scholar, JNU",
  },
];

const communityGroups = [
  { label: "Students", count: "2,000+" },
  { label: "Librarians", count: "1,500+" },
  { label: "Researchers", count: "800+" },
  { label: "Academics", count: "500+" },
];

export default function CommunitySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">
            Our Community
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Join a Thriving Ecosystem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with professionals, researchers, and learners across the information science landscape.
          </p>
        </motion.div>

        {/* Community stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {communityGroups.map((group) => (
            <div key={group.label} className="text-center p-6 rounded-xl bg-accent border border-border">
              <div className="text-2xl font-serif font-bold text-foreground">{group.count}</div>
              <div className="text-sm text-muted-foreground mt-1">{group.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="p-6 rounded-xl bg-card border border-border hover-lift"
            >
              <Quote className="text-secondary/40 mb-4" size={28} />
              <p className="text-foreground text-sm leading-relaxed mb-6 italic">
                "{item.quote}"
              </p>
              <div>
                <div className="font-semibold text-foreground text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
