import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchEvents } from "@/lib/eventsDb";

const defaultEventImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2000&auto=format&fit=crop"
];

export default function HeroSection() {
  const [carouselImages, setCarouselImages] = useState<string[]>(defaultEventImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchEvents().then((events) => {
      const images = events
        .map(e => e.image_url)
        .filter((url): url is string => Boolean(url));
      
      if (images.length > 0) {
        // Use up to 3 images from events, pad with default if less than 3
        const finalImages = [...images].slice(0, 3);
        while (finalImages.length < 3) {
          finalImages.push(defaultEventImages[finalImages.length]);
        }
        setCarouselImages(finalImages);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden bg-[#0d1b3e]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        >
          <img
            src={carouselImages[currentImageIndex]}
            alt="Hero Carousel"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
