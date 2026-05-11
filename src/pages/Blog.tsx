import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";

export default function Blog() {
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
      <section className="section-padding bg-slate-50 min-h-[40vh] flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p className="text-xl">Coming Soon</p>
        </div>
      </section>
    </PageLayout>
  );
}
