import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Lightbulb } from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Target,
      title: "Mission",
      text: "To spread the multidimensional utility and overall growth of librarianship through education, literature, research, publications, training, consultation, and collaboration.",
    },
    {
      icon: Eye,
      title: "Vision",
      text: "To become an active and dynamic professional body supporting librarians with essential knowledge, skills, values, and innovative technology.",
    },
    {
      icon: Lightbulb,
      title: "Purpose",
      text: "To provide need-based services to libraries across the country and help bridge the gap between LIS education and professional practice.",
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">
              About LIS Academy
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              A Professional Platform for Libraries, Librarians, and Research Communities
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              LIS Academy works for the development of the Library and Information Science profession and assists libraries with state-of-the-art technology as well as continuous skill development for librarians. Its public-facing work includes training, consultancy, publications, seminars, workshops, and research productivity support for higher education institutions.
            </p>
            <div className="flex gap-8 flex-wrap">
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">Need-Based</div>
                <div className="text-sm text-muted-foreground">Services for Libraries</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">Pan-India</div>
                <div className="text-sm text-muted-foreground">Training and Consultancy Reach</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">Learn Inspire Serve</div>
                <div className="text-sm text-muted-foreground">Core Identity and Practice</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                className="flex gap-4 p-5 rounded-xl bg-card border border-border hover-lift"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <item.icon className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
