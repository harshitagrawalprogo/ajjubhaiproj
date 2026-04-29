import { useEffect, useMemo, useState } from "react";
import { Heart, IndianRupee, ExternalLink } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { getSection } from "@/lib/contentDb";

function buildDonationUrl(template: string, amount: number) {
  if (!template) return "";
  return template.includes("{amount}") ? template.replaceAll("{amount}", String(amount)) : `${template}${template.includes("?") ? "&" : "?"}amount=${amount}`;
}

export default function Donate() {
  const [content, setContent] = useState({ headline: "Support LIS Academy", intro: "", note: "" });
  const [amount, setAmount] = useState(500);
  const donationTemplate = (import.meta.env.VITE_DONATION_PAYMENT_URL_TEMPLATE || "").trim();

  useEffect(() => {
    getSection("donate").then((data) => {
      setContent({
        headline: data.headline || "Support LIS Academy",
        intro: data.intro || "",
        note: data.note || "",
      });
    });
  }, []);

  const donationUrl = useMemo(() => buildDonationUrl(donationTemplate, amount), [amount, donationTemplate]);

  return (
    <PageLayout>
      <PageHeader
        tag="Donate Us"
        title={content.headline}
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

            <div className="rounded-[32px] border border-white/10 bg-white p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">Donation Gateway</div>
              <div className="mt-5 text-5xl font-semibold text-[#0d1b3e]">Rs. {amount}</div>
              <p className="mt-3 text-sm text-slate-500">Amount can be selected only in multiples of Rs. 100.</p>

              <div className="mt-8">
                <label className="mb-3 block text-sm font-medium text-slate-700">Contribution Amount</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4">
                  <IndianRupee size={18} className="text-slate-400" />
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={amount}
                    onChange={(event) => setAmount(Math.max(100, Math.round(Number(event.target.value || 100) / 100) * 100))}
                    className="w-full bg-transparent text-lg font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[500, 1000, 2500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${amount === preset ? "border-[#c9a84c] bg-[#fff6df] text-[#0d1b3e]" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                    Rs. {preset}
                  </button>
                ))}
              </div>

              {donationUrl ? (
                <a
                  href={donationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-[#0d1b3e] transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
                >
                  Continue to Payment Gateway <ExternalLink size={16} />
                </a>
              ) : (
                <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                  Donation gateway is not configured yet. Set `VITE_DONATION_PAYMENT_URL_TEMPLATE` in the environment to enable payments.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
