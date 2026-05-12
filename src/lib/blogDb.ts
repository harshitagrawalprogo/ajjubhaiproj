import { getSection, setSection } from "./contentDb";

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  text: string;
  image_url: string;
  published_at: string;
}

function parsePosts(value: string | undefined): BlogPost[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed)
      ? parsed.map((post) => ({
          id: String(post.id || crypto.randomUUID()),
          title: String(post.title || ""),
          author: String(post.author || ""),
          text: String(post.text || ""),
          image_url: String(post.image_url || ""),
          published_at: String(post.published_at || new Date().toISOString()),
        }))
      : [];
  } catch {
    return [];
  }
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const section = await getSection("blog");
  return parsePosts(section.posts_json).sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<BlogPost[]> {
  await setSection("blog", { posts_json: JSON.stringify(posts) });
  return posts;
}
