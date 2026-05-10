import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const stats = [
  { value: 10, suffix: "+", label: "Major Service Verticals" },
  { value: 3, suffix: "", label: <>Core Promises:<br />Learn, Inspire, Serve</>, link: "#tagline-section" },
  { value: 9, suffix: "+", label: "Published Conference Milestones", link: "/events" },
  { value: 100, suffix: "%", label: "Focused on LIS Profession Development" },
];

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-gradient-navy">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">
            Our Impact
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
            What LIS Academy Focuses On
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const innerContent = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`text-center ${stat.link ? "hover:scale-105 transition-transform" : ""}`}
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary mb-2 transition-colors">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
                </div>
                <p className="text-primary-foreground/60 text-sm md:text-base">{stat.label}</p>
              </motion.div>
            );

            if (stat.link) {
              if (stat.link.startsWith('#')) {
                return (
                  <a key={stat.label} href={stat.link} className="block group cursor-pointer">
                    {innerContent}
                  </a>
                );
              }
              return (
                <Link key={stat.label} to={stat.link} className="block group cursor-pointer">
                  {innerContent}
                </Link>
              );
            }

            return (
              <div key={stat.label}>
                {innerContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
