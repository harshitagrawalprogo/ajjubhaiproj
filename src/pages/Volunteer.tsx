import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Award, CheckCircle, Download, HeartHandshake, Lock, Mail, Printer } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { applyForVolunteer, getCurrentMember, loginMember, logoutMember, saveVolunteerCertificate } from "@/lib/membershipDb";
import { generateVolunteerCertificate, printImage, VOLUNTEER_CERTIFICATE_TEMPLATE_VERSION } from "@/lib/certificateGenerator";
import type { Member } from "@/lib/membershipTypes";

export default function Volunteer() {
  const [member, setMember] = useState<Member | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [savingCertificate, setSavingCertificate] = useState(false);

  useEffect(() => {
    getCurrentMember().then((current) => {
      setMember(current);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setCertificateUrl(member?.volunteer_certificate_data_url || null);
  }, [member]);

  useEffect(() => {
    if (!member || member.volunteer_status !== "approved") return;
    const hasCurrentCertificate = Boolean(member.volunteer_certificate_data_url)
      && member.volunteer_certificate_template_version === VOLUNTEER_CERTIFICATE_TEMPLATE_VERSION;
    if (hasCurrentCertificate) return;

    let cancelled = false;
    const prepareCertificate = async () => {
      setSavingCertificate(true);
      setError("");
      try {
        const certificate = await generateVolunteerCertificate(member);
        if (cancelled) return;
        setCertificateUrl(certificate);
        const saved = await saveVolunteerCertificate(certificate);
        if (!cancelled) {
          setMember((current) => current ? {
            ...current,
            volunteer_certificate_data_url: certificate,
            volunteer_certificate_template_version: saved.volunteer_certificate_template_version,
          } : current);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to prepare volunteer certificate.");
      } finally {
        if (!cancelled) setSavingCertificate(false);
      }
    };

    prepareCertificate();
    return () => {
      cancelled = true;
    };
  }, [member]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setWorking(true);
    try {
      setMember(await loginMember(identifier, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setWorking(false);
    }
  };

  const handleApply = async () => {
    setError("");
    setWorking(true);
    try {
      setMember(await applyForVolunteer());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Volunteer application failed.");
    } finally {
      setWorking(false);
    }
  };

  const handleLogout = () => {
    logoutMember();
    setMember(null);
    setIdentifier("");
    setPassword("");
    setCertificateUrl(null);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const applied = member?.volunteer_status && member.volunteer_status !== "not_applied";

  return (
    <PageLayout>
      <section className="px-6 py-24" style={{ background: "linear-gradient(135deg, #050e24 0%, #0d1b3e 55%, #1a3060 100%)" }}>
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">
            Volunteer
          </span>
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">Apply as a LIS Academy Volunteer</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/65">
            Volunteer applications are available for registered members. Sign in with your membership account to apply.
          </p>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : !member ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Email, Application ID, or Membership ID" icon={<Mail size={14} />}>
                <input required value={identifier} onChange={(event) => setIdentifier(event.target.value)} className={inputCls} placeholder="member@example.com or LISA/1" />
              </Field>
              <Field label="Password" icon={<Lock size={14} />}>
                <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputCls} placeholder="Your membership password" />
              </Field>
              <button disabled={working} className="w-full rounded-2xl px-5 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #0d1b3e, #1a3060)" }}>
                {working ? "Signing In..." : "Login to Apply"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">{member.membership_id}</div>
                <h2 className="font-serif text-3xl text-[#0d1b3e]">{member.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{member.membership_tier} member</p>
                {member.volunteer_number && <p className="mt-2 text-sm font-semibold text-[#0d1b3e]">Volunteer No. {member.volunteer_number}</p>}
              </div>

              {applied ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
                  <div className="flex items-center gap-2 font-semibold"><CheckCircle size={18} /> Volunteer application submitted</div>
                  <p className="mt-2 text-sm">Status: {member.volunteer_status}</p>
                </div>
              ) : (
                <button type="button" onClick={handleApply} disabled={working} className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-[#0d1b3e] transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}>
                  <HeartHandshake size={18} /> {working ? "Submitting..." : "Apply for Volunteer"}
                </button>
              )}

              {member.volunteer_status === "approved" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#0d1b3e]"><Award size={18} className="text-[#c9a84c]" /> Volunteer Certificate</h3>
                  {savingCertificate && <p className="mb-4 text-sm text-slate-500">Preparing your volunteer certificate...</p>}
                  {certificateUrl && (
                    <>
                      <img src={certificateUrl} alt="Volunteer certificate" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button type="button" onClick={() => downloadImage(certificateUrl, `volunteer-certificate-${member.volunteer_number || member.membership_id}.jpg`)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0d1b3e]" style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}>
                          <Download size={14} /> Download
                        </button>
                        <button type="button" onClick={() => printImage(certificateUrl, "LIS Academy Volunteer Certificate")} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                          <Printer size={14} /> Print
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              <button type="button" onClick={handleLogout} className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Logout
              </button>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

function Field({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">{icon}{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition-all focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/15";
