import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Target, Eye, Lightbulb, Users, Award, BookOpen, Globe, Heart } from "lucide-react";

const timeline = [
  { year: "2008", title: "Foundation", text: "LIS Academy was established with a vision to transform library science education in India." },
  { year: "2012", title: "First National Conference", text: "Hosted the inaugural National Conference on Digital Libraries with 500+ attendees." },
  { year: "2016", title: "Research Wing", text: "Launched a dedicated research wing focusing on information retrieval and knowledge management." },
  { year: "2020", title: "Digital Transformation", text: "Pivoted to hybrid learning, reaching 10,000+ learners across the country." },
  { year: "2024", title: "Global Recognition", text: "Recognized by IFLA as a leading LIS training institution in South Asia." },
];

const leaders = [
  { name: "Prof. Anil Mehta", role: "Founder & Director", bio: "30+ years in library science. Former Head, Dept. of LIS, Delhi University." },
  { name: "Dr. Sunita Rao", role: "Academic Dean", bio: "Expert in digital curation and open access. Published 60+ research papers." },
  { name: "Dr. Vikram Singh", role: "Research Director", bio: "Specialist in AI-driven information retrieval and bibliometrics." },
  { name: "Ms. Kavita Joshi", role: "Head of Programs", bio: "Designed 25+ professional development programs for LIS professionals." },
];

const advisors = [
  "Prof. R.K. Sharma – IGNOU",
  "Dr. P. Nagabhushanam – INFLIBNET",
  "Prof. M. Krishnamurthy – ISI Bangalore",
  "Dr. S. Srinivasan – IIT Madras",
  "Prof. N. Laxman Rao – Osmania University",
  "Dr. A.R. Jha – NIT Rourkela",
];

const values = [
  { icon: BookOpen, title: "Academic Excellence", text: "Rigorous curriculum designed by leading scholars and practitioners." },
  { icon: Globe, title: "Global Perspective", text: "International collaborations bringing world-class knowledge to India." },
  { icon: Users, title: "Community First", text: "Building a supportive ecosystem for all information professionals." },
  { icon: Heart, title: "Inclusive Access", text: "Making quality LIS education accessible to all, regardless of background." },
];

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <PageLayout>
      <PageHeader tag="About Us" title="Our Story & Mission" description="Building the future of Library & Information Science in India since 2008." />

      {/* Mission, Vision, Purpose */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Mission", text: "To advance Library & Information Science through world-class training, impactful research, and a vibrant professional community." },
            { icon: Eye, title: "Vision", text: "To be the foremost institution shaping the future of information professionals globally." },
            { icon: Lightbulb, title: "Purpose", text: "To bridge the gap between traditional library science and modern information technology, empowering professionals for the digital age." },
          ].map((item, i) => (
            <FadeInSection key={item.title} delay={i * 0.1}>
              <div className="p-8 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5">
                  <item.icon className="text-primary" size={26} />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">Our Values</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">What We Stand For</h2>
            </div>
          </FadeInSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.1}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-4">
                    <item.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-background">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">Our Journey</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">History & Milestones</h2>
            </div>
          </FadeInSection>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            {timeline.map((item, i) => (
              <FadeInSection key={item.year} delay={i * 0.1}>
                <div className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-secondary -translate-x-1.5 mt-2 z-10" />
                  <div className="pl-10 md:pl-0 md:w-1/2">
                    <span className="text-secondary font-bold text-sm">{item.year}</span>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.text}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">Leadership</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h2>
            </div>
          </FadeInSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((person, i) => (
              <FadeInSection key={person.name} delay={i * 0.1}>
                <div className="p-6 rounded-xl bg-card border border-border hover-lift text-center">
                  <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                    <Users className="text-primary" size={30} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">{person.name}</h3>
                  <p className="text-secondary text-sm font-medium mb-2">{person.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{person.bio}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">Advisory Board</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Guided by Experts</h2>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.2}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {advisors.map((advisor) => (
                <div key={advisor} className="px-5 py-4 rounded-lg bg-card border border-border text-sm text-foreground">
                  <Award className="text-secondary inline mr-2" size={14} />
                  {advisor}
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>
    </PageLayout>
  );
}
