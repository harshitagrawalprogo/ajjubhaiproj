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
    <section className="relative bg-gradient-navy pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block"
        >
          {tag}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary-foreground/60 text-lg max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
