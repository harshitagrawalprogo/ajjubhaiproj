import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Library, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const floatingCards = [
  { icon: BookOpen, label: "100+ Programs Conducted", delay: 0 },
  { icon: GraduationCap, label: "3700+ Hours on YouTube", delay: 0.2 },
  { icon: Library, label: "30+ IRINS Institutes", delay: 0.4 },
  { icon: Youtube, label: "Pan-India Reach", delay: 0.6 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/banner-video-1-1.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay to make text readable */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(13,27,62,0.82) 0%, rgba(13,27,62,0.72) 50%, rgba(13,27,62,0.90) 100%)",
          zIndex: 1,
        }}
      />

      {/* Additional subtle gold gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 70%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center" style={{ zIndex: 3 }}>

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#c9a84c]/40 text-[#c9a84c] bg-[#c9a84c]/10 backdrop-blur-sm">
            <BookOpen size={13} />
            India's Premier Library &amp; Information Science Platform
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          <span className="text-white">Learn. Inspire. </span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #f0d080 0%, #c9a84c 50%, #e8b84b 100%)" }}
          >
            Serve.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A professional Public Charitable Trust advancing the Library &amp; Information Science profession through world-class training, technology implementation, and research across India.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <Button
            asChild
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-xl text-[#0d1b3e] shadow-lg shadow-[#c9a84c]/30 hover:shadow-[#c9a84c]/50 transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #f0d080 0%, #c9a84c 100%)" }}
          >
            <Link to="/programs">
              Explore Programs
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-xl bg-white/10 border border-white/25 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
        </motion.div>

        {/* Floating stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          {floatingCards.map(({ icon: Icon, label, delay }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 + delay }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border border-white/15 bg-white/8 backdrop-blur-md cursor-default"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.18)" }}
              >
                <Icon size={20} className="text-[#c9a84c]" />
              </div>
              <span className="text-white/80 text-xs font-medium text-center leading-tight">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
