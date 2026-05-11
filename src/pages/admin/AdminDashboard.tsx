import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Settings, LogOut, Globe,
  Phone, Mail, MapPin, Youtube, Facebook, Twitter,
  Linkedin, Instagram, Save, ChevronRight, Menu, X,
  CalendarDays, Plus, Trash2, Edit2, Image, type LucideIcon
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getDefaultSection, getSection, setSection } from "@/lib/contentDb";
import { getAllMembers, updateMemberStatus, deleteMember } from "@/lib/membershipDb";
import { fetchEvents, saveEvent, deleteEvent, type EventItem } from "@/lib/eventsDb";
import { fetchDocumentTemplates, saveDocumentTemplate, type DocumentTemplate } from "@/lib/documentTemplates";
import type { Member } from "@/lib/supabase";

type Tab = "dashboard" | "members" | "events" | "content" | "social" | "templates" | "programs_research";

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  const handleLogout = () => { logout(); navigate("/admin"); };

  const navItems: { id: Tab; label: string; Icon: LucideIcon }[] = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "members", label: "Members", Icon: Users },
    { id: "events", label: "Events CMS", Icon: CalendarDays },
    { id: "programs_research", label: "Program & Research", Icon: Globe },
    { id: "content", label: "Site Content", Icon: Globe },
    { id: "social", label: "Social Links", Icon: Settings },
    { id: "templates", label: "Templates", Icon: Image },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#080f20", color: "#e8e0d0" }}>
      {/* ── Sidebar ── */}
      <aside
        className="flex-shrink-0 flex flex-col transition-all duration-300"
        style={{
          width: sidebarOpen ? 240 : 68,
          background: "linear-gradient(180deg, #0d1b3e 0%, #1a3060 100%)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          minHeight: "100vh",
        }}
      >
        {/* Logo area */}
        <div
          className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <img src="/logo.png" alt="LIS Academy" className="w-9 h-9 object-contain flex-shrink-0" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-none">LIS Academy</p>
              <p className="text-[#c9a84c] text-[10px] mt-0.5">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="ml-auto text-white/40 hover:text-white transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium"
              style={{
                background: tab === id ? "rgba(201,168,76,0.15)" : "transparent",
                color: tab === id ? "#c9a84c" : "rgba(255,255,255,0.6)",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              <Icon size={18} />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && tab === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mx-2 mb-4 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
          style={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Log Out</span>}
        </button>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "members" && <MembersTab />}
          {tab === "events" && <EventsTab />}
          {tab === "programs_research" && <ProgramsResearchTab />}
          {tab === "content" && <ContentTab />}
          {tab === "social" && <SocialTab />}
          {tab === "templates" && <TemplatesTab />}
        </div>
      </div>
    </div>
  );
}

