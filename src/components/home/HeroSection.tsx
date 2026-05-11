import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = Array.from(
  { length: 20 },
  (_, i) => `/carousel/274dcbd2821daddd00bfa14414712b25-${i}.jpg`,
);

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length, paused]);

  const navigate = (delta: number) => {
    setCurrentIndex((prev) => (prev + delta + carouselImages.length) % carouselImages.length);
  };

  return (
    <section
      className="relative min-h-[calc(100vh-108px)] flex items-center justify-center overflow-hidden bg-[#0d1b3e]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade image layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        >
          <div className="absolute inset-0 p-4 md:p-8 lg:p-12">
            <img
              src={carouselImages[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(5,14,36,0.3) 0%, rgba(5,14,36,0.6) 100%)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Left arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} className="text-white" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => navigate(1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
        }}
        aria-label="Next slide"
      >
        <ChevronRight size={22} className="text-white" />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentIndex ? 32 : 8,
              height: 8,
              background: i === currentIndex
                ? "linear-gradient(90deg, #c9a84c, #f0d080)"
                : "rgba(255,255,255,0.3)",
              boxShadow: i === currentIndex ? "0 0 8px rgba(201,168,76,0.6)" : "none",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`progress-${currentIndex}`}
          className="absolute bottom-0 left-0 h-[3px] z-20"
          style={{ background: "linear-gradient(90deg, #c9a84c, #f0d080)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      )}

      {/* Pause indicator */}
      {paused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-xs text-white/40 tracking-widest uppercase"
        >
          ⏸ paused
        </motion.div>
      )}
    </section>
  );
}
