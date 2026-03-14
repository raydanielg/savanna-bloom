import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="safari-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company */}
          <div>
            <h3 className="font-serif text-2xl mb-4">
              Africa Safari<span className="text-accent"> & </span>Expeditions
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Your trusted partner for Kilimanjaro climbs, Tanzania safaris, and unforgettable African adventures since 2008.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Kilimanjaro Climbing", href: "/kilimanjaro" },
                { label: "Tanzania Safaris", href: "/tanzania-safaris" },
                { label: "Day Trips", href: "/day-trips" },
                { label: "Destinations", href: "/destinations" },
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-serif text-lg mb-4">Destinations</h4>
            <ul className="space-y-2.5">
              {["Serengeti", "Ngorongoro Crater", "Kilimanjaro", "Zanzibar", "Tarangire", "Lake Manyara"].map((dest) => (
                <li key={dest}>
                  <Link to="/destinations" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Arusha, Tanzania
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +255 123 456 789
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@africasafari.com
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 rounded-l-full bg-primary-foreground/10 text-sm text-primary-foreground placeholder:text-primary-foreground/40 border-0 outline-none focus:ring-1 focus:ring-accent"
                />
                <button className="px-5 py-2.5 bg-accent text-accent-foreground rounded-r-full text-sm font-medium hover:opacity-90 transition-opacity">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2024 Africa Safari & Expeditions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-primary-foreground/50 hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-primary-foreground/50 hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
