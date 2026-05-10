import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { FileText, Microscope, Handshake, Database, Search, ExternalLink, ArrowRight } from "lucide-react";

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

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Research() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPublications = publications.filter(
    (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
      <PageHeader tag="Research" title="Advancing Knowledge" description="Explore our research publications, ongoing projects, and professional collaborations." />

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

      {/* Resources CTA */}
      <section className="section-padding text-center" style={{ background: "#091529" }}>
        <FadeIn>
          <Database style={{ color: "#c9a84c" }} className="mx-auto mb-4" size={32} />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Research Resources</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            Access our growing database of research tools, datasets, and methodological guides.
          </p>
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#0d1b3e] hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-[#c9a84c]/20"
            style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
          >
            Access Resources <ArrowRight size={16} />
          </button>
        </FadeIn>
      </section>
    </PageLayout>
  );
}
