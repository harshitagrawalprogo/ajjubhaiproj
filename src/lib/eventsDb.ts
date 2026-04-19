import { apiRequest, getAdminToken } from "./api";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  speakers: string[];
  agenda: string[];
  image_url?: string;
  registration_url?: string;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
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
    is_featured: true,
    sort_order: 10,
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
    is_featured: true,
    sort_order: 20,
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
    is_featured: true,
    sort_order: 30,
  },
];

function adminHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const response = await apiRequest<{ events: EventItem[] }>("/api/events");
    return response.events;
  } catch {
    return defaultEvents;
  }
}

export async function saveEvent(event: Omit<EventItem, "id"> | EventItem): Promise<EventItem> {
  const hasPersistedId = "id" in event && Boolean(event.id) && !String(event.id).startsWith("evt-");
  const response = await apiRequest<{ event: EventItem }>(hasPersistedId ? `/api/admin/events/${event.id}` : "/api/admin/events", {
    method: hasPersistedId ? "PUT" : "POST",
    headers: adminHeaders(),
    body: JSON.stringify(event),
  });
  return response.event;
}

export async function deleteEvent(id: string): Promise<void> {
  await apiRequest<void>(`/api/admin/events/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
}
