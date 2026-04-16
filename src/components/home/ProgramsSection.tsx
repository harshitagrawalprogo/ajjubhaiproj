import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, FlaskConical, Wrench, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const programs = [
  {
    icon: GraduationCap,
    title: "Library Technology Training",
    description: "Hands-on training for LIS professionals on automation, digital services, information tools, and emerging practices in modern libraries.",
    color: "bg-accent",
    link: "/library-automation",
  },
  {
    icon: FlaskConical,
    title: "Research Productivity Support",
    description: "Workshops and seminars for teachers and research scholars to improve publication quality, visibility, and institutional research performance.",
    color: "bg-gold-light",
    link: "/programs",
  },
  {
    icon: Wrench,
    title: "Institutional Technology Services",
    description: "Implementation support for Koha, DSpace, EPrints, and IRINS to strengthen library systems, repositories, and research information management.",
    color: "bg-accent",
    link: "/programs",
  },
  {
    icon: Award,
    title: "Accreditation and Ranking Consultancy",
    description: "Consultancy for NBA, NAAC, and NIRF readiness, especially around library services, research visibility, and documentation support.",
    color: "bg-gold-light",
    link: "/programs",
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
            Services Built Around Real Institutional Needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            LIS Academy combines professional development, technology implementation, and academic support for libraries, colleges, universities, and researchers.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group p-0 rounded-xl bg-card border border-border hover-lift cursor-pointer flex flex-col"
            >
              <Link to={program.link} className="flex-grow flex flex-col p-6 h-full">
                <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <program.icon className="text-primary" size={26} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{program.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">{program.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all mt-auto pt-2">
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
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
              View All Services <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
