import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { fetchBlogPosts, type BlogPost } from "@/lib/blogDb";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <PageHeader
        tag=""
        title={
          <>
            Blog
            <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl font-medium text-[#c9a84c]">
              Insights &amp; Articles
            </span>
          </>
        }
        description="Read the latest updates, stories, and articles from the LIS Academy."
      />
      <section className="section-padding bg-slate-50 min-h-[40vh]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-center text-slate-500">Loading articles...</p>
          ) : posts.length === 0 ? (
            <div className="text-center text-slate-500">
              <p className="text-xl">Coming Soon</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="h-56 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">
                      {post.author || "LIS Academy"}
                    </p>
                    <h2 className="font-serif text-2xl font-bold text-[#0d1b3e]">
                      {post.title}
                    </h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {post.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
