import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, CheckCircle, CreditCard, Download, Heart, ImagePlus, Lock, LogOut, Mail, Phone, Printer, Send, User, Building2, MapPin, SlidersHorizontal } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Link } from "react-router-dom";
import {
  DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE,
  LIFE_CERTIFICATE_TEMPLATE_VERSION,
  generateCertificate,
  generateIdCard,
  generateLifeCertificateDraft,
  normalizeLifeCertificateEditorState,
  printImage,
} from "@/lib/certificateGenerator";
import {
  MEMBERSHIP_TIERS,
  getCurrentMember,
  loginMember,
  logoutMember,
  registerMember,
  saveMemberCertificate,
  saveMemberCertificateDraft,
} from "@/lib/membershipDb";
import type { LifeCertificateEditorState, Member, MembershipTier } from "@/lib/membershipTypes";

const LIFE_CERTIFICATE_CANVAS_WIDTH = 2000;
const LIFE_CERTIFICATE_CANVAS_HEIGHT = 1414;

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
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

function buildPreviewPhotoUrl(file: File | null, onReady: (value?: string) => void) {
  if (!file) {
    onReady(undefined);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => onReady(String(reader.result));
  reader.onerror = () => onReady(undefined);
  reader.readAsDataURL(file);
}

export function MembershipContent({ initialTier = "life", autoScroll = false }: { initialTier?: MembershipTier; autoScroll?: boolean }) {
  const [activeTab, setActiveTab] = useState<"register" | "login" | "dashboard">("register");
  const [form, setForm] = useState<RegistrationForm>({ ...initialForm, membership_tier: initialTier });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [registrationPhotoPreview, setRegistrationPhotoPreview] = useState<string | undefined>(undefined);
  const [member, setMember] = useState<Member | null>(null);
  const [loadingMember, setLoadingMember] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [logining, setLogining] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [savingCertificate, setSavingCertificate] = useState(false);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [error, setError] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [draftPreviewUrl, setDraftPreviewUrl] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [idCardFront, setIdCardFront] = useState<string | null>(null);
  const [idCardBack, setIdCardBack] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<LifeCertificateEditorState>(DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE);
  const [hasDownloadedFinalCertificate, setHasDownloadedFinalCertificate] = useState(false);
  const finalizingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForm((f) => ({ ...f, membership_tier: initialTier }));
  }, [initialTier]);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [autoScroll]);

  useEffect(() => {
    getCurrentMember().then((current) => {
      if (current) {
        setMember(current);
        setActiveTab("dashboard");
      }
      setLoadingMember(false);
    });
  }, []);

  useEffect(() => {
    setCertificateUrl(member?.certificate_data_url || null);
    setDraftPreviewUrl(member?.certificate_draft_data_url || null);
    setEditorState(normalizeLifeCertificateEditorState(member?.certificate_editor_state));
  }, [member]);

  useEffect(() => {
    if (!member || member.membership_tier !== "life" || activeTab !== "dashboard") return;
    let cancelled = false;

    const refreshPreview = async () => {
      try {
        const preview = await generateLifeCertificateDraft(member, editorState);
        if (!cancelled) setDraftPreviewUrl(preview);
      } catch {
        if (!cancelled) setError("Failed to render the certificate draft.");
      }
    };

    refreshPreview();
    return () => {
      cancelled = true;
    };
  }, [activeTab, editorState, member]);

  useEffect(() => {
    if (!member || member.status !== "approved" || activeTab !== "dashboard") return;
    const hasCurrentCertificate = Boolean(member.certificate_data_url) && member.certificate_template_version === LIFE_CERTIFICATE_TEMPLATE_VERSION;
    if (hasCurrentCertificate || finalizingRef.current) return;

    let cancelled = false;
    const finalizeCertificate = async () => {
      finalizingRef.current = true;
      setSavingCertificate(true);
      setError("");
      try {
        const finalCertificate = await generateCertificate(
          member,
          member.membership_tier === "life" ? { editorState: member.certificate_editor_state } : undefined,
        );
        if (cancelled) return;
        setCertificateUrl(finalCertificate);
        const saved = await saveMemberCertificate(finalCertificate);
        if (!cancelled) {
          setMember((current) => current ? {
            ...current,
            certificate_data_url: finalCertificate,
            certificate_template_version: saved.certificate_template_version,
          } : current);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to prepare the final membership certificate.");
        }
      } finally {
        finalizingRef.current = false;
        setSavingCertificate(false);
      }
    };

    finalizeCertificate();
    return () => {
      cancelled = true;
    };
  }, [activeTab, member]);

  const selectedTier = useMemo(
    () => MEMBERSHIP_TIERS.find((tier) => tier.value === form.membership_tier),
    [form.membership_tier],
  );

  const registrationPreviewMember = useMemo<Member>(() => ({
    id: "preview-member",
    application_id: "APP/PREVIEW",
    membership_id: "LISA/PREVIEW",
    name: form.name || "MEMBER NAME",
    email: form.email || "member@example.com",
    phone: form.phone || "9876543210",
    category: form.category || "Librarian / Library Staff",
    custom_detail: form.custom_detail || [form.designation, form.institution].filter(Boolean).join(", ") || "Librarian, LIS Academy, Bengaluru",
    designation: form.designation || "Librarian",
    institution: form.institution || "LIS Academy",
    address: form.address || "Preview address",
    city: form.city || "Bengaluru",
    state: form.state || "Karnataka",
    pincode: form.pincode || "560054",
    membership_tier: form.membership_tier,
    status: "pending",
    photo_data_url: registrationPhotoPreview,
    created_at: new Date().toISOString(),
    issue_date: new Date().toISOString(),
  }), [form, registrationPhotoPreview]);

  const updateField = (key: keyof RegistrationForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRegistering(true);
    try {
      const photo_data_url = await fileToDataUrl(photoFile);
      const certificate_draft_data_url = form.membership_tier === "life"
        ? await generateLifeCertificateDraft({ ...registrationPreviewMember, photo_data_url }, editorState)
        : undefined;
      const created = await registerMember({ ...form, photo_data_url, certificate_editor_state: editorState, certificate_draft_data_url });
      setMember(created);
      setActiveTab("dashboard");
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
      setIdCardFront(null);
      setIdCardBack(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLogining(false);
    }
  };

  const persistDraft = async (submitForReview: boolean) => {
    if (!member) return;
    setSavingDraft(true);
    setError("");
    try {
      const preview = await generateLifeCertificateDraft(member, editorState);
      setDraftPreviewUrl(preview);
      const response = await saveMemberCertificateDraft(preview, editorState, submitForReview);
      setMember((current) => current ? {
        ...current,
        certificate_draft_data_url: preview,
        certificate_editor_state: editorState,
        certificate_submitted_at: response.submitted_at || current.certificate_submitted_at,
      } : current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save the certificate draft.");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleGenerateDocuments = async () => {
    if (!member || member.status !== "approved") return;
    setGeneratingDocs(true);
    setError("");
    try {
      const idCard = await generateIdCard(member);
      setIdCardFront(idCard.front);
      setIdCardBack(idCard.back);
    } catch {
      setError("Failed to generate the membership ID card.");
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
    setDraftPreviewUrl(null);
    setIdCardFront(null);
    setIdCardBack(null);
    setEditorState(DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE);
    setRegistrationPhotoPreview(undefined);
  };

  const downloadImage = (url: string, filename: string, options?: { markDonationPrompt?: boolean }) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    if (options?.markDonationPrompt) {
      setHasDownloadedFinalCertificate(true);
    }
  };

  const memberTitle = member?.status === "approved" ? "Approved Member" : member?.status === "rejected" ? "Rejected Application" : "Pending Review";
  const memberIdentifier = member?.status === "approved" ? member.membership_id : (member?.application_id || member?.membership_id || "-");

  return (
    <div ref={containerRef}>
      <section className="relative overflow-hidden px-6 py-24" style={{ background: "linear-gradient(135deg, #050e24 0%, #0d1b3e 55%, #1a3060 100%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(201,168,76,0.16) 0%, transparent 65%)" }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-6">Membership Portal</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">LIS Academy Membership Registration and Login</h1>
          <p className="text-white/65 text-lg max-w-3xl mx-auto">Register, prepare your certificate draft on the raw Canva layout, submit it to admin, and download the approved final certificate after membership approval.</p>
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
                      </div>
                      {form.membership_tier === tier.value && <CheckCircle size={18} className="text-[#c9a84c]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6 bg-[#0d1b3e] text-white border border-white/10">
              <h3 className="font-serif text-xl mb-3">Canva Pipeline</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Application uses `rawwithoutsign.png` for the editable member draft.</li>
                <li>Members can adjust text and photo placement before submitting to admin.</li>
                <li>After approval, the final certificate uses `Copy of 1326 LISA Life Membership Certificates.png` and shows the membership number on login.</li>
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
                      <Field label="Full Name to Print *" icon={<User size={14} />}><input required value={form.name} onChange={(e) => updateField("name", e.target.value.toUpperCase())} className={inputCls} placeholder="HARSHIT KUMAR" /></Field>
                      <Field label="Email ID *" icon={<Mail size={14} />}><input required type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputCls} placeholder="member@example.com" /></Field>
                      <Field label="Mobile Number *" icon={<Phone size={14} />}><input required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputCls} placeholder="9876543210" /></Field>
                      <Field label="Password *" icon={<Lock size={14} />}><input required type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} className={inputCls} placeholder="Minimum 6 characters" /></Field>
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

                    <Field label="Specify Title / Institution / Place *"><input required value={form.custom_detail} onChange={(e) => updateField("custom_detail", e.target.value)} className={inputCls} placeholder="Librarian, XYZ College, Bengaluru" /></Field>
                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Designation *" icon={<User size={14} />}><input required value={form.designation} onChange={(e) => updateField("designation", e.target.value)} className={inputCls} placeholder="Librarian" /></Field>
                      <Field label="Institution *" icon={<Building2 size={14} />}><input required value={form.institution} onChange={(e) => updateField("institution", e.target.value)} className={inputCls} placeholder="LIS Academy" /></Field>
                    </div>
                    <Field label="Address *" icon={<MapPin size={14} />}><textarea required rows={3} value={form.address} onChange={(e) => updateField("address", e.target.value)} className={`${inputCls} resize-none`} placeholder="Street address" /></Field>

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

                    <Field label="Photograph (used for card and certificate) *" icon={<ImagePlus size={14} />}><input required type="file" accept="image/*" onChange={(e) => { const nextFile = e.target.files?.[0] || null; setPhotoFile(nextFile); buildPreviewPhotoUrl(nextFile, setRegistrationPhotoPreview); }} className={`${inputCls} file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700`} /></Field>

                    {form.membership_tier === "life" && (
                      <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-2 mb-4 font-semibold text-[#0d1b3e]"><SlidersHorizontal size={18} className="text-[#c9a84c]" /> Live Certificate Preview Before Signup</div>
                        <LifeCertificateEditor member={registrationPreviewMember} editorState={editorState} onChange={setEditorState} />
                        <div className="grid md:grid-cols-2 gap-4">
                          <RangeField label="Name X" value={editorState.nameX} min={950} max={1350} onChange={(value) => setEditorState((current) => ({ ...current, nameX: value }))} />
                          <RangeField label="Name Y" value={editorState.nameY} min={700} max={900} onChange={(value) => setEditorState((current) => ({ ...current, nameY: value }))} />
                          <RangeField label="Name Size" value={editorState.nameFontSize} min={36} max={68} onChange={(value) => setEditorState((current) => ({ ...current, nameFontSize: value }))} />
                          <RangeField label="Detail Y" value={editorState.detailY} min={780} max={930} onChange={(value) => setEditorState((current) => ({ ...current, detailY: value }))} />
                          <RangeField label="Detail Size" value={editorState.detailFontSize} min={28} max={58} onChange={(value) => setEditorState((current) => ({ ...current, detailFontSize: value }))} />
                          <RangeField label="Photo Size" value={editorState.photoRadius} min={120} max={220} onChange={(value) => setEditorState((current) => ({ ...current, photoRadius: value }))} />
                        </div>
                      </div>
                    )}

                    <div className="rounded-2xl border border-[#ead9a0] bg-[#fff9ed] px-4 py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[#0d1b3e]">Selected Membership</div>
                        <div className="text-sm text-[#c9a84c] font-medium">{selectedTier?.label}</div>
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
                    <Field label="Email, Application ID, or Membership ID *" icon={<Mail size={14} />}><input required value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} className={inputCls} placeholder="member@example.com or APP/1601 or LISA/1601" /></Field>
                    <Field label="Password *" icon={<Lock size={14} />}><input required type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={inputCls} placeholder="Your membership password" /></Field>
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
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center text-slate-600">Sign in to view your membership record and certificate workflow.</div>
                    ) : (
                      <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                              <div className="text-xs uppercase tracking-[0.3em] text-[#c9a84c] font-semibold mb-2">{memberTitle}</div>
                              <h2 className="font-serif text-3xl text-[#0d1b3e] mb-2">{member.name}</h2>
                              <p className="text-slate-600">{member.custom_detail || `${member.designation} • ${member.institution}`}</p>
                            </div>
                            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white">
                              <LogOut size={14} /> Logout
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
                            <Info label={member.status === "approved" ? "Membership ID" : "Application ID"} value={memberIdentifier} />
                            <Info label="Membership Tier" value={member.membership_tier} />
                            <Info label="Email" value={member.email} />
                            <Info label="Phone" value={member.phone} />
                            <Info label="Category" value={member.category || "-"} />
                            <Info label="Status" value={member.status} />
                          </div>
                        </div>

                        <DonatePrompt
                          title={member.status === "approved" ? "Support LIS Academy" : "Membership Submitted"}
                          description={member.status === "approved"
                            ? "Your membership is active. A contribution to LIS Academy helps us keep training, research, and community initiatives moving."
                            : "Your membership application has been created successfully. If you would like to support LIS Academy further, you can also contribute through the donation gateway."}
                        />

                        {member.membership_tier === "life" && member.status !== "approved" && (
                          <>
                            <div className="rounded-3xl border border-slate-200 bg-white p-5">
                              <div className="flex items-center gap-2 mb-4 font-semibold text-[#0d1b3e]"><SlidersHorizontal size={18} className="text-[#c9a84c]" /> Certificate Draft Controls</div>
                              <LifeCertificateEditor member={member} editorState={editorState} onChange={setEditorState} />
                              <div className="grid md:grid-cols-2 gap-4">
                                <RangeField label="Name X" value={editorState.nameX} min={950} max={1350} onChange={(value) => setEditorState((current) => ({ ...current, nameX: value }))} />
                                <RangeField label="Name Y" value={editorState.nameY} min={700} max={900} onChange={(value) => setEditorState((current) => ({ ...current, nameY: value }))} />
                                <RangeField label="Name Size" value={editorState.nameFontSize} min={36} max={68} onChange={(value) => setEditorState((current) => ({ ...current, nameFontSize: value }))} />
                                <RangeField label="Detail Y" value={editorState.detailY} min={780} max={930} onChange={(value) => setEditorState((current) => ({ ...current, detailY: value }))} />
                                <RangeField label="Detail Size" value={editorState.detailFontSize} min={28} max={58} onChange={(value) => setEditorState((current) => ({ ...current, detailFontSize: value }))} />
                                <RangeField label="Photo Size" value={editorState.photoRadius} min={120} max={220} onChange={(value) => setEditorState((current) => ({ ...current, photoRadius: value }))} />
                              </div>
                              <div className="mt-4 flex flex-wrap gap-3">
                                <ActionButton onClick={() => persistDraft(false)} icon={<Award size={14} />} label={savingDraft ? "Saving..." : "Save Draft"} />
                                <ActionButton onClick={() => persistDraft(true)} icon={<Send size={14} />} label={savingDraft ? "Submitting..." : "Submit to Admin"} secondary />
                              </div>
                              <p className="mt-4 text-sm text-slate-500">
                                {member.certificate_submitted_at ? `Submitted to admin on ${new Date(member.certificate_submitted_at).toLocaleString("en-IN")}.` : "Adjust the preview, save it, then submit it for admin approval."}
                              </p>
                            </div>

                            {draftPreviewUrl && (
                              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#0d1b3e]"><Award size={18} className="text-[#c9a84c]" /> Draft Certificate Preview</h3>
                                <img src={draftPreviewUrl} alt="Draft certificate" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                              </div>
                            )}
                          </>
                        )}

                        {member.status === "approved" && (
                          <>
                            <button type="button" onClick={handleGenerateDocuments} disabled={generatingDocs || savingCertificate} className="w-full rounded-2xl px-5 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #0d1b3e, #1a3060)" }}>
                              {generatingDocs ? "Generating ID Card..." : "Generate Membership ID Card"}
                            </button>

                            {savingCertificate && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">Preparing your approved certificate with membership number...</div>}

                            {certificateUrl && (
                              <div className="space-y-8">
                                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#0d1b3e]"><Award size={18} className="text-[#c9a84c]" /> Final Membership Certificate</h3>
                                  <img src={certificateUrl} alt="Certificate" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                                  <div className="mt-4 flex flex-wrap gap-3">
                                    <ActionButton onClick={() => downloadImage(certificateUrl, `certificate-${member.membership_id}.jpg`, { markDonationPrompt: true })} icon={<Download size={14} />} label="Download" />
                                    <ActionButton onClick={() => printImage(certificateUrl, "LIS Academy Certificate")} icon={<Printer size={14} />} label="Print" secondary />
                                  </div>
                                </div>

                                {(hasDownloadedFinalCertificate || certificateUrl) && (
                                  <DonatePrompt
                                    title="Please Donate Us"
                                    description="After downloading your final certificate, you can also support LIS Academy through the donation gateway."
                                  />
                                )}

                                {idCardFront && idCardBack && (
                                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#0d1b3e]"><CreditCard size={18} className="text-[#c9a84c]" /> Membership ID Card</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <img src={idCardFront} alt="ID Card Front" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                                      <img src={idCardBack} alt="ID Card Back" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                      <ActionButton onClick={() => downloadImage(idCardFront, `idcard-front-${member.membership_id}.png`)} icon={<Download size={14} />} label="Front PNG" />
                                      <ActionButton onClick={() => downloadImage(idCardBack, `idcard-back-${member.membership_id}.png`)} icon={<Download size={14} />} label="Back PNG" secondary />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
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
    </div>
  );
}

export default function MembershipPage() {
  return (
    <PageLayout>
      <MembershipContent />
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">{label}</div>
      <div className="font-medium text-slate-700">{value}</div>
    </div>
  );
}

function LifeCertificateEditor({
  member,
  editorState,
  onChange,
}: {
  member: Member;
  editorState: LifeCertificateEditorState;
  onChange: React.Dispatch<React.SetStateAction<LifeCertificateEditorState>>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragTarget, setDragTarget] = useState<"name" | "detail" | "photo" | null>(null);

  const startDrag = (target: "name" | "detail" | "photo") => (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    event.preventDefault();
    setDragTarget(target);
    event.currentTarget.setPointerCapture(event.pointerId);

    const move = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * LIFE_CERTIFICATE_CANVAS_WIDTH;
      const y = ((clientY - rect.top) / rect.height) * LIFE_CERTIFICATE_CANVAS_HEIGHT;
      onChange((current) => {
        if (target === "name") {
          return { ...current, nameX: clamp(x, 780, 1400), nameY: clamp(y, 690, 910) };
        }
        if (target === "detail") {
          return { ...current, detailX: clamp(x, 780, 1400), detailY: clamp(y, 760, 960) };
        }
        return { ...current, photoX: clamp(x, 180, 540), photoY: clamp(y, 760, 1160) };
      });
    };

    move(event.clientX, event.clientY);

    const handlePointerMove = (moveEvent: PointerEvent) => move(moveEvent.clientX, moveEvent.clientY);
    const handlePointerUp = () => {
      setDragTarget(null);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  };

  const name = member.name.trim().toUpperCase();
  const detail = member.custom_detail?.trim() || [member.designation, member.institution].filter(Boolean).join(", ");
  const photo = member.photo_data_url || member.photo_url;

  return (
    <div className="mb-5">
      <div className="mb-3 text-sm text-slate-500">Drag the highlighted items directly on the certificate to make minor shifts before submitting to admin.</div>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm touch-none select-none"
        style={{ aspectRatio: `${LIFE_CERTIFICATE_CANVAS_WIDTH} / ${LIFE_CERTIFICATE_CANVAS_HEIGHT}` }}
      >
        <img src="/membership/rawwithoutsign.png" alt="Raw certificate background" className="absolute inset-0 h-full w-full object-cover" draggable={false} />

        <div
          onPointerDown={startDrag("name")}
          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-lg border px-3 py-1 text-center font-bold uppercase shadow-sm ${dragTarget === "name" ? "cursor-grabbing border-[#0d1b3e] bg-[#0d1b3e]/15" : "border-[#c9a84c] bg-white/85"}`}
          style={{
            left: `${(editorState.nameX / LIFE_CERTIFICATE_CANVAS_WIDTH) * 100}%`,
            top: `${(editorState.nameY / LIFE_CERTIFICATE_CANVAS_HEIGHT) * 100}%`,
            color: "#1e2a8a",
            fontFamily: "Georgia, serif",
            fontSize: `${Math.max(14, editorState.nameFontSize / 2.8)}px`,
            maxWidth: "48%",
          }}
        >
          {name}
        </div>

        <div
          onPointerDown={startDrag("detail")}
          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-lg border px-3 py-1.5 text-center shadow-sm ${dragTarget === "detail" ? "cursor-grabbing border-[#0d1b3e] bg-[#0d1b3e]/15" : "border-[#c9a84c] bg-white/85"}`}
          style={{
            left: `${(editorState.detailX / LIFE_CERTIFICATE_CANVAS_WIDTH) * 100}%`,
            top: `${(editorState.detailY / LIFE_CERTIFICATE_CANVAS_HEIGHT) * 100}%`,
            color: "#2d2d2d",
            fontFamily: "Georgia, serif",
            fontSize: `${Math.max(12, editorState.detailFontSize / 2.8)}px`,
            maxWidth: "52%",
            lineHeight: 1.1,
          }}
        >
          {detail}
        </div>

        {photo && (
          <div
            onPointerDown={startDrag("photo")}
            className={`absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 shadow-md ${dragTarget === "photo" ? "cursor-grabbing border-[#0d1b3e]" : "cursor-grab border-white"}`}
            style={{
              left: `${(editorState.photoX / LIFE_CERTIFICATE_CANVAS_WIDTH) * 100}%`,
              top: `${(editorState.photoY / LIFE_CERTIFICATE_CANVAS_HEIGHT) * 100}%`,
              width: `${(editorState.photoRadius * 2 / LIFE_CERTIFICATE_CANVAS_WIDTH) * 100}%`,
              aspectRatio: "1 / 1",
            }}
          >
            <img src={photo} alt="Member preview" className="h-full w-full object-cover" draggable={false} />
          </div>
        )}
      </div>
    </div>
  );
}

function RangeField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700 mb-3">
        <span>{label}</span>
        <span className="text-slate-400">{Math.round(value)}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#c9a84c]" />
    </label>
  );
}

function ActionButton({ onClick, icon, label, secondary = false }: { onClick: () => void; icon: ReactNode; label: string; secondary?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5" style={secondary ? { background: "#e2e8f0", color: "#334155" } : { background: "#0d1b3e", color: "#fff" }}>
      {icon}
      {label}
    </button>
  );
}

function DonatePrompt({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-[#ead9a0] bg-[#fff9ed] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">
            <Heart size={16} /> {title}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <Link
          to="/donate"
          className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-[#0d1b3e] transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
        >
          Donate Us
        </Link>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
