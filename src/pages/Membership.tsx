import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, CheckCircle, CreditCard, Download, Lock, LogOut, Mail, Phone, Printer, User, Building2, MapPin, ImagePlus } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { generateCertificate, generateIdCard, printImage } from "@/lib/certificateGenerator";
import { MEMBERSHIP_TIERS, getCurrentMember, loginMember, logoutMember, registerMember } from "@/lib/membershipDb";
import type { Member, MembershipTier } from "@/lib/membershipTypes";

const MEMBER_CATEGORIES = [
  "Librarian / Library Staff",
  "LIS Teacher",
  "LIS Student",
  "LIS Research Scholar",
  "Retired LIS Professional",
  "Others",
] as const;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  category: string;
  custom_detail: string;
  designation: string;
  institution: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  membership_tier: MembershipTier;
}

const initialForm: RegistrationForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  category: "",
  custom_detail: "",
  designation: "",
  institution: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  membership_tier: "life",
};

async function fileToDataUrl(file: File | null) {
  if (!file) return undefined;
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState<"register" | "login" | "dashboard">("register");
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loadingMember, setLoadingMember] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [logining, setLogining] = useState(false);
  const [error, setError] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [idCardFront, setIdCardFront] = useState<string | null>(null);
  const [idCardBack, setIdCardBack] = useState<string | null>(null);
  const [generatingDocs, setGeneratingDocs] = useState(false);

  useEffect(() => {
    getCurrentMember().then((current) => {
      if (current) {
        setMember(current);
        setActiveTab("dashboard");
      }
      setLoadingMember(false);
    });
  }, []);

  const selectedTier = useMemo(
    () => MEMBERSHIP_TIERS.find((tier) => tier.value === form.membership_tier),
    [form.membership_tier],
  );

  const updateField = (key: keyof RegistrationForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRegistering(true);
    try {
      const photo_data_url = await fileToDataUrl(photoFile);
      const created = await registerMember({ ...form, photo_data_url });
      setMember(created);
      setActiveTab("dashboard");
      setCertificateUrl(null);
      setIdCardFront(null);
      setIdCardBack(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setRegistering(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLogining(true);
    try {
      const loggedIn = await loginMember(loginIdentifier, loginPassword);
      setMember(loggedIn);
      setActiveTab("dashboard");
      setCertificateUrl(null);
      setIdCardFront(null);
      setIdCardBack(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLogining(false);
    }
  };

  const handleGenerateDocuments = async () => {
    if (!member) return;
    setGeneratingDocs(true);
    setError("");
    try {
      const [certificate, idCard] = await Promise.all([
        generateCertificate(member),
        generateIdCard(member),
      ]);
      setCertificateUrl(certificate);
      setIdCardFront(idCard.front);
      setIdCardBack(idCard.back);
    } catch {
      setError("Failed to generate the certificate or ID card.");
    } finally {
      setGeneratingDocs(false);
    }
  };

  const handleLogout = () => {
    logoutMember();
    setMember(null);
    setActiveTab("login");
    setLoginIdentifier("");
    setLoginPassword("");
    setCertificateUrl(null);
    setIdCardFront(null);
    setIdCardBack(null);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <PageLayout>
      <section className="relative overflow-hidden px-6 py-24" style={{ background: "linear-gradient(135deg, #050e24 0%, #0d1b3e 55%, #1a3060 100%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(201,168,76,0.16) 0%, transparent 65%)" }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#c9a84c]/40 text-[#c9a84c] bg-[#c9a84c]/10 mb-6">
            Membership Portal
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">LIS Academy Membership Registration and Login</h1>
          <p className="text-white/65 text-lg max-w-3xl mx-auto">
            Register as a member, sign in with your LIS Academy account, and generate your membership certificate and ID card from one Neon-backed system.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr,1.5fr] gap-10">
          <div className="space-y-6">
            <div className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="font-serif text-2xl text-[#0d1b3e] mb-4">Membership Highlights</h2>
              <div className="space-y-4">
                {MEMBERSHIP_TIERS.map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => updateField("membership_tier", tier.value)}
                    className="w-full text-left rounded-2xl p-4 border transition-all"
                    style={{
                      borderColor: form.membership_tier === tier.value ? "#c9a84c" : "#e2e8f0",
                      background: form.membership_tier === tier.value ? "#fff9ed" : "#ffffff",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[#0d1b3e]">{tier.label}</div>
                        <div className="text-sm text-[#c9a84c] font-medium">{tier.fee}</div>
                      </div>
                      {form.membership_tier === tier.value && <CheckCircle size={18} className="text-[#c9a84c]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6 bg-[#0d1b3e] text-white border border-white/10">
              <h3 className="font-serif text-xl mb-3">Reference-Inspired Flow</h3>
              <p className="text-white/65 text-sm leading-relaxed mb-4">
                This new membership setup keeps the spirit of your sample generator: structured registration, member-specific documents, and a cleaner document workflow tied to a real database record.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Registration stores member profile details in Neon.</li>
                <li>Login works with email or membership ID plus password.</li>
                <li>Certificate and ID card are generated from the signed-in member profile.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
              {(["register", "login", "dashboard"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  disabled={tab === "dashboard" && !member && !loadingMember}
                  className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${activeTab === tab ? "bg-[#0d1b3e] text-[#f0d080]" : "text-slate-500"}`}
                >
                  {tab === "register" ? "Register" : tab === "login" ? "Login" : "My Membership"}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <AnimatePresence mode="wait">
                {activeTab === "register" && (
                  <motion.form key="register" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} onSubmit={handleRegister} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Full Name to Print *" icon={<User size={14} />}>
                        <input required value={form.name} onChange={(e) => updateField("name", e.target.value.toUpperCase())} className={inputCls} placeholder="HARSHIT KUMAR" />
                      </Field>
                      <Field label="Email ID *" icon={<Mail size={14} />}>
                        <input required type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputCls} placeholder="member@example.com" />
                      </Field>
                      <Field label="Mobile Number *" icon={<Phone size={14} />}>
                        <input required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputCls} placeholder="9876543210" />
                      </Field>
                      <Field label="Password *" icon={<Lock size={14} />}>
                        <input required type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} className={inputCls} placeholder="Minimum 6 characters" />
                      </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Category / Designation *">
                        <select required value={form.category} onChange={(e) => updateField("category", e.target.value)} className={inputCls}>
                          <option value="">Select category</option>
                          {MEMBER_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                        </select>
                      </Field>
                      <Field label="Membership Type *">
                        <select value={form.membership_tier} onChange={(e) => updateField("membership_tier", e.target.value as MembershipTier)} className={inputCls}>
                          {MEMBERSHIP_TIERS.map((tier) => <option key={tier.value} value={tier.value}>{tier.label}</option>)}
                        </select>
                      </Field>
                    </div>

                    <Field label="Specify Title / Institution / Place *">
                      <input required value={form.custom_detail} onChange={(e) => updateField("custom_detail", e.target.value)} className={inputCls} placeholder="Librarian, XYZ College, Bengaluru" />
                    </Field>

                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Designation *" icon={<User size={14} />}>
                        <input required value={form.designation} onChange={(e) => updateField("designation", e.target.value)} className={inputCls} placeholder="Librarian" />
                      </Field>
                      <Field label="Institution *" icon={<Building2 size={14} />}>
                        <input required value={form.institution} onChange={(e) => updateField("institution", e.target.value)} className={inputCls} placeholder="LIS Academy" />
                      </Field>
                    </div>

                    <Field label="Address *" icon={<MapPin size={14} />}>
                      <textarea required rows={3} value={form.address} onChange={(e) => updateField("address", e.target.value)} className={`${inputCls} resize-none`} placeholder="Street address" />
                    </Field>

                    <div className="grid md:grid-cols-3 gap-5">
                      <Field label="City *"><input required value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputCls} placeholder="Bengaluru" /></Field>
                      <Field label="State *">
                        <select required value={form.state} onChange={(e) => updateField("state", e.target.value)} className={inputCls}>
                          <option value="">Select state</option>
                          {INDIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </Field>
                      <Field label="PIN Code *"><input required value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} className={inputCls} placeholder="560054" /></Field>
                    </div>

                    <Field label="Photograph (used for card and certificate) *" icon={<ImagePlus size={14} />}>
                      <input required type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} className={`${inputCls} file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700`} />
                    </Field>

                    <div className="rounded-2xl border border-[#ead9a0] bg-[#fff9ed] px-4 py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[#0d1b3e]">Selected Membership</div>
                        <div className="text-sm text-[#c9a84c] font-medium">{selectedTier?.label} • {selectedTier?.fee}</div>
                      </div>
                      <CheckCircle size={18} className="text-[#c9a84c]" />
                    </div>

                    <button type="submit" disabled={registering} className="w-full rounded-2xl px-5 py-4 font-semibold text-[#0d1b3e] transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}>
                      {registering ? "Creating Membership..." : "Create Membership Account"}
                    </button>
                  </motion.form>
                )}

                {activeTab === "login" && (
                  <motion.form key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} onSubmit={handleLogin} className="space-y-5 max-w-xl mx-auto">
                    <Field label="Email or Membership ID *" icon={<Mail size={14} />}>
                      <input required value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} className={inputCls} placeholder="member@example.com or LISA/1601" />
                    </Field>
                    <Field label="Password *" icon={<Lock size={14} />}>
                      <input required type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={inputCls} placeholder="Your membership password" />
                    </Field>
                    <button type="submit" disabled={logining} className="w-full rounded-2xl px-5 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #0d1b3e, #1a3060)" }}>
                      {logining ? "Signing In..." : "Login to Membership Portal"}
                    </button>
                  </motion.form>
                )}

                {activeTab === "dashboard" && (
                  <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                    {loadingMember ? (
                      <p className="text-slate-500">Loading your membership profile...</p>
                    ) : !member ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center text-slate-600">
                        Sign in to view your membership record and generate your LIS Academy documents.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                              <div className="text-xs uppercase tracking-[0.3em] text-[#c9a84c] font-semibold mb-2">Approved Member</div>
                              <h2 className="font-serif text-3xl text-[#0d1b3e] mb-2">{member.name}</h2>
                              <p className="text-slate-600">{member.custom_detail || `${member.designation} • ${member.institution}`}</p>
                            </div>
                            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white">
                              <LogOut size={14} /> Logout
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
                            <Info label="Membership ID" value={member.membership_id} />
                            <Info label="Membership Tier" value={member.membership_tier} />
                            <Info label="Email" value={member.email} />
                            <Info label="Phone" value={member.phone} />
                            <Info label="Category" value={member.category || "-"} />
                            <Info label="Status" value={member.status} />
                          </div>
                        </div>

                        <button type="button" onClick={handleGenerateDocuments} disabled={generatingDocs} className="w-full rounded-2xl px-5 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #0d1b3e, #1a3060)" }}>
                          {generatingDocs ? "Generating Documents..." : "Generate LIS Academy Certificate and ID Card"}
                        </button>

                        {certificateUrl && idCardFront && idCardBack && (
                          <div className="space-y-8">
                            <div className="rounded-3xl border border-slate-200 bg-white p-5">
                              <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#0d1b3e]"><Award size={18} className="text-[#c9a84c]" /> Membership Certificate</h3>
                              <img src={certificateUrl} alt="Certificate" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                              <div className="mt-4 flex flex-wrap gap-3">
                                <ActionButton onClick={() => downloadImage(certificateUrl, `certificate-${member.membership_id}.png`)} icon={<Download size={14} />} label="Download" />
                                <ActionButton onClick={() => printImage(certificateUrl, "LIS Academy Certificate")} icon={<Printer size={14} />} label="Print" secondary />
                              </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-5">
                              <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#0d1b3e]"><CreditCard size={18} className="text-[#c9a84c]" /> Membership ID Card</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <img src={idCardFront} alt="ID Card Front" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                                <img src={idCardBack} alt="ID Card Back" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                              </div>
                              <div className="mt-4 flex flex-wrap gap-3">
                                <ActionButton onClick={() => downloadImage(idCardFront, `idcard-front-${member.membership_id}.png`)} icon={<Download size={14} />} label="Front PNG" />
                                <ActionButton onClick={() => downloadImage(idCardBack, `idcard-back-${member.membership_id}.png`)} icon={<Download size={14} />} label="Back PNG" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">{label}</div>
      <div className="font-medium text-slate-700">{value}</div>
    </div>
  );
}

function ActionButton({ onClick, icon, label, secondary = false }: { onClick: () => void; icon: React.ReactNode; label: string; secondary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
      style={secondary ? { background: "#e2e8f0", color: "#334155" } : { background: "#0d1b3e", color: "#fff" }}
    >
      {icon}
      {label}
    </button>
  );
}

const inputCls = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20";
