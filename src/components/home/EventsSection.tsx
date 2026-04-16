import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    title: "1st LIS Academy Conference",
    date: "December 21-23, 2017",
    location: "Gandhi Bhavan, Kumara Park",
    tag: "Conference",
  },
  {
    title: "2nd LIS Academy Conference on Innovations in Libraries",
    date: "June 6-8, 2019",
    location: "Visvesvaraya Technological University, Belagavi",
    tag: "Conference",
  },
  {
    title: "LISA Distinguished Lecture Series",
    date: "Launched November 14, 2020",
    location: "Online and blended academic forums",
    tag: "Lecture Series",
  },
  {
    title: "Institutional Workshops and Seminars",
    date: "Year-round",
    location: "Higher education institutions across India",
    tag: "Professional Development",
  },
];

export default function EventsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3 block">
              Events and Forums
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Conferences and Academic Platforms
            </h2>
          </div>
          <Button variant="heroOutline" size="sm" asChild>
            <a href="/events">View All Events <ArrowRight size={14} /></a>
          </Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 rounded-xl bg-card border border-border hover-lift"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
                {event.tag}
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4 leading-snug">
                {event.title}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
              </div>
              <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                Explore <ArrowRight size={14} />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
