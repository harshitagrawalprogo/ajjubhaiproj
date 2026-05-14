import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Governance", path: "/governance" },
  { name: "Program", path: "/programs" },
  { name: "Events", path: "/events" },
  { name: "Community", path: "/community" },
  { name: "Blog", path: "/blog" },
  { name: "LISATube", path: "/lisatube" },
  { name: "Donate Us", path: "/donate" },
];

interface NavbarProps {
  topBarHeight?: number;
  topOffset?: number;
}

export default function Navbar({ topBarHeight = 0, topOffset = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setScrollPos(current);
      setScrolled(current > 20);
      
      // Hide on scroll down, show on scroll up
      if (current > lastScroll && current > 100) {
        setNavVisible(false); // scrolling down
      } else {
        setNavVisible(true); // scrolling up
      }
      lastScroll = current <= 0 ? 0 : current;
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  // Adjust top position, factoring in scroll so TopBar doesn't leave a gap, and nav hides if navVisible is false
  const effectiveTopBarHeight = Math.max(0, topBarHeight - scrollPos);
  const navTop = navVisible ? topOffset + effectiveTopBarHeight : -100;

  return (
    <header
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d1b3e]/95 backdrop-blur-md shadow-md border-b border-white/10"
          : "bg-[#0d1b3e]"
      }`}
      style={{ top: navTop }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left spacer (desktop) */}
        <div className="hidden lg:flex flex-1" />

        {/* Desktop nav links – centered */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || link.dropdown?.some(sub => location.pathname === sub.path);
            
            return (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <div className="relative">
                    <Link
                      to={link.path}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? "text-[#c9a84c] bg-white/10"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                    </Link>
                    <div className="absolute left-0 top-full pt-1 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                      <div className="bg-[#0d1b3e] border border-white/10 rounded-lg shadow-xl overflow-hidden w-48 flex flex-col py-1 mt-1">
                        {link.dropdown.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.path}
                            className={`px-4 py-2 text-sm transition-colors ${
                              location.pathname === subLink.path
                                ? "text-[#c9a84c] bg-white/10"
                                : "text-white/80 hover:text-[#c9a84c] hover:bg-white/5"
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === link.path
                        ? "text-[#c9a84c] bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex flex-1 justify-end">
          <Link to="/membership">
            <Button
              size="sm"
              className="rounded-lg font-semibold text-[#0d1b3e] hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
            >
              Become a Member
            </Button>
          </Link>
        </div>

        {/* Mobile: logo + toggle */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LIS Academy" className="h-8 w-auto object-contain" />
            <span className="font-bold text-white text-base">LIS Academy</span>
          </Link>
          <button
            className="p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0d1b3e]/97 border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <>
                      <div className="px-3 py-2 text-sm font-semibold text-white/50 uppercase tracking-wider mt-1">
                        {link.name}
                      </div>
                      <div className="space-y-1 pl-2 border-l-2 border-white/10 ml-3 mb-1">
                        {link.dropdown.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.path}
                            className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              location.pathname === subLink.path
                                ? "text-[#c9a84c] bg-white/10"
                                : "text-white/70 hover:text-white hover:bg-white/8"
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        location.pathname === link.path
                          ? "text-[#c9a84c] bg-white/10"
                          : "text-white/70 hover:text-white hover:bg-white/8"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-3">
                <Link to="/membership">
                  <Button
                    className="w-full font-semibold text-[#0d1b3e]"
                    style={{ background: "linear-gradient(135deg, #f0d080, #c9a84c)" }}
                  >
                    Become a Member
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
