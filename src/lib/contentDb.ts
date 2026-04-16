// ─────────────────────────────────────────────────────────────
// contentDb.ts  – localStorage-backed site content store
// ─────────────────────────────────────────────────────────────
const CONTENT_KEY = 'lisacademy_content';

export type ContentSection =
  | 'hero'
  | 'about'
  | 'contact'
  | 'social'
  | 'topbar';

export interface ContentItem {
  section: ContentSection;
  key: string;
  value: string;
}

const defaults: ContentItem[] = [
  // Hero
  { section: 'hero', key: 'headline', value: 'Learn. Inspire. Serve.' },
  { section: 'hero', key: 'subtitle', value: "A professional Public Charitable Trust advancing the Library & Information Science profession through world-class training, technology implementation, and research across India." },
  // About
  { section: 'about', key: 'description', value: "LIS Academy is India's Premier Library & Information Science Platform." },
  // Contact
  { section: 'contact', key: 'email', value: 'info@lisacademy.org' },
  { section: 'contact', key: 'phone', value: '080-35006965' },
  { section: 'contact', key: 'address', value: '7/29, Vijayalakshmi Complex, 1st Main Road, Gokul, Bengaluru – 560054' },
  // Social links
  { section: 'social', key: 'facebook', value: 'https://facebook.com/lisacademy' },
  { section: 'social', key: 'twitter', value: 'https://twitter.com/lisacademy' },
  { section: 'social', key: 'linkedin', value: 'https://linkedin.com/company/lisacademy' },
  { section: 'social', key: 'youtube', value: 'https://youtube.com/@lisacademy' },
  { section: 'social', key: 'instagram', value: 'https://instagram.com/lisacademy' },
  // Top bar
  { section: 'topbar', key: 'tagline', value: 'LEARN | INSPIRE | SERVE' },
];

function loadAll(): ContentItem[] {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return defaults;
    const stored: ContentItem[] = JSON.parse(raw);
    // Merge defaults for any missing keys
    const merged = [...defaults];
    stored.forEach(s => {
      const idx = merged.findIndex(d => d.section === s.section && d.key === s.key);
      if (idx !== -1) merged[idx] = s;
      else merged.push(s);
    });
    return merged;
  } catch {
    return defaults;
  }
}

function saveAll(items: ContentItem[]) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(items));
}

export function getContent(section: ContentSection, key: string): string {
  const all = loadAll();
  return all.find(i => i.section === section && i.key === key)?.value ?? '';
}

export function setContent(section: ContentSection, key: string, value: string) {
  const all = loadAll();
  const idx = all.findIndex(i => i.section === section && i.key === key);
  if (idx !== -1) all[idx].value = value;
  else all.push({ section, key, value });
  saveAll(all);
}

export function getSection(section: ContentSection): Record<string, string> {
  const all = loadAll();
  return all
    .filter(i => i.section === section)
    .reduce<Record<string, string>>((acc, i) => { acc[i.key] = i.value; return acc; }, {});
}

export function setSection(section: ContentSection, data: Record<string, string>) {
  Object.entries(data).forEach(([key, value]) => setContent(section, key, value));
}
