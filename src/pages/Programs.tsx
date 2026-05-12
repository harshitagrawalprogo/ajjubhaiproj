import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { GraduationCap, FlaskConical, Wrench, Award, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: GraduationCap,
    title: "Training and Skill Development",
    duration: "Need-based",
    mode: "Online / On-site",
    description: "LIS Academy supports librarians through continuous skill development programs, practical workshops, and professional learning opportunities.",
    highlights: ["Continuing education support", "Professional upskilling", "Seminars and workshops", "LIS-focused learning", "Application-oriented delivery"],
    curriculum: ["Emerging tools in librarianship", "Professional values and best practices", "Service innovation", "Academic support workflows", "Technology-enabled library work"],
  },
  {
    icon: FlaskConical,
    title: "Research Productivity Workshops",
    duration: "Workshop format",
    mode: "Institutional engagement",
    description: "The academy works with teachers and research scholars to improve research output, publication quality, and scholarly visibility.",
    highlights: ["Publication-oriented guidance", "Seminars for teachers", "Research scholar support", "Visibility and productivity focus", "Institutional outcomes"],
    curriculum: ["Research ecosystem orientation", "Publication support", "Scholarly profiling", "Visibility improvement strategies", "Academic impact practices"],
  },
  {
    icon: Wrench,
    title: "Technology Implementation Services",
    duration: "Project-based",
    mode: "Consultancy + deployment",
    description: "LIS Academy assists libraries with technology adoption through automation, repository setup, and research information services.",
    highlights: ["Koha library automation", "DSpace repository support", "EPrints implementation", "IRINS and research systems", "Need-based consultation"],
    curriculum: ["Planning and migration", "Workflow setup", "Metadata and system organization", "User orientation", "Sustainable deployment practices"],
  },
  {
    icon: Award,
    title: "Accreditation and Ranking Consultancy",
    duration: "Cycle-based",
    mode: "Institutional consultancy",
    description: "The academy helps institutions prepare for quality and ranking frameworks with focused support for library and research-related requirements.",
    highlights: ["NBA support", "NAAC preparation", "NIRF-oriented guidance", "Documentation support", "Strategic improvement inputs"],
    curriculum: ["Assessment preparedness", "Library evidence and reporting", "Research visibility inputs", "Institutional documentation", "Improvement planning"],
  },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
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
        tag=""
        title={
          <>
            Programs
            <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl font-medium text-[#c9a84c]">
              Services and Professional Support
            </span>
          </>
        }
        description="A structured overview of LIS Academy's public-facing service areas and institutional support model."
      />

      <section className="section-padding bg-[#0d1b3e]">
        <div className="max-w-6xl mx-auto space-y-20">
          {programs.map((program, i) => (
            <FadeIn key={program.title}>
              <div className={`grid lg:grid-cols-2 gap-10 items-start ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}>
                <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)" }}>
                      <program.icon style={{ color: "#c9a84c" }} size={24} />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">{program.title}</h2>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-white/50">
                      <Clock size={14} /> {program.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-white/50">
                      <Users size={14} /> {program.mode}
                    </span>
                  </div>
                  <p className="text-white/55 leading-relaxed mb-6">{program.description}</p>
                  <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Key Highlights</h4>
                  <ul className="space-y-2 mb-6">
                    {program.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-white/55">
                        <CheckCircle style={{ color: "#c9a84c" }} className="shrink-0 mt-0.5" size={14} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#0d1b3e] hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-[#c9a84c]/20"
                    style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
                  >
                    Contact for Details <ArrowRight size={14} />
                  </a>
                </div>

                <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
                  <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
                    <h4 className="font-serif text-lg font-semibold text-white mb-5">Focus Areas</h4>
                    <div className="space-y-4">
                      {program.curriculum.map((module, idx) => (
                        <div key={module} className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(201,168,76,0.18)", color: "#c9a84c" }}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-white/70">{module}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {i < programs.length - 1 && <div className="border-b border-white/10 mt-16" />}
            </FadeIn>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
