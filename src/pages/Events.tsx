import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { fetchEvents, type EventItem } from "@/lib/eventsDb";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [calMonth, setCalMonth] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      if (data.length > 0) setSelectedEvent(0);
    }).catch(() => {
      setEvents([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <PageLayout>
      <PageHeader
        tag=""
        title={
          <>
            Events
            <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl font-medium text-[#c9a84c]">
              Conferences, Seminars and Special Lectures
            </span>
          </>
        }
        description="This page now reflects LIS Academy's published conference history and recurring professional formats through admin-managed event entries."
      />

      <section className="section-padding" style={{ background: "#091529" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-white">Activity Calendar</h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCalMonth(Math.max(0, calMonth - 1))}
                  disabled={calMonth === 0}
                  className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="flex items-center px-4 text-sm font-medium text-white min-w-[100px] justify-center">{months[calMonth]}</span>
                <button
                  onClick={() => setCalMonth(Math.min(11, calMonth + 1))}
                  disabled={calMonth === 11}
                  className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-3">
              {events.filter((e) => e.date.toLowerCase().includes(months[calMonth].toLowerCase())).length > 0 ? (
                events
                  .filter((e) => e.date.toLowerCase().includes(months[calMonth].toLowerCase()))
                  .map((event, index) => (
                    <button
                      key={event.id || event.title}
                      onClick={() => setSelectedEvent(index)}
                      className="w-full p-4 rounded-lg border border-white/10 bg-white/5 flex items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <span className="text-xs font-medium" style={{ color: "#c9a84c" }}>{event.type}</span>
                        <h3 className="font-semibold text-white text-sm">{event.title}</h3>
                        <p className="text-xs text-white/40">{event.date} - {event.location}</p>
                      </div>
                      <span className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/60">Open</span>
                    </button>
                  ))
              ) : (
                <p className="text-center text-white/40 py-6 text-sm">No mapped items for {months[calMonth]}. Conference history and recurring formats are listed below.</p>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-[#0d1b3e]">
        <div className="max-w-7xl mx-auto space-y-8">
          <FadeIn>
            <div>
              <span className="text-sm font-semibold tracking-widest uppercase mb-3 block" style={{ color: "#c9a84c" }}>All Events</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Conference History and Recurring Formats</h2>
            </div>
          </FadeIn>

          {loading ? (
            <div className="rounded-[42px] bg-[#f7f3f2] p-8 text-base text-slate-600">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="rounded-[42px] bg-[#f7f3f2] p-8 text-base text-slate-600">No events have been published yet. Use the admin portal to add them.</div>
          ) : events.map((event, i) => (
            <FadeIn key={event.id || event.title} delay={i * 0.05}>
              <div
                className="rounded-[42px] bg-[#f7f3f2] p-4 md:p-6 transition-all hover:scale-[1.01] cursor-pointer"
                onClick={() => setSelectedEvent(i)}
              >
                <div className="grid gap-6 md:grid-cols-[1.15fr,1fr,300px] md:items-center">
                  <div className="overflow-hidden rounded-[56px] bg-white shadow-sm">
                    <img
                      src={event.image_url || "/logo.png"}
                      alt={event.title}
                      className="h-[220px] w-full object-cover md:h-[360px]"
                    />
                  </div>

                  <div className="text-center px-2 md:px-4">
                    <div className="text-[clamp(22px,2.8vw,46px)] font-medium uppercase tracking-wide text-[#c04a10]">{event.title}</div>
                    <div className="mt-4 text-[clamp(34px,4vw,64px)] leading-none uppercase text-[#1f66d1]">{event.type}</div>
                    <div className="mt-6 text-[clamp(20px,2.6vw,40px)] uppercase text-[#111827]">{event.date}</div>
                    <div className="mt-3 flex items-center justify-center gap-2 text-slate-600 text-base md:text-lg">
                      <MapPin size={18} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 justify-center">
                    <EventLinkButton href={event.brochure_url || event.registration_url} label="Conference Brochure" />
                    <EventLinkButton href={event.gallery_url} label="Photo Gallery" />
                    <EventLinkButton href={event.report_url} label="Conference Report" />
                  </div>
                </div>

                {selectedEvent === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 grid gap-8 rounded-[30px] bg-white px-6 py-6 md:grid-cols-2"
                  >
                    <div>
                      <h4 className="font-semibold text-[#0d1b3e] text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Clock size={14} /> Agenda
                      </h4>
                      <ul className="space-y-2">
                        {event.agenda.map((item, idx) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "rgba(201,168,76,0.18)", color: "#c9a84c" }}>{idx + 1}</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0d1b3e] text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users size={14} /> Speakers
                      </h4>
                      <ul className="space-y-2">
                        {event.speakers.map((speaker) => (
                          <li key={speaker} className="text-sm text-slate-600">- {speaker}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

function EventLinkButton({ href, label }: { href?: string; label: string }) {
  const baseClass = "inline-flex min-h-[88px] items-center justify-center rounded-full border border-[#222] bg-white px-8 text-center text-[20px] md:text-[22px] text-[#171717] transition-all";
  if (!href) {
    return <div className={`${baseClass} opacity-50`}>{label}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${baseClass} hover:-translate-y-0.5`}>
      <span className="inline-flex items-center gap-2">{label} <ExternalLink size={18} /></span>
    </a>
  );
}
