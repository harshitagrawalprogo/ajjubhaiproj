import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Target, Eye, Lightbulb, Users, Award, BookOpen, Globe, Heart } from "lucide-react";

const timeline = [
  {
    year: "Foundation",
    title: "Public Charitable Trust",
    text: "LIS Academy was formed to work for the development of the Library and Information Science profession and provide need-based services to libraries across the country.",
  },
  {
    year: "2017",
    title: "1st LIS Academy Conference",
    text: "The inaugural conference was hosted with public library and scientometrics partners around information access and the public role of libraries.",
  },
  {
    year: "2019",
    title: "Innovations in Libraries",
    text: "The 2nd LIS Academy Conference at Visvesvaraya Technological University, Belagavi, brought researchers and practitioners together around technology-enabled innovation in libraries.",
  },
  {
    year: "2020",
    title: "Lecture Series Launch",
    text: "The LISA Distinguished Lecture Series began as a recurring forum for leading voices in librarianship, research, management, and emerging technology.",
  },
  {
    year: "Today",
    title: "Institutional Support",
    text: "The academy continues to support higher education institutions through workshops, research productivity programs, library technology implementation, and accreditation consultancy.",
  },
];

const leaders = [
  {
    name: "Library Professionals",
    role: "Primary Community",
    bio: "Continuous skill development, training, and professional support for librarians across sectors.",
  },
  {
    name: "Higher Education Institutions",
    role: "Institutional Partners",
    bio: "Workshops, seminars, and consultancy to improve research productivity and academic visibility.",
  },
  {
    name: "Research Scholars",
    role: "Academic Beneficiaries",
    bio: "Guidance through seminars and scholarly development activities linked to research and publication quality.",
  },
  {
    name: "Libraries",
    role: "Technology Partners",
    bio: "Implementation-oriented support for automation, repositories, and research information systems.",
  },
];

const advisors = [
  "Library automation and modernization",
  "Digital repositories and open-source platforms",
  "Research visibility and publication productivity",
  "Consultancy for NBA, NAAC, and NIRF",
  "Training, seminars, workshops, and collaboration",
  "Best and fair professional practices in LIS",
];

const values = [
  {
    icon: BookOpen,
    title: "Professional Growth",
    text: "Programs and services designed to strengthen the knowledge, skills, and values of librarianship.",
  },
  {
    icon: Globe,
    title: "Need-Based Services",
    text: "Support tailored to different kinds of libraries and institutional contexts across the country.",
  },
  {
    icon: Users,
    title: "Collaboration",
    text: "A working model built on workshops, consultation, partnerships, and professional exchange.",
  },
  {
    icon: Heart,
    title: "Fair Practice",
    text: "An emphasis on responsible, best-practice-oriented use of technology and professional standards.",
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

const sectionDark = "section-padding bg-[#0d1b3e]";

export default function About() {
  return (
    <PageLayout>
      <PageHeader
        tag="About Us"
        title="Our Story and Purpose"
        description="Official LIS Academy messaging adapted from the academy's public About and conference pages."
      />

      <section className={sectionDark}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Mission",
              text: "To spread the multidimensional utility and overall growth of librarianship through education, literature, research, publications, training, consultation, and collaboration.",
            },
            {
              icon: Eye,
              title: "Vision",
              text: "To become the best, active, and dynamic professional body by supporting LIS professionals with essential knowledge, skills, values, and innovative technology.",
            },
            {
              icon: Lightbulb,
              title: "Purpose",
              text: "To bridge LIS education and professional practice while helping libraries adopt state-of-the-art technology and better services.",
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(201,168,76,0.15)" }}>
                  <item.icon style={{ color: "#c9a84c" }} size={26} />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-white/55 leading-relaxed">{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="section-padding" style={{ background: "#091529" }}>
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#c9a84c]/40 text-[#c9a84c] bg-[#c9a84c]/10 mb-4">Our Values</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">What We Stand For</h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl border border-white/8 bg-white/4 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "rgba(201,168,76,0.13)" }}>
                    <item.icon style={{ color: "#c9a84c" }} size={24} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionDark}>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#c9a84c]/40 text-[#c9a84c] bg-[#c9a84c]/10 mb-4">Our Journey</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">History and Milestones</h2>
            </div>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10" />
            {timeline.map((item, i) => (
              <FadeIn key={item.year} delay={i * 0.1}>
                <div className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1.5 mt-2 z-10" style={{ background: "#c9a84c" }} />
                  <div className="pl-10 md:pl-0 md:w-1/2">
                    <span className="font-bold text-sm" style={{ color: "#c9a84c" }}>{item.year}</span>
                    <h3 className="font-serif text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-white/50 mt-1">{item.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "#091529" }}>
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#c9a84c]/40 text-[#c9a84c] bg-[#c9a84c]/10 mb-4">Leadership</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Who LIS Academy Serves</h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((person, i) => (
              <FadeIn key={person.name} delay={i * 0.1}>
                <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)" }}>
                    <Users style={{ color: "#c9a84c" }} size={30} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">{person.name}</h3>
                  <p className="text-sm font-medium mb-2" style={{ color: "#c9a84c" }}>{person.role}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{person.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionDark}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#c9a84c]/40 text-[#c9a84c] bg-[#c9a84c]/10 mb-4">Core Work Areas</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">How the Academy Contributes</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {advisors.map((advisor) => (
                <div key={advisor} className="px-5 py-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white/70">
                  <Award style={{ color: "#c9a84c" }} className="inline mr-2" size={14} />
                  {advisor}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