// ─────────── Dashboard overview ────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  useEffect(() => {
    getAllMembers().then(m => setStats({
      total: m.length,
      pending: m.filter(x => x.status === "pending").length,
      approved: m.filter(x => x.status === "approved").length,
    })).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Members", value: stats.total, color: "#c9a84c" },
    { label: "Pending Approval", value: stats.pending, color: "#f97316" },
    { label: "Approved Members", value: stats.approved, color: "#22c55e" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map(c => (
          <div key={c.label}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-white/50 text-sm mb-2">{c.label}</p>
            <p className="text-4xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 className="text-white font-semibold mb-4">Quick Tips</h2>
        <ul className="space-y-2 text-white/50 text-sm">
          <li>• Go to <b className="text-white/70">Members</b> to approve pending applications and generate certificates.</li>
          <li>• Go to <b className="text-white/70">Site Content</b> to edit contact information displayed on the website.</li>
          <li>• Go to <b className="text-white/70">Social Links</b> to update the social media URLs shown in the top bar.</li>
          <li>• After editing, content changes are applied instantly (stored in localStorage / Supabase).</li>
        </ul>
      </div>
    </motion.div>
  );
}

// ─────────── Members tab ────────────────────────────────────────
function MembersTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    getAllMembers().then(m => { setMembers(m); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = filter === "all" ? members : members.filter(m => m.status === filter);

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    await updateMemberStatus(id, status);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member? This cannot be undone.")) return;
    await deleteMember(id);
    load();
  };

  const statusColor: Record<string, string> = {
    pending: "#f97316", approved: "#22c55e", rejected: "#ef4444",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Members</h1>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: filter === f ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                color: filter === f ? "#c9a84c" : "rgba(255,255,255,0.5)",
                border: filter === f ? "1px solid rgba(201,168,76,0.4)" : "1px solid transparent",
              }}
            >{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-white/40 text-center py-12">Loading members…</p>
      ) : filtered.length === 0 ? (
        <p className="text-white/40 text-center py-12">No members found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id}
              className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{m.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{ background: statusColor[m.status] + "22", color: statusColor[m.status] }}>
                    {m.status}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}>
                    {m.membership_tier}
                  </span>
                </div>
                <p className="text-white/40 text-xs mt-1 truncate">{m.email} · {m.status === "approved" ? m.membership_id : (m.application_id || m.membership_id)}</p>
                <p className="text-white/40 text-xs">{m.designation} — {m.institution}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                {m.status === "pending" && (
                  <>
                    <button onClick={() => handleStatus(m.id, "approved")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                      style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}>
                      Approve
                    </button>
                    <button onClick={() => handleStatus(m.id, "rejected")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                      style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444" }}>
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => navigate(`/admin/members/${m.id}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                  style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}>
                  View / Certificate
                </button>
                <button onClick={() => handleDelete(m.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                  style={{ background: "#ef444410", color: "#ef4444aa", border: "1px solid #ef444422" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────── Site content tab ────────────────────────────────────
function ContentTab() {
  const [data, setData] = useState(() => ({
    ...getDefaultSection("contact"),
    ...getDefaultSection("hero"),
    donateHeadline: getDefaultSection("donate").headline || "",
    donateIntro: getDefaultSection("donate").intro || "",
    donateNote: getDefaultSection("donate").note || "",
    marqueeText: getDefaultSection("marquee").text || "",
    marqueeEnabled: getDefaultSection("marquee").enabled || "true",
  }));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSection("contact"), getSection("hero"), getSection("donate"), getSection("marquee")])
      .then(([contact, hero, donate, marquee]) => setData({
        ...contact,
        ...hero,
        donateHeadline: donate.headline || "",
        donateIntro: donate.intro || "",
        donateNote: donate.note || "",
        marqueeText: marquee.text || "",
        marqueeEnabled: marquee.enabled || "true",
      }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await setSection("contact", {
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
    });
    await setSection("hero", {
      headline: data.headline || "",
      subtitle: data.subtitle || "",
    });
    await setSection("donate", {
      headline: data.donateHeadline || "",
      intro: data.donateIntro || "",
      note: data.donateNote || "",
    });
    await setSection("marquee", {
      text: data.marqueeText || "",
      enabled: data.marqueeEnabled || "true",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-white mb-8">Site Content</h1>
      {loading && <p className="text-white/40 text-sm mb-4">Loading saved content...</p>}
      <div className="space-y-6">
        <Section title="Contact Information">
          <Field label="Email" icon={<Mail size={14} />} value={data.email || ""} onChange={v => setData(d => ({ ...d, email: v }))} />
          <Field label="Phone" icon={<Phone size={14} />} value={data.phone || ""} onChange={v => setData(d => ({ ...d, phone: v }))} />
          <Field label="Address" icon={<MapPin size={14} />} value={data.address || ""} onChange={v => setData(d => ({ ...d, address: v }))} textarea />
        </Section>
        <Section title="Hero Section">
          <Field label="Headline" value={data.headline || ""} onChange={v => setData(d => ({ ...d, headline: v }))} />
          <Field label="Subtitle" value={data.subtitle || ""} onChange={v => setData(d => ({ ...d, subtitle: v }))} textarea />
        </Section>
        <Section title="Marquee / Breaking News Strip">
          <p className="text-white/40 text-xs mb-3">This red strip scrolls above the hero carousel. Separate items with  &nbsp;<code className="text-[#c9a84c]">|</code>&nbsp;  for visual separation.</p>
          <Field label="Marquee Text" value={data.marqueeText || ""} onChange={v => setData(d => ({ ...d, marqueeText: v }))} textarea />
          <div className="flex items-center gap-3 mt-1">
            <label className="text-white/40 text-xs uppercase tracking-wider">Strip Visible?</label>
            <button
              type="button"
              onClick={() => setData(d => ({ ...d, marqueeEnabled: d.marqueeEnabled === "true" ? "false" : "true" }))}
              className="relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0"
              style={{ background: data.marqueeEnabled === "true" ? "#dc2626" : "rgba(255,255,255,0.15)" }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: data.marqueeEnabled === "true" ? "calc(100% - 18px)" : 2 }}
              />
            </button>
            <span className="text-xs" style={{ color: data.marqueeEnabled === "true" ? "#f87171" : "rgba(255,255,255,0.3)" }}>
              {data.marqueeEnabled === "true" ? "Enabled" : "Disabled"}
            </span>
          </div>
        </Section>
        <Section title="Donate Us Section">
          <Field label="Donation Headline" value={data.donateHeadline || ""} onChange={v => setData(d => ({ ...d, donateHeadline: v }))} />
          <Field label="Donation Intro" value={data.donateIntro || ""} onChange={v => setData(d => ({ ...d, donateIntro: v }))} textarea />
          <Field label="Donation Note" value={data.donateNote || ""} onChange={v => setData(d => ({ ...d, donateNote: v }))} textarea />
        </Section>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)", color: "#0d1b3e" }}>
          <Save size={16} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}

// ─────────── Social links tab ────────────────────────────────────
function SocialTab() {
  const [data, setData] = useState(() => getDefaultSection("social"));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSection("social").then(setData).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await setSection("social", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const socialFields = [
    { key: "facebook", label: "Facebook URL", Icon: Facebook },
    { key: "twitter", label: "Twitter / X URL", Icon: Twitter },
    { key: "linkedin", label: "LinkedIn URL", Icon: Linkedin },
    { key: "youtube", label: "YouTube URL", Icon: Youtube },
    { key: "instagram", label: "Instagram URL", Icon: Instagram },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-white mb-8">Social Media Links</h1>
      <p className="text-white/40 text-sm mb-6">These URLs are displayed in the top bar social icons.</p>
      {loading && <p className="text-white/40 text-sm mb-4">Loading saved links...</p>}
      <div className="space-y-6">
        <Section title="Social Profiles">
          {socialFields.map(({ key, label, Icon }) => (
            <Field key={key} label={label} icon={<Icon size={14} />}
              value={data[key] || ""} onChange={v => setData(d => ({ ...d, [key]: v }))} />
          ))}
        </Section>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)", color: "#0d1b3e" }}>
          <Save size={16} />
          {saved ? "Saved!" : "Save Social Links"}
        </button>
      </div>
    </motion.div>
  );
}

// ─────────── Shared UI primitives ───────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 space-y-4"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, textarea = false, icon
}: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; icon?: React.ReactNode;
}) {
  const sharedStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 13,
    padding: icon ? "10px 12px 10px 34px" : "10px 12px",
    outline: "none",
    resize: "none" as const,
  };

  return (
    <div>
      <label className="block text-white/40 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" style={{ pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        {textarea ? (
          <textarea rows={3} style={sharedStyle} value={value} onChange={e => onChange(e.target.value)} />
        ) : (
          <input type="text" style={sharedStyle} value={value} onChange={e => onChange(e.target.value)} />
        )}
      </div>
    </div>
  );
}

// ─────────── Events tab ────────────────────────────────────
function EventsTab() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<EventItem | Partial<EventItem> | null>(null);

  const load = () => {
    setLoading(true);
    fetchEvents().then(data => { setEvents(data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm("Delete this event?")) return;
    await deleteEvent(id);
    load();
  };

  const handleSave = async () => {
    if (!editingEvent?.title) return alert("Title is required");
    const payload: EventItem | Omit<EventItem, "id"> = editingEvent.id
      ? {
          id: editingEvent.id,
          title: editingEvent.title || "",
          date: editingEvent.date || "",
          location: editingEvent.location || "",
          type: editingEvent.type || "Conference",
          description: editingEvent.description || "",
          speakers: editingEvent.speakers || [],
          agenda: editingEvent.agenda || [],
          image_url: editingEvent.image_url || "",
          registration_url: editingEvent.registration_url || "",
          brochure_url: editingEvent.brochure_url || "",
          gallery_url: editingEvent.gallery_url || "",
          report_url: editingEvent.report_url || "",
          is_featured: Boolean(editingEvent.is_featured),
          sort_order: Number(editingEvent.sort_order || 0),
          created_at: editingEvent.created_at,
          updated_at: editingEvent.updated_at,
        }
      : {
          title: editingEvent.title || "",
          date: editingEvent.date || "",
          location: editingEvent.location || "",
          type: editingEvent.type || "Conference",
          description: editingEvent.description || "",
          speakers: editingEvent.speakers || [],
          agenda: editingEvent.agenda || [],
          image_url: editingEvent.image_url || "",
          registration_url: editingEvent.registration_url || "",
          brochure_url: editingEvent.brochure_url || "",
          gallery_url: editingEvent.gallery_url || "",
          report_url: editingEvent.report_url || "",
          is_featured: Boolean(editingEvent.is_featured),
          sort_order: Number(editingEvent.sort_order || 0),
        };
    await saveEvent(payload);
    setEditingEvent(null);
    load();
  };

  if (editingEvent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">{editingEvent.id ? 'Edit Event' : 'New Event'}</h1>
          <button onClick={() => setEditingEvent(null)} className="text-white/50 hover:text-white transition-all text-sm">Cancel</button>
        </div>
        <div className="space-y-6">
          <Section title="Event Details">
            <Field label="Title" value={editingEvent.title || ""} onChange={v => setEditingEvent({ ...editingEvent, title: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date" value={editingEvent.date || ""} onChange={v => setEditingEvent({ ...editingEvent, date: v })} />
              <Field label="Location" value={editingEvent.location || ""} onChange={v => setEditingEvent({ ...editingEvent, location: v })} />
            </div>
            <Field label="Type (e.g. Conference, Workshop)" value={editingEvent.type || ""} onChange={v => setEditingEvent({ ...editingEvent, type: v })} />
            <Field label="Description" textarea value={editingEvent.description || ""} onChange={v => setEditingEvent({ ...editingEvent, description: v })} />
          </Section>
          <Section title="Additional Info">
            <Field label="Speakers (comma separated)" value={editingEvent.speakers?.join(', ') || ""} onChange={v => setEditingEvent({ ...editingEvent, speakers: v.split(',').map(s => s.trim()).filter(Boolean) })} />
            <Field label="Agenda (comma separated)" value={editingEvent.agenda?.join(', ') || ""} onChange={v => setEditingEvent({ ...editingEvent, agenda: v.split(',').map(a => a.trim()).filter(Boolean) })} textarea />
            <Field label="Image URL" value={editingEvent.image_url || ""} onChange={v => setEditingEvent({ ...editingEvent, image_url: v })} />
            <Field label="Conference Brochure URL" value={editingEvent.brochure_url || ""} onChange={v => setEditingEvent({ ...editingEvent, brochure_url: v })} />
            <Field label="Photo Gallery URL" value={editingEvent.gallery_url || ""} onChange={v => setEditingEvent({ ...editingEvent, gallery_url: v })} />
            <Field label="Conference Report URL" value={editingEvent.report_url || ""} onChange={v => setEditingEvent({ ...editingEvent, report_url: v })} />
            <Field label="Registration URL" value={editingEvent.registration_url || ""} onChange={v => setEditingEvent({ ...editingEvent, registration_url: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sort Order" value={String(editingEvent.sort_order || 0)} onChange={v => setEditingEvent({ ...editingEvent, sort_order: Number(v || 0) })} />
              <label className="flex items-center gap-3 pt-6 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={Boolean(editingEvent.is_featured)}
                  onChange={e => setEditingEvent({ ...editingEvent, is_featured: e.target.checked })}
                  className="h-4 w-4 accent-[#c9a84c]"
                />
                Featured on home page
              </label>
            </div>
          </Section>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)", color: "#0d1b3e" }}>
            <Save size={16} /> Save Event
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Events CMS</h1>
        <button onClick={() => setEditingEvent({ title: '', date: '', location: '', type: 'Conference', description: '', speakers: [], agenda: [], image_url: '', brochure_url: '', gallery_url: '', report_url: '', registration_url: '', is_featured: true, sort_order: events.length * 10 + 10 })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#c9a84c", color: "#0d1b3e" }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {loading ? <p className="text-white/40 text-center py-12">Loading events...</p> : (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 border border-white/10 bg-white/5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{event.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}>{event.type}</span>
                </div>
                <p className="text-white/40 text-xs mt-1">{event.date} · {event.location}</p>
                <p className="text-white/30 text-xs truncate">{event.brochure_url || event.registration_url || event.gallery_url || event.report_url || "No event links yet"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingEvent(event)} className="p-2 rounded-lg text-white/50 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all border border-transparent hover:border-[#c9a84c]/30">
                   <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/30">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function TemplatesTab() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    fetchDocumentTemplates()
      .then((data) => {
        setTemplates(data);
        setDrafts(
          data.reduce<Record<string, string>>((acc, template) => {
            acc[template.key] = JSON.stringify(template.field_map || {}, null, 2);
            return acc;
          }, {}),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async (template: DocumentTemplate) => {
    setMessage("");
    setSavingKey(template.key);
    try {
      const fieldMap = drafts[template.key]?.trim() ? JSON.parse(drafts[template.key]) : {};
      await saveDocumentTemplate({ ...template, field_map: fieldMap });
      setMessage("Template settings saved.");
      load();
    } catch (error) {
      setMessage(error instanceof SyntaxError ? "Field map JSON is invalid." : "Could not save template settings.");
    } finally {
      setSavingKey(null);
    }
  };

  const updateTemplate = (key: string, patch: Partial<DocumentTemplate>) => {
    setTemplates((current) => current.map((template) => template.key === key ? { ...template, ...patch } : template));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-white mb-3">Document Templates</h1>
      <p className="text-white/45 text-sm mb-8">
        Paste public Canva export image URLs here. The generator overlays member data from the persisted membership record, including the membership ID.
      </p>
      {message && <p className="text-sm mb-4" style={{ color: message.includes("saved") ? "#22c55e" : "#ef4444" }}>{message}</p>}
      {loading ? (
        <p className="text-white/40 text-center py-12">Loading templates...</p>
      ) : (
        <div className="space-y-6">
          {templates.map((template) => (
            <Section key={template.key} title={template.label}>
              <Field label="Label" value={template.label} onChange={v => updateTemplate(template.key, { label: v })} />
              <Field label="Canva Export / Template Image URL" value={template.template_url} onChange={v => updateTemplate(template.key, { template_url: v })} />
              <Field
                label="Field Map JSON"
                textarea
                value={drafts[template.key] || "{}"}
                onChange={v => setDrafts(current => ({ ...current, [template.key]: v }))}
              />
              <button
                onClick={() => handleSave(template)}
                disabled={savingKey === template.key}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)", color: "#0d1b3e" }}
              >
                <Save size={16} /> {savingKey === template.key ? "Saving..." : "Save Template"}
              </button>
            </Section>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────── Programs & Research tab ────────────────────────────────────
function ProgramsResearchTab() {
  const [data, setData] = useState(() => ({
    ...getDefaultSection("programs"),
    ...getDefaultSection("research"),
    ...getDefaultSection("products"),
  }));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSection("programs"), getSection("research"), getSection("products")])
      .then(([programs, research, products]) => setData({
        ...programs,
        ...research,
        ...products,
      }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await setSection("programs", {
      programs_json: data.programs_json || "[]",
    });
    await setSection("research", {
      publications_json: data.publications_json || "[]",
      projects_json: data.projects_json || "[]",
      collaborators_json: data.collaborators_json || "[]",
    });
    await setSection("products", {
      products_json: data.products_json || "[]",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-white mb-8">Program & Research Content</h1>
      <p className="text-white/40 text-sm mb-6">Manage the data arrays shown in the Research Support page. Use valid JSON format.</p>
      {loading && <p className="text-white/40 text-sm mb-4">Loading saved content...</p>}
      <div className="space-y-6">
        <Section title="Programs">
          <Field label="Programs JSON Array" value={data.programs_json || ""} onChange={v => setData(d => ({ ...d, programs_json: v }))} textarea />
        </Section>
        <Section title="Research">
          <Field label="Publications JSON Array" value={data.publications_json || ""} onChange={v => setData(d => ({ ...d, publications_json: v }))} textarea />
          <Field label="Projects JSON Array" value={data.projects_json || ""} onChange={v => setData(d => ({ ...d, projects_json: v }))} textarea />
          <Field label="Collaborators JSON Array" value={data.collaborators_json || ""} onChange={v => setData(d => ({ ...d, collaborators_json: v }))} textarea />
        </Section>
        <Section title="Products">
          <Field label="Products JSON Array" value={data.products_json || ""} onChange={v => setData(d => ({ ...d, products_json: v }))} textarea />
        </Section>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)", color: "#0d1b3e" }}>
          <Save size={16} />
          {saved ? "Saved!" : "Save Content"}
        </button>
      </div>
    </motion.div>
  );
}

