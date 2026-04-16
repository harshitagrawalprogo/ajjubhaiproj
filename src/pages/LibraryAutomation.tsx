import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { ExternalLink, BookOpen, Library, Globe } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const products = [
  {
    title: "Koha LMS",
    description: "Expert implementation and training for Koha – the world's most widely used open-source Integrated Library System across universities and colleges.",
    icon: BookOpen,
    link: "#",
    external: false
  },
  {
    title: "Bharatvani",
    description: "Access an extensive collection of digital resources and educational materials.",
    icon: Globe,
    link: "https://bharatvani-omega.vercel.app/en",
    external: true
  },
  {
    title: "Digi Lib",
    description: "A comprehensive digital library platform for seamless access to knowledge.",
    icon: Library,
    link: "https://digi-lib-ov3h.onrender.com/login",
    external: true
  }
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function LibraryAutomation() {
  return (
    <PageLayout>
      <PageHeader
        tag="Library Automation"
        title="Transforming Libraries with Technology"
        description="Expert implementation and training for open-source library systems to empower educational institutions."
      />

      <section className="section-padding bg-[#0d1b3e]">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">Our Core Products</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              We provide comprehensive solutions and platforms to modernize library infrastructure and enhance digital access to information.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <FadeIn key={product.title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(201,168,76,0.15)" }}>
                    <product.icon style={{ color: "#c9a84c" }} size={28} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-4">{product.title}</h3>
                  <p className="text-white/60 leading-relaxed mb-8 flex-grow">
                    {product.description}
                  </p>
                  
                  {product.external ? (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-[#0d1b3e] transition-all duration-300 w-fit"
                      style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
                    >
                      Visit Platform <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white border border-white/20 w-fit"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      Koha LMS
                    </span>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
