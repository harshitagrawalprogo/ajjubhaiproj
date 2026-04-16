import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, BookOpen, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    icon: FileText,
    title: "Publications and Conference Papers",
    count: "Research Focus",
    description: "Academic writing, conference proceedings, and professional literature supporting the growth of Library and Information Science.",
  },
  {
    icon: BookOpen,
    title: "Lecture and Training Modules",
    count: "Continuing Education",
    description: "Structured learning support for librarians, faculty members, and research scholars through seminars, workshops, and practical sessions.",
  },
  {
    icon: Video,
    title: "Talks, Seminars, and Web Sessions",
    count: "Professional Outreach",
    description: "Recorded and live knowledge-sharing formats extending LIS Academy beyond conferences into sustained professional learning.",
  },
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
            Knowledge That Extends Beyond the Classroom
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            LIS Academy supports the profession through literature, training content, seminars, publications, and research-oriented learning resources.
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
            <a href="/knowledge">Browse Resources <ArrowRight size={16} /></a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
