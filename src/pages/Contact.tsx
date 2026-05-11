import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email"),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const contactInfo = [
  { icon: MapPin, label: "Address", value: "7/29, Vijayalakshmi Complex, 1st Main Road, 1st Phase, 2nd Stage, Gokul, Bengaluru â€“ 560054" },
  { icon: Mail, label: "Email", value: "lisacademyorg@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 9449679737" },
  { icon: Clock, label: "Hours", value: "Monâ€“Fri: 9:00 AM â€“ 6:00 PM IST" },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-white text-sm focus:outline-none transition-colors";
  const labelClass = "text-sm font-medium text-white/70 mb-1.5 block";

  return (
    <PageLayout>
      <PageHeader tag="Contact" title="Get in Touch" description="Have questions? We'd love to hear from you. Reach out to us anytime." />

      <section className="section-padding bg-[#0d1b3e]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <FadeIn>
                <h2 className="font-serif text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.15)" }}>
                        <item.icon style={{ color: "#c9a84c" }} size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.label}</div>
                        <div className="text-sm text-white/50">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="mt-10 rounded-xl h-48 flex items-center justify-center" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>ðŸ“ Bengaluru, Karnataka, India</span>
                </div>
              </FadeIn>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.1}>
                <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
                  <h2 className="font-serif text-2xl font-bold text-white mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Name</label>
                        <input
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Your name"
                          className={inputClass}
                          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                        />
                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="your@email.com"
                          className={inputClass}
                          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                        />
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Subject</label>
                      <input
                        value={form.subject}
                        onChange={(e) => updateField("subject", e.target.value)}
                        placeholder="How can we help?"
                        className={inputClass}
                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                      />
                      {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Message</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Tell us more..."
                        rows={5}
                        className={inputClass + " resize-none"}
                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                      />
                      {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-[#0d1b3e] hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-[#c9a84c]/20"
                      style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
                    >
                      Send Message <Send size={14} />
                    </button>
                  </form>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}


