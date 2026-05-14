import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { homePrograms } from "@/components/home/ProgramsSection";
import { allProductsAndServices } from "@/lib/programPages";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
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
            View All Products and Services
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
            <div className="mb-8">
              <div className="text-center">
                <h2 className="font-serif text-3xl font-bold text-white md:text-4xl"></h2>
                <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base"></p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {homePrograms.map((program, i) => (
                  <FadeIn key={program.title} delay={0.05 + i * 0.05}>
                    <Link
                      to={program.link}
                      className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:-translate-y-1 hover:bg-white/10"
                    >
                      <div
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${program.hexColor}22` }}
                      >
                        <program.icon
                          size={24}
                          style={{ color: program.hexColor }}
                        />
                      </div>
                      <h3
                        className="font-serif text-lg font-semibold leading-snug text-white transition-colors"
                        style={{ color: "white" }}
                      >
                        {program.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
                        {program.description}
                      </p>
                      <span
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                        style={{ color: program.hexColor }}
                      >
                        Learn more <ArrowRight size={14} />
                      </span>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn className="mt-8">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-center font-serif text-3xl font-bold text-white">
                {allProductsAndServices.servicesTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-center text-white/55">
                The following content is structured from the products and
                services document as service headings and service descriptions.
              </p>
              <dl className="mt-8 grid gap-3 lg:grid-cols-2">
                {allProductsAndServices.services.map((service) => (
                  <div
                    key={service.term}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <dt className="text-sm font-semibold leading-relaxed text-white">
                      {service.term}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/70">
                      {service.details}
                    </dd>
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
