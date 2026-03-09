import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Lightbulb } from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    { icon: Target, title: "Mission", text: "To advance the field of Library & Information Science through world-class training, research, and community building." },
    { icon: Eye, title: "Vision", text: "To be the foremost institution shaping the future of information professionals globally." },
    { icon: Lightbulb, title: "Purpose", text: "Founded to bridge the gap between traditional library science and modern information technology." },
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
              LIS Academy is India's premier institution dedicated to Library and Information Science. 
              We bring together researchers, librarians, and technology professionals to advance knowledge 
              management, digital literacy, and information access across the nation.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">15+</div>
                <div className="text-sm text-muted-foreground">Years of Excellence</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Expert Faculty</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-foreground">Pan India</div>
                <div className="text-sm text-muted-foreground">Reach & Impact</div>
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
