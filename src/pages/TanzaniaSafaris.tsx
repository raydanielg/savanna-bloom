import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Camera } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import serengeti from "@/assets/serengeti.jpg";
import ngorongoro from "@/assets/ngorongoro.jpg";
import tarangire from "@/assets/tarangire.jpg";
import zanzibar from "@/assets/zanzibar.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";
import wildlifeLion from "@/assets/wildlife-lion.jpg";

import { fadeInUp, staggerDelay } from "@/lib/animations";

const safaris = [
  { name: "Serengeti Great Migration Safari", days: "5 Days", price: "From $2,400", image: serengeti, wildlife: ["Lions", "Wildebeest", "Zebras", "Cheetahs"], href: "/serengeti-safari" },
  { name: "Ngorongoro Crater Safari", days: "3 Days", price: "From $1,800", image: ngorongoro, wildlife: ["Big Five", "Flamingos", "Hippos"], href: "/ngorongoro-safari" },
  { name: "Tarangire Elephant Safari", days: "4 Days", price: "From $1,600", image: tarangire, wildlife: ["Elephants", "Baobab Trees", "Lions"], href: "/tarangire-safari" },
  { name: "Lake Manyara Safari", days: "2 Days", price: "From $900", image: lakeManyara, wildlife: ["Flamingos", "Tree-climbing Lions", "Hippos"], href: "/lake-manyara-safari" },
  { name: "Zanzibar Beach & Culture", days: "5 Days", price: "From $1,200", image: zanzibar, wildlife: ["Dolphins", "Marine Life", "Spice Tours"], href: "/zanzibar-tour" },
  { name: "Big Five Safari Adventure", days: "7 Days", price: "From $3,200", image: wildlifeLion, wildlife: ["Lion", "Leopard", "Elephant", "Rhino", "Buffalo"], href: "/serengeti-safari" },
];

const TanzaniaSafaris = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[450px] -mt-24">
        <img src={serengeti} alt="Serengeti safari" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative h-full flex items-end pb-12 safari-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-3"><Camera className="w-3.5 h-3.5" /> Wildlife Adventures</p>
            <h1 className="text-hero font-serif text-primary-foreground">Tanzania Safaris</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mt-3">Experience the world's greatest wildlife spectacle across Tanzania's legendary national parks.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safaris.map((safari, i) => (
              <motion.div key={safari.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <Link to={safari.href} className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={safari.image} alt={safari.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">{safari.name}</h3>
                    <div className="flex items-center gap-3 mt-2 mb-3">
                      <span className="badge-meta bg-muted text-muted-foreground"><Clock className="w-3 h-3" /> {safari.days}</span>
                      <span className="text-sm font-medium text-accent">{safari.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {safari.wildlife.map((w) => (
                        <span key={w} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{w}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Plan Your Safari <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
};

export default TanzaniaSafaris;
