import { useEffect, useRef, useState } from "react";
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
  const topBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = topBarRef.current;
    if (!node) {
      onHeightChange(TOPBAR_HEIGHT);
      return;
    }

    const updateHeight = () => onHeightChange(Math.ceil(node.getBoundingClientRect().height));
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [onHeightChange]);

  useEffect(() => {
    getSection("social").then(setSocialLinks).catch(() => {});
  }, []);

  return (
    <div ref={topBarRef} className="relative z-50">
      <div
        className="overflow-hidden"
        style={{ background: "#ffffff", borderBottom: "1px solid #e8e0d0" }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-2 px-3 py-2 md:h-[72px] md:flex-row md:justify-between md:px-6 md:py-0">
          {/* ── Left: Logo + Brand ─────────────────────── */}
          <div className="flex min-w-0 items-center justify-center gap-2 md:justify-start md:gap-3">
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 md:h-12 md:w-12"
              style={{
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

            <div className="min-w-0 leading-none">
              <div
                className="whitespace-nowrap text-[clamp(1.55rem,8vw,2rem)] font-extrabold tracking-normal md:text-2xl md:tracking-wide"
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
                className="mt-0.5 whitespace-nowrap text-[clamp(0.62rem,3.2vw,0.85rem)] font-bold tracking-[0.16em] md:text-xs md:tracking-widest"
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
          <div className="flex items-center justify-center gap-3 md:gap-1">
            {SOCIAL_ICONS.map(({ key, Icon, label }) => (
              <a
                key={key}
                href={socialLinks[key] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 md:h-9 md:w-9"
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
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
