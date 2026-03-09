import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  Academy: [
    { name: "About Us", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Research", path: "/research" },
    { name: "Events", path: "/events" },
  ],
  Resources: [
    { name: "Knowledge Hub", path: "/knowledge" },
    { name: "Community", path: "/community" },
    { name: "Blog", path: "/knowledge" },
    { name: "Publications", path: "/research" },
  ],
  Connect: [
    { name: "Contact Us", path: "/contact" },
    { name: "Newsletter", path: "/contact" },
    { name: "Careers", path: "/about" },
    { name: "Partners", path: "/about" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-navy text-primary-foreground">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-serif font-bold text-lg">L</span>
              </div>
              <span className="font-serif font-bold text-xl">LIS Academy</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              India's leading platform for Library & Information Science education, research, and professional development.
            </p>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>info@lisacademy.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-serif text-lg mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} LIS Academy. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
