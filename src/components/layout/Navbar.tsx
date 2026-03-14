import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    label: "Kilimanjaro",
    href: "/kilimanjaro",
    children: [
      { label: "All Routes", href: "/kilimanjaro-routes" },
      { label: "Lemosho Route", href: "/lemosho-route" },
      { label: "Machame Route", href: "/machame-route" },
      { label: "Marangu Route", href: "/marangu-route" },
      { label: "Rongai Route", href: "/rongai-route" },
      { label: "Northern Circuit", href: "/northern-circuit" },
    ],
  },
  {
    label: "Safaris",
    href: "/tanzania-safaris",
    children: [
      { label: "Serengeti Safari", href: "/serengeti-safari" },
      { label: "Ngorongoro Safari", href: "/ngorongoro-safari" },
      { label: "Tarangire Safari", href: "/tarangire-safari" },
      { label: "Lake Manyara Safari", href: "/lake-manyara-safari" },
      { label: "Zanzibar Tour", href: "/zanzibar-tour" },
    ],
  },
  {
    label: "Day Trips",
    href: "/day-trips",
    children: [
      { label: "Materuni Waterfall", href: "/materuni-waterfall" },
      { label: "Chemka Hot Springs", href: "/chemka-hot-springs" },
      { label: "Coffee Tour", href: "/coffee-tour" },
    ],
  },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navBg = scrolled || !isHome
    ? "bg-card/90 backdrop-blur-md border-b border-border/50 shadow-sm"
    : "bg-transparent";

  const textColor = scrolled || !isHome ? "text-foreground" : "text-primary-foreground";

  return (
    <nav className={`glass-nav ${navBg} transition-all duration-300`}>
      <div className="safari-container">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20 lg:h-24"}`}>
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className={`font-serif text-lg md:text-xl font-normal ${textColor} transition-colors`}>
              Africa Safari<span className="text-accent"> & </span>Expeditions
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium ${textColor} hover:text-accent transition-colors`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>
                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] as const }}
                      className="absolute top-full left-0 w-56 bg-card/95 backdrop-blur-xl rounded-xl shadow-lg border border-border/50 py-2 mt-1"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-muted/50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5" />
              Inquire Now
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 ${textColor}`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border overflow-hidden"
          >
            <div className="safari-container py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.href}
                    className="block px-3 py-3 text-foreground font-medium hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-6 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/contact"
                className="block mx-3 mt-4 text-center px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium"
              >
                Inquire Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
