import { getSection, setSection } from "./contentDb";

export interface CarouselSlide {
  id: string;
  image_url: string;
  title: string;
  sort_order: number;
}

function parseSlides(value: string | undefined): CarouselSlide[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed)
      ? parsed.map((slide, index) => ({
          id: String(slide.id || crypto.randomUUID()),
          image_url: String(slide.image_url || ""),
          title: String(slide.title || ""),
          sort_order: Number(slide.sort_order ?? index * 10),
        }))
      : [];
  } catch {
    return [];
  }
}

export async function fetchCarouselSlides(): Promise<CarouselSlide[]> {
  const section = await getSection("carousel");
  return parseSlides(section.slides_json)
    .filter((slide) => slide.image_url.trim())
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveCarouselSlides(slides: CarouselSlide[]): Promise<CarouselSlide[]> {
  await setSection("carousel", { slides_json: JSON.stringify(slides) });
  return slides;
}
