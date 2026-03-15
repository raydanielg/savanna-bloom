import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Camera, Star, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import serengeti from "@/assets/serengeti.jpg";
import ngorongoro from "@/assets/ngorongoro.jpg";
import tarangire from "@/assets/tarangire.jpg";
import zanzibar from "@/assets/zanzibar.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";
import wildlifeLion from "@/assets/wildlife-lion.jpg";
import migration from "@/assets/migration.jpg";
import elephant from "@/assets/elephant.jpg";
import leopard from "@/assets/leopard.jpg";
import zanzibarBeach from "@/assets/zanzibar-beach.jpg";

import { fadeInUp } from "@/lib/animations";

const safaris = [
  { name: "Serengeti Great Migration Safari", days: "5 Days", price: "From $2,400", image: migration, wildlife: ["Lions", "Wildebeest", "Zebras", "Cheetahs"], href: "/serengeti-safari", desc: "Witness the world's greatest wildlife spectacle as millions of wildebeest cross the Mara River.", featured: true },
  { name: "Ngorongoro Crater Safari", days: "3 Days", price: "From $1,800", image: ngorongoro, wildlife: ["Big Five", "Flamingos", "Hippos"], href: "/ngorongoro-safari", desc: "Descend into the world's largest intact volcanic caldera, home to 30,000+ animals." },
  { name: "Tarangire Elephant Safari", days: "4 Days", price: "From $1,600", image: elephant, wildlife: ["Elephants", "Baobab Trees", "Lions"], href: "/tarangire-safari", desc: "Walk among massive herds of elephants beneath ancient baobab trees." },
  { name: "Lake Manyara Safari", days: "2 Days", price: "From $900", image: lakeManyara, wildlife: ["Flamingos", "Tree-climbing Lions", "Hippos"], href: "/lake-manyara-safari", desc: "Discover tree-climbing lions and vast flocks of flamingos at the lake's edge." },
  { name: "Zanzibar Beach & Culture", days: "5 Days", price: "From $1,200", image: zanzibarBeach, wildlife: ["Dolphins", "Marine Life", "Spice Tours"], href: "/zanzibar-tour", desc: "Tropical paradise with pristine beaches, spice tours, and historic Stone Town." },
  { name: "Big Five Safari Adventure", days: "7 Days", price: "From $3,200", image: leopard, wildlife: ["Lion", "Leopard", "Elephant", "Rhino", "Buffalo"], href: "/serengeti-safari", desc: "The ultimate safari spanning Serengeti, Ngorongoro, and Tarangire." },
];

const TanzaniaSafaris = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const featured = safaris.find(s => s.featured);
  const rest = safaris.filter(s => !s.featured);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] -mt-24">
        <img src={serengeti} alt="Serengeti safari" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-16 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-4"><Camera className="w-3.5 h-3.5" /> Wildlife Adventures</p>
            <h1 className="text-hero font-serif text-primary-foreground">Tanzania Safaris</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mt-3 leading-relaxed">Experience the world's greatest wildlife spectacle across Tanzania's legendary national parks and conservation areas.</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Safari */}
      {featured && (
        <section className="section-padding bg-background">
          <div className="safari-container">
            <motion.div {...fadeInUp}>
              <Link to={featured.href} className="group grid lg:grid-cols-2 bg-card rounded-3xl overflow-hidden card-shadow-lg hover:shadow-2xl transition-shadow">
                <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <img src={featured.image} alt={featured.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <p className="badge-meta bg-accent/10 text-accent mb-4"><Star className="w-3 h-3" /> Featured Safari</p>
                  <h2 className="font-serif text-3xl lg:text-4xl text-foreground group-hover:text-accent transition-colors mb-3">{featured.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{featured.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featured.wildlife.map((w) => (
                      <span key={w} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium">{w}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-4">
                      <span className="badge-meta bg-muted text-foreground"><Clock className="w-3 h-3" /> {featured.days}</span>
                      <span className="font-serif text-2xl text-accent">{featured.price}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:text-accent transition-colors uppercase tracking-wider">
                      Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Safaris */}
      <section className="section-padding bg-secondary/40 pt-0">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-section font-serif text-foreground">All Safari Packages</h2>
            <div className="w-16 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((safari, i) => (
              <motion.div key={safari.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.08 }}>
                <Link to={safari.href} className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all h-full">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={safari.image} alt={safari.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                    <div className="absolute top-4 left-4">
                      <span className="badge-meta bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        <Clock className="w-3 h-3" /> {safari.days}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors mb-2">{safari.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{safari.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {safari.wildlife.map((w) => (
                        <span key={w} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{w}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-serif text-xl text-accent">{safari.price}</span>
                      <span className="text-xs text-primary font-medium uppercase tracking-wider group-hover:text-accent transition-colors">View Details</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-14">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
              Plan Your Custom Safari <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
};

export default TanzaniaSafaris;
