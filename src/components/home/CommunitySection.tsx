import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The conference history shows LIS Academy bringing together scholars, practitioners, public libraries, and higher education institutions around shared professional questions.",
    name: "Conference Community",
    role: "LIS Scholars and Practitioners",
    hexColor: "#c0392b",
    hoverTextClass: "group-hover:text-[#c0392b]",
  },
  {
    quote:
      "Its training and consultancy model is practical and institution-focused, which makes the academy relevant to libraries that need implementation support as much as theory.",
    name: "Institutional Partners",
    role: "Libraries and Colleges",
    hexColor: "#e67e22",
    hoverTextClass: "group-hover:text-[#e67e22]",
  },
  {
    quote:
      "The lecture series and workshops create a steady learning environment for professionals who want to keep growing after formal education.",
    name: "Continuing Learners",
    role: "Librarians and Researchers",
    hexColor: "#27ae60",
    hoverTextClass: "group-hover:text-[#27ae60]",
  },
];

const communityGroups = [
  { label: "", count: "Librarians " },
  { label: "", count: "Faculties" },
  { label: "", count: "Resarchers" },
  { label: "", count: "Students" },
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
          <span className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 block">
            Our Community
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4">
            Shared Professional Activities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            LIS Academy serves students, librarians, faculty members,
            researchers, and institutions working across the Library and
            Information Science ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {communityGroups.map((group) => (
            <div
              key={group.label}
              className="text-center p-6 rounded-xl bg-accent border border-border"
            >
              <div className="text-2xl font-serif font-bold text-foreground">
                {group.count}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {group.label}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group hover-lift"
            >
              <div
                className="absolute top-0 left-0 w-full h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                style={{ backgroundColor: item.hexColor }}
              ></div>
              <Quote
                className={`text-secondary/40 mb-4 transition-colors duration-300 ${item.hoverTextClass}`}
                size={28}
              />
              <p className="text-foreground text-sm leading-relaxed mb-6 italic">
                "{item.quote}"
              </p>
              <div>
                <div
                  className={`font-semibold text-sm transition-colors duration-300 ${item.hoverTextClass} text-foreground`}
                >
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
