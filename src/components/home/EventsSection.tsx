import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchEvents, type EventItem } from "@/lib/eventsDb";

export default function EventsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then((data) => {
      const featured = data.filter((event) => event.is_featured).slice(0, 4);
      setEvents(featured.length ? featured : data.slice(0, 4));
    }).catch(() => {
      setEvents([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

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

        {loading ? (
          <div className="rounded-[28px] border border-border bg-card p-8 text-sm text-muted-foreground">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[28px] border border-border bg-card p-8 text-sm text-muted-foreground">
            No events have been published yet. Add featured events from the admin portal to show them here.
          </div>
        ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {events.map((event, i) => (
            <motion.div
              key={event.id || event.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group overflow-hidden rounded-[28px] border border-border bg-card"
            >
              <div className="grid md:grid-cols-[220px,1fr]">
                <div className="bg-muted">
                  <img
                    src={event.image_url || "/logo.png"}
                    alt={event.title}
                    className="h-full min-h-[220px] w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground mb-4">
                    {event.type}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-3">{event.description}</p>
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
                  <div className="mt-5 flex flex-wrap gap-3">
                    {(event.brochure_url || event.registration_url) && (
                      <a href={event.brochure_url || event.registration_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        Brochure <ExternalLink size={14} />
                      </a>
                    )}
                    {event.gallery_url && (
                      <a href={event.gallery_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        Gallery <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
