import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Search, ExternalLink, ArrowRight, GraduationCap, FlaskConical, Wrench, Award, Clock, Users, CheckCircle, FileText, Microscope, Handshake, Database, BookOpen, Library, Globe } from "lucide-react";

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

const publications = [
  { title: "AI-Driven Information Retrieval in Academic Libraries", authors: "Dr. V. Singh, Dr. S. Rao", journal: "Journal of Information Science", year: 2025 },
  { title: "Digital Preservation Strategies for Indian Heritage Collections", authors: "Prof. A. Mehta, Ms. K. Joshi", journal: "Library Management Quarterly", year: 2024 },
  { title: "Open Access Adoption in South Asian Universities", authors: "Dr. S. Rao, Dr. P. Kumar", journal: "Intl. Journal of Digital Libraries", year: 2024 },
  { title: "Bibliometric Analysis of LIS Research in India (2010–2023)", authors: "Dr. V. Singh", journal: "Scientometrics Review", year: 2023 },
  { title: "Knowledge Management Practices in Corporate Libraries", authors: "Ms. K. Joshi, Dr. R. Sharma", journal: "Knowledge Organization", year: 2023 },
  { title: "User Experience Design for Library Portals", authors: "Dr. S. Rao", journal: "Journal of Academic Librarianship", year: 2022 },
];

const projects = [
  { title: "National Digital Heritage Archive", status: "Ongoing", description: "Creating a comprehensive digital repository of India's library heritage and manuscripts." },
  { title: "AI-Powered Cataloging System", status: "Ongoing", description: "Developing machine learning models for automated metadata generation and cataloging." },
  { title: "Open Access Repository Network", status: "Completed", description: "Built a federated network of institutional repositories across 30+ universities." },
  { title: "Information Literacy Framework", status: "Completed", description: "Designed a national framework for information literacy education in higher education." },
];

const collaborators = [
  "Academic Institutions",
  "National Professional Associations",
  "International Professional Associations",
  "Government Bodies",
];

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

function ProgramsContent() {
  return (
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
  );
}

function ResearchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPublications = publications.filter(
    (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0d1b3e]">
      {/* Publications */}
      <section className="section-padding bg-[#0d1b3e]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText style={{ color: "#c9a84c" }} size={20} />
                  <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#c9a84c" }}>Publications</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Research Repository</h2>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/8 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {filteredPublications.map((pub, i) => (
              <FadeIn key={pub.title} delay={i * 0.05}>
                <div className="p-5 rounded-xl border border-white/10 bg-white/5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{pub.title}</h3>
                    <p className="text-sm text-white/50">{pub.authors} · <span style={{ color: "#c9a84c" }}>{pub.journal}</span> · {pub.year}</p>
                  </div>
                  <button className="shrink-0 self-start md:self-center flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                    <ExternalLink size={14} /> View
                  </button>
                </div>
              </FadeIn>
            ))}
            {filteredPublications.length === 0 && (
              <p className="text-center text-white/40 py-8">No publications found matching your search.</p>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section-padding" style={{ background: "#091529" }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-2 mb-2">
              <Microscope style={{ color: "#c9a84c" }} size={20} />
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#c9a84c" }}>Projects</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-10">Research Projects</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <FadeIn key={project.title} delay={i * 0.1}>
                <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg font-semibold text-white">{project.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      project.status === "Ongoing"
                        ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                        : "bg-white/10 text-white/60"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">{project.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborations */}
      <section className="section-padding bg-[#0d1b3e] text-center">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Handshake style={{ color: "#c9a84c" }} size={20} />
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#c9a84c" }}>Collaborations</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Collaborative Professional Network</h2>
            <p className="text-white/55 text-lg max-w-3xl mx-auto leading-relaxed mb-10">
              The LIS Academy actively collaborates with diverse stakeholders, including academic institutions, national and international professional associations, and government bodies, to drive innovation and professional growth in the library sector.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              {collaborators.map((c) => (
                <span key={c} className="px-5 py-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white/60 hover:text-white hover:border-[#c9a84c]/40 transition-colors">
                  {c}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function ProductsContent() {
  return (
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
  );
}

export default function ResearchSupport() {
  const [activeTab, setActiveTab] = useState("programs");

  const tabs = [
    { id: "programs", label: "Programs" },
    { id: "products", label: "Products" },
  ];

  return (
    <PageLayout>
      <PageHeader
        tag="Program"
        title={
          <>
            Research Support
            <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl font-medium text-[#c9a84c]">
              Integrated Learning & Innovation
            </span>
          </>
        }
        description="Explore our training programs, research initiatives, and library technology products."
      />

      <section className="pt-12 pb-6 bg-[#0d1b3e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-white/10 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-t-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/10 text-[#c9a84c] border-b-2 border-[#c9a84c]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "programs" && <ProgramsContent />}
          {activeTab === "products" && <ProductsContent />}
        </motion.div>
      </AnimatePresence>
    </PageLayout>
  );
}
