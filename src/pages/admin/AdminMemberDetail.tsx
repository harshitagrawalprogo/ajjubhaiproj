import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Printer, Award, CreditCard } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getMemberById } from "@/lib/membershipDb";
import { generateCertificate, generateIdCard, printImage } from "@/lib/certificateGenerator";
import type { Member } from "@/lib/supabase";

export default function AdminMemberDetail() {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [cardFront, setCardFront] = useState<string | null>(null);
  const [cardBack, setCardBack] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activePreview, setActivePreview] = useState<"certificate" | "card">("certificate");

  useEffect(() => { if (!isAuthenticated) navigate("/admin"); }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) return;
    getMemberById(id)
      .then(m => { setMember(m); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    if (!member) return;
    setGenerating(true);
    try {
      const [cert, { front, back }] = await Promise.all([
        generateCertificate(member),
        generateIdCard(member),
      ]);
      setCertUrl(cert);
      setCardFront(front);
      setCardBack(back);
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080f20" }}>
      <p className="text-white/40">Loading member…</p>
    </div>
  );

  if (!member) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080f20" }}>
      <p className="text-white/40">Member not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#080f20", color: "#e8e0d0" }}>
      <div className="max-w-5xl mx-auto p-8">
        {/* Back */}
        <button onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Member info */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{ background: "rgba(201,168,76,0.2)", color: "#c9a84c" }}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-white font-bold">{member.name}</h2>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#c9a84c" }}>
                    {member.membership_tier} member
                  </p>
                </div>
              </div>

              {[
                { label: "Membership ID", value: member.membership_id },
                { label: "Email", value: member.email },
                { label: "Phone", value: member.phone },
                { label: "Designation", value: member.designation },
                { label: "Institution", value: member.institution },
                { label: "City", value: member.city },
                { label: "State", value: member.state },
                { label: "Status", value: member.status },
                { label: "Member Since", value: new Date(member.created_at).toLocaleDateString("en-IN") },
              ].map(({ label, value }) => (
                <div key={label} className="mb-3">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-white/80 text-sm capitalize">{value || "—"}</p>
                </div>
              ))}
            </motion.div>

            {/* Generate button */}
            <button onClick={handleGenerate} disabled={generating}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)", color: "#0d1b3e" }}>
              <Award size={16} />
              {generating ? "Generating…" : "Generate Certificate & ID Card"}
            </button>
          </div>

          {/* Preview panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {([
                { id: "certificate" as const, label: "Certificate", Icon: Award },
                { id: "card" as const, label: "ID Card", Icon: CreditCard },
              ]).map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setActivePreview(id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activePreview === id ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                    color: activePreview === id ? "#c9a84c" : "rgba(255,255,255,0.5)",
                    border: activePreview === id ? "1px solid rgba(201,168,76,0.4)" : "1px solid transparent",
                  }}>
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>

            {/* Preview area */}
            {activePreview === "certificate" && (
              <div>
                {certUrl ? (
                  <>
                    <img src={certUrl} alt="Certificate Preview" className="w-full rounded-xl border border-white/10 mb-4" />
                    <div className="flex gap-3">
                      <button onClick={() => downloadImage(certUrl, `certificate-${member.membership_id}.png`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                        <Download size={14} /> Download PNG
                      </button>
                      <button onClick={() => printImage(certUrl, "LIS Academy Certificate")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                        <Printer size={14} /> Print
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-white/30">
                    <Award size={40} className="mb-4 opacity-20" />
                    <p className="text-sm">Click "Generate" to create certificate</p>
                  </div>
                )}
              </div>
            )}

            {activePreview === "card" && (
              <div>
                {cardFront && cardBack ? (
                  <>
                    <div className="space-y-4 mb-4">
                      <div>
                        <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Front</p>
                        <img src={cardFront} alt="ID Card Front" className="w-full rounded-xl border border-white/10" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Back</p>
                        <img src={cardBack} alt="ID Card Back" className="w-full rounded-xl border border-white/10" />
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={() => downloadImage(cardFront!, `idcard-front-${member.membership_id}.png`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                        <Download size={14} /> Front PNG
                      </button>
                      <button onClick={() => downloadImage(cardBack!, `idcard-back-${member.membership_id}.png`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                        <Download size={14} /> Back PNG
                      </button>
                      <button onClick={() => printImage(cardFront!, "LIS Academy ID Card")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                        <Printer size={14} /> Print Front
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-white/30">
                    <CreditCard size={40} className="mb-4 opacity-20" />
                    <p className="text-sm">Click "Generate" to create ID card</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
