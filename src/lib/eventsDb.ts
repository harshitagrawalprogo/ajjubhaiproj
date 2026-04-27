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
  brochure_url?: string;
  gallery_url?: string;
  report_url?: string;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

function adminHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchEvents(): Promise<EventItem[]> {
  const response = await apiRequest<{ events: EventItem[] }>("/api/events");
  return response.events;
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
