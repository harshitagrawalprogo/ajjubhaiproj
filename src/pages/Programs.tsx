import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
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
            View All Programs and Services
            <span className="mt-4 block text-3xl font-medium text-[#c9a84c] md:text-4xl lg:text-5xl"></span>
          </>
        }
        description={allProductsAndServices.summary}
      />

      <section className="section-padding bg-[#0d1b3e]">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-center font-serif text-3xl font-bold text-white">
                All Services
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-center text-white/55">
                Browse the complete products and services offered by LIS
                Academy.
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
