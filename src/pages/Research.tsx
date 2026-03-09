import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
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
  "IFLA", "OCLC", "British Library", "National Library of India", "CSIR-NISCPR", "UGC-INFLIBNET", "IIT Libraries Network", "DELNET",
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
      <PageHeader tag="Research" title="Advancing Knowledge" description="Explore our research publications, ongoing projects, and global collaborations." />

      {/* Publications */}
      <section className="section-padding bg-background">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-secondary" size={20} />
                  <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Publications</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Research Repository</h2>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {filteredPublications.map((pub, i) => (
              <FadeIn key={pub.title} delay={i * 0.05}>
                <div className="p-5 rounded-xl bg-card border border-border hover-lift flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground">{pub.authors} · <span className="text-secondary">{pub.journal}</span> · {pub.year}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 self-start md:self-center">
                    <ExternalLink size={14} /> View
                  </Button>
                </div>
              </FadeIn>
            ))}
            {filteredPublications.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No publications found matching your search.</p>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-2 mb-2">
              <Microscope className="text-secondary" size={20} />
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Projects</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10">Research Projects</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <FadeIn key={project.title} delay={i * 0.1}>
                <div className="p-6 rounded-xl bg-card border border-border hover-lift h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground">{project.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      project.status === "Ongoing" ? "bg-secondary/15 text-secondary" : "bg-accent text-accent-foreground"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborations */}
      <section className="section-padding bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Handshake className="text-secondary" size={20} />
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Collaborations</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10">Global Research Partners</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              {collaborators.map((c) => (
                <span key={c} className="px-5 py-3 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-secondary/30 transition-colors">
                  {c}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Resources CTA */}
      <section className="section-padding bg-gradient-navy text-center">
        <FadeIn>
          <Database className="text-secondary mx-auto mb-4" size={32} />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Research Resources</h2>
          <p className="text-primary-foreground/60 text-lg max-w-xl mx-auto mb-8">
            Access our growing database of research tools, datasets, and methodological guides.
          </p>
          <Button variant="gold" size="lg">
            Access Resources <ArrowRight size={16} />
          </Button>
        </FadeIn>
      </section>
    </PageLayout>
  );
}
