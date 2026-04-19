import { useEffect, useState } from "react";
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { getDefaultSection, getSection } from "@/lib/contentDb";

interface TopBarProps {
  onHeightChange: (height: number) => void;
}

const SOCIAL_ICONS = [
  { key: "facebook", Icon: Facebook, label: "Facebook" },
  { key: "twitter", Icon: Twitter, label: "Twitter / X" },
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "youtube", Icon: Youtube, label: "YouTube" },
  { key: "instagram", Icon: Instagram, label: "Instagram" },
] as const;

export const TOPBAR_HEIGHT = 72; // px when visible

export default function TopBar({ onHeightChange }: TopBarProps) {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(() => getDefaultSection("social"));

  useEffect(() => {
    onHeightChange(TOPBAR_HEIGHT);
  }, [onHeightChange]);

  useEffect(() => {
    getSection("social").then(setSocialLinks).catch(() => {});
  }, []);

  return (
    <div className="relative z-50">
      <div
        className="overflow-hidden"
        style={{ background: "#ffffff", borderBottom: "1px solid #e8e0d0" }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-6"
          style={{ height: TOPBAR_HEIGHT }}
        >
          {/* ── Left: Logo + Brand ─────────────────────── */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full border-2 overflow-hidden flex-shrink-0"
              style={{
                width: 52,
                height: 52,
                borderColor: "#0d1b3e",
                background: "#fff",
              }}
            >
              <img
                src="/logo.png"
                alt="LIS Academy Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="leading-none">
              <div
                className="font-extrabold text-2xl tracking-wide"
                style={{
                  background:
                    "linear-gradient(90deg, #1a2ee6 0%, #0d1b3e 40%, #1a2ee6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                LIS ACADEMY
              </div>
              <div
                className="text-xs font-bold tracking-widest mt-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span style={{ color: "#c0392b" }}>LEARN</span>
                <span className="text-gray-400 mx-1">|</span>
                <span style={{ color: "#e67e22" }}>INSPIRE</span>
                <span className="text-gray-400 mx-1">|</span>
                <span style={{ color: "#27ae60" }}>SERVE</span>
              </div>
            </div>
          </div>

          {/* ── Right: Socials ─────────────────────────── */}
          <div className="flex items-center gap-1">
            {SOCIAL_ICONS.map(({ key, Icon, label }) => (
              <a
                key={key}
                href={socialLinks[key] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                style={{ color: "#0d1b3e" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#0d1b3e";
                  (e.currentTarget as HTMLElement).style.color = "#c9a84c";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#0d1b3e";
                }}
              >
                <Icon size={18} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
