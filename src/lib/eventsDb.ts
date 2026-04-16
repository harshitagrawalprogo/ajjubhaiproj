const EVENTS_KEY = "lisacademy_events_v2";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  speakers: string[];
  agenda: string[];
}

const defaultEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "1st LIS Academy Conference",
    date: "December 21-23, 2017",
    location: "Gandhi Bhavan, Kumara Park, Bengaluru",
    type: "Conference",
    description: "The inaugural LIS Academy conference was organized with public library and scientometrics partners around the larger idea of information for all and the public role of libraries.",
    speakers: ["Department of Public Libraries", "Raja Rammohun Roy Library Foundation", "Institute of Scientometrics"],
    agenda: ["Inaugural conference sessions", "Public library themes", "Infographics and scientometrics discussions", "Technical presentations"],
  },
  {
    id: "evt-2",
    title: "2nd LIS Academy Conference on Innovations in Libraries",
    date: "June 6-8, 2019",
    location: "Visvesvaraya Technological University, Belagavi",
    type: "Conference",
    description: "This edition focused on how innovation and emerging technologies are reshaping libraries, information access, LIS education, and service delivery.",
    speakers: ["Prof. Kavi Mahesh", "Dr. S. M. Pujar", "Dr. Buddhi Prakash Chauhan", "Delegates from India and Bangladesh"],
    agenda: ["Conference theme sessions", "Library technology trends", "Innovations in library technologies", "Technology-based library services"],
  },
  {
    id: "evt-3",
    title: "LISA Distinguished Lecture Series",
    date: "Launched on November 14, 2020",
    location: "Online",
    type: "Lecture Series",
    description: "A recurring lecture forum created to expose LIS professionals to contemporary trends, leadership perspectives, and emerging technologies in librarianship.",
    speakers: ["Prof. P. Balaram", "Invited academic and research leaders"],
    agenda: ["Distinguished keynote lecture", "Contemporary LIS issues", "Leadership and management perspectives", "Best-practice sharing"],
  },
  {
    id: "evt-4",
    title: "Research Productivity Workshops",
    date: "Conducted year-round",
    location: "Higher education institutions across India",
    type: "Workshop",
    description: "Workshops and seminars aimed at teachers and research scholars to improve research and publication productivity.",
    speakers: ["Institutional faculty groups", "Research scholars", "LIS Academy resource persons"],
    agenda: ["Research visibility sessions", "Publication productivity support", "Seminar discussions", "Institutional consultation"],
  },
  {
    id: "evt-5",
    title: "Accreditation and Ranking Support Sessions",
    date: "Scheduled with partner institutions",
    location: "On-site and consultative",
    type: "Consultancy",
    description: "Focused support for institutions preparing for NBA, NAAC, and NIRF with special attention to library and research performance areas.",
    speakers: ["Institutional quality teams", "LIS Academy consultants"],
    agenda: ["Readiness review", "Documentation support", "Metric interpretation", "Improvement planning"],
  },
  {
    id: "evt-6",
    title: "Library Technology Implementation Clinics",
    date: "By project requirement",
    location: "Partner libraries",
    type: "Implementation",
    description: "Practical sessions around Koha, DSpace, EPrints, IRINS, and related system adoption in libraries and institutions.",
    speakers: ["Implementation teams", "Library administrators"],
    agenda: ["Requirement mapping", "Platform orientation", "Workflow setup", "Adoption and support planning"],
  },
];

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(defaultEvents));
      return defaultEvents;
    }
    return JSON.parse(raw);
  } catch {
    return defaultEvents;
  }
}

export async function saveEvent(event: Omit<EventItem, "id"> | EventItem): Promise<EventItem> {
  const events = await fetchEvents();

  if ("id" in event && event.id) {
    const index = events.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      events[index] = event as EventItem;
    } else {
      events.push(event as EventItem);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    return event as EventItem;
  } else {
    const newEvent: EventItem = { ...event, id: `evt-${Date.now()}` };
    events.push(newEvent);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    return newEvent;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const events = await fetchEvents();
  const filtered = events.filter((e) => e.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered));
}
