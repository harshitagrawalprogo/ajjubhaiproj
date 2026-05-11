import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { getSection } from "@/lib/contentDb";

export default function Donate() {
  const [content, setContent] = useState({ headline: "Support LIS Academy", intro: "", note: "" });

  useEffect(() => {
    getSection("donate").then((data) => {
      setContent({
        headline: data.headline || "Support LIS Academy",
        intro: data.intro || "",
        note: data.note || "",
      });
    });
  }, []);

  return (
    <PageLayout>
      <PageHeader
        tag=""
        title={
          <>
            Donate Us
            <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl font-medium text-[#c9a84c]">
              {content.headline}
            </span>
          </>
        }
        description="Contribute to LIS Academy initiatives through the donation gateway."
      />

      <section className="section-padding bg-[#0d1b3e]">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#c9a84c]/15 px-4 py-2 text-sm font-semibold text-[#f0d080]">
                <Heart size={16} /> Support the mission
              </div>
              <h2 className="mt-6 font-serif text-3xl text-white">{content.headline}</h2>
              <p className="mt-4 text-base leading-8 text-white/70">{content.intro}</p>
              <div className="mt-6 rounded-3xl border border-white/10 bg-[#091529] p-6 text-white/70">
                <p>{content.note}</p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white p-8 flex flex-col items-center justify-center">
              <img
                src="/upi-qr.png"
                alt="LIS Academy UPI QR Code"
                className="w-full max-w-sm h-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
