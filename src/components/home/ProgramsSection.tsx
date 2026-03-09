import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, FlaskConical, Wrench, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const programs = [
  {
    icon: GraduationCap,
    title: "Library Automation (Koha)",
    description: "Expert implementation and training for Koha – the world's most widely used open-source Integrated Library System across universities and colleges.",
    color: "bg-accent",
  },
  {
    icon: FlaskConical,
    title: "Digital Repositories",
    description: "Setup and training for DSpace and EPrints digital repository platforms for institutional repositories and digital preservation.",
    color: "bg-gold-light",
  },
  {
    icon: Wrench,
    title: "IRINS & Research Systems",
    description: "Implementation of the IRINS (Indian Research Information Network System) to manage and showcase institutional research outputs.",
    color: "bg-accent",
  },
  {
    icon: Award,
    title: "Ranking & Accreditation",
    description: "Consultancy and support for NBA, NAAC, and NIRF ranking processes with a focus on library and information metrics.",
    color: "bg-gold-light",
  },
];

export default function ProgramsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">
            Our Programs
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Discover Your Learning Path
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our carefully designed programs that blend academic rigor with practical application.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group p-6 rounded-xl bg-card border border-border hover-lift cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <program.icon className="text-primary" size={26} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{program.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{program.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={14} />
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="hero" size="lg" asChild>
            <Link to="/programs">
              View All Programs <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
