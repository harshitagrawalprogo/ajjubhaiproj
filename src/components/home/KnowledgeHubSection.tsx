import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, BookOpen, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  { icon: FileText, title: "Research Papers", count: "120+ Papers", description: "Peer-reviewed publications in library science and information management." },
  { icon: BookOpen, title: "Blog & Articles", count: "200+ Articles", description: "Expert insights on trends, tools, and best practices in the field." },
  { icon: Video, title: "Video Lectures", count: "50+ Videos", description: "Recorded sessions from conferences, workshops, and guest lectures." },
];

export default function KnowledgeHubSection() {
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
            Knowledge Hub
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Our Resources
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access a curated library of research, articles, and educational content.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group p-8 rounded-2xl bg-card border border-border hover-lift text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <span className="text-secondary font-semibold text-sm">{item.count}</span>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button variant="hero" size="lg" asChild>
            <a href="/knowledge">Browse All Resources <ArrowRight size={16} /></a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
