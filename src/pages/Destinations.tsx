import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import serengeti from "@/assets/serengeti.jpg";
import ngorongoro from "@/assets/ngorongoro.jpg";
import kiliHero from "@/assets/kilimanjaro-hero.jpg";
import zanzibar from "@/assets/zanzibar.jpg";
import tarangire from "@/assets/tarangire.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";

import { fadeInUp, staggerDelay } from "@/lib/animations";

const destinations = [
  { name: "Serengeti National Park", desc: "Home to the Great Migration and unrivaled wildlife density.", image: serengeti, tours: 12, href: "/serengeti-safari" },
  { name: "Ngorongoro Crater", desc: "A UNESCO World Heritage Site with the densest concentration of big game.", image: ngorongoro, tours: 8, href: "/ngorongoro-safari" },
  { name: "Mount Kilimanjaro", desc: "Africa's highest peak at 5,895m — the ultimate mountaineering challenge.", image: kiliHero, tours: 6, href: "/kilimanjaro" },
  { name: "Zanzibar", desc: "Tropical paradise with pristine beaches, spice tours, and Stone Town.", image: zanzibar, tours: 5, href: "/zanzibar-tour" },
  { name: "Tarangire National Park", desc: "Famous for massive elephant herds and iconic baobab trees.", image: tarangire, tours: 7, href: "/tarangire-safari" },
  { name: "Lake Manyara", desc: "Known for tree-climbing lions and vast flocks of flamingos.", image: lakeManyara, tours: 4, href: "/lake-manyara-safari" },
];

const Destinations = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Layout>
      <section className="section-padding bg-background pt-32">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-3"><MapPin className="w-3.5 h-3.5" /> Explore Tanzania</p>
            <h1 className="text-hero font-serif text-foreground">Destinations</h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Discover the diverse landscapes and incredible wildlife of Tanzania's most iconic destinations.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((dest, i) => (
              <motion.div key={dest.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <Link to={dest.href} className="route-card block aspect-[16/10]">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="hero-gradient absolute inset-0" />
                  <div className="card-content">
                    <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-1">{dest.tours} Tours Available</p>
                    <h3 className="font-serif text-2xl text-primary-foreground mb-1">{dest.name}</h3>
                    <p className="text-sm text-primary-foreground/70">{dest.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Plan Your Adventure <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
};

export default Destinations;
