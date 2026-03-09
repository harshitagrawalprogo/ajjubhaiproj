import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Lightbulb } from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    { icon: Target, title: "Mission", text: "To bridge the gap between LIS education and the profession and assist libraries with modern technology through training, research, and consultancy." },
    { icon: Eye, title: "Vision", text: "To be the foremost destination for LIS professionals to acquire cutting-edge skills and provide best-in-class technology-based solutions." },
    { icon: Lightbulb, title: "Purpose", text: "Established as a Public Charitable Trust to work for the development of the Library & Information Science profession through education, literature, and research." },
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
              Shaping the Future of Information Science
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              LIS Academy is a professional Public Charitable Trust established to advance the Library &amp; Information Science profession.
              We specialize in library automation, digital repositories, research information systems, and accreditation support — bridging the gap between LIS education and modern technology.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Programs Conducted</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">30+</div>
                <div className="text-sm text-muted-foreground">IRINS Institutes</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">Pan India</div>
                <div className="text-sm text-muted-foreground">Reach &amp; Impact</div>
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
