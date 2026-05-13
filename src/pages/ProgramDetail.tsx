import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { academyOverview, getProgramPage } from "@/lib/programPages";
import NotFound from "./NotFound";

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

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const program = getProgramPage(slug);

  if (!program) return <NotFound />;

  const Icon = program.icon;

  return (
    <PageLayout>
      <PageHeader
        tag={program.eyebrow}
        title={program.title}
        description={program.summary}
      >
        <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0d080] hover:text-white">
          <ArrowLeft size={16} /> Back to all programs
        </Link>
      </PageHeader>

      <section className="section-padding bg-[#0d1b3e]">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="space-y-8">
              <aside className="rounded-2xl border border-white/10 bg-white/5 p-7">
                <div className="grid gap-7 lg:grid-cols-[0.35fr,1fr] lg:items-start">
                  <div>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `${program.accent}22` }}>
                      <Icon size={30} style={{ color: program.accent }} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">Who It Supports</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {program.audience.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/70">
                        <Users size={15} className="mt-0.5 shrink-0" style={{ color: program.accent }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[#0d1b3e] transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
                >
                  Contact for Details <ArrowRight size={15} />
                </Link>
              </aside>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h2 className="text-center font-serif text-3xl font-bold text-white">{program.servicesTitle}</h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-white/55">
                  These offerings can be delivered as workshops, consultancy support, institutional engagements, audits, implementation projects, or customized capacity-building programs.
                </p>
                <dl className="mt-8 grid gap-3 lg:grid-cols-2">
                  {program.services.map((service) => (
                    <div key={service.term} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <dt className="text-sm font-semibold leading-relaxed text-white">{service.term}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-white/70">{service.details}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="mt-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-white">
              <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c9a84c]">{academyOverview.title}</p>
                  <h2 className="mt-3 font-serif text-3xl font-bold text-white">Learn Inspire Serve</h2>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-white/65">
                  {academyOverview.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {academyOverview.pillars.map((pillar) => (
                  <div key={pillar} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm font-medium text-white/72">
                    {pillar}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
