import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  tag: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({ tag, title, description, children }: Props) {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      {/* Deep navy base */}
      <div className="absolute inset-0 bg-[#0d1b3e]" />

      {/* Radial glow overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(201,168,76,0.16) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(26,47,94,0.9) 0%, transparent 60%)",
        }}
      />

      {/* Bokeh orbs */}
      {[
        { w: 420, h: 420, l: "-6%", t: "0%", dur: 9 },
        { w: 300, h: 300, l: "65%", t: "-15%", dur: 12 },
        { w: 220, h: 220, l: "75%", t: "60%", dur: 10 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.w,
            height: orb.h,
            left: orb.l,
            top: orb.t,
            background:
              i === 0
                ? "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(100,140,220,0.08) 0%, transparent 70%)",
          }}
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {tag && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#c9a84c]/40 text-[#c9a84c] bg-[#c9a84c]/10 mb-5"
          >
            {tag}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
