import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { allProductsAndServices, programPages } from "@/lib/programPages";

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Programs() {
  return (
    <PageLayout>
      <PageHeader
        tag="Products and Services"
        title={
          <>
            View All Services
            <span className="mt-4 block text-3xl font-medium text-[#c9a84c] md:text-4xl lg:text-5xl">
              LIS Academy
            </span>
          </>
        }
        description={allProductsAndServices.summary}
      />

      <section className="section-padding bg-[#0d1b3e]">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="grid gap-7 lg:grid-cols-[0.35fr,1fr] lg:items-start">
                <div>
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c9a84c]/15">
                    <BriefcaseBusiness size={30} className="text-[#c9a84c]" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white">{allProductsAndServices.title}</h2>
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-white/65">{allProductsAndServices.description}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {programPages.map((program) => (
                      <Link
                        key={program.slug}
                        to={`/programs/${program.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2 text-sm font-semibold text-white/75 transition-all hover:-translate-y-0.5 hover:text-white"
                      >
                        {program.title} <ArrowRight size={14} style={{ color: program.accent }} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </FadeIn>

          <FadeIn className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-center font-serif text-3xl font-bold text-white">{allProductsAndServices.servicesTitle}</h2>
              <p className="mx-auto mt-3 max-w-3xl text-center text-white/55">
                The following content is structured from the products and services document as service headings and service descriptions.
              </p>
              <dl className="mt-8 grid gap-3 lg:grid-cols-2">
                {allProductsAndServices.services.map((service) => (
                  <div key={service.term} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <dt className="text-sm font-semibold leading-relaxed text-white">{service.term}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/70">{service.details}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
