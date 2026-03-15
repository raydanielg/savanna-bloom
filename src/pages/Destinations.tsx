import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import serengeti from "@/assets/serengeti.jpg";
import ngorongoro from "@/assets/ngorongoro.jpg";
import kiliSummit from "@/assets/kili-summit.jpg";
import zanzibarBeach from "@/assets/zanzibar-beach.jpg";
import tarangire from "@/assets/tarangire.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";
import migration from "@/assets/migration.jpg";

import { fadeInUp } from "@/lib/animations";

const destinations = [
  { name: "Serengeti National Park", desc: "Home to the Great Migration — the largest terrestrial mammal movement on earth. Endless plains, dramatic river crossings, and unrivaled wildlife density.", image: serengeti, tours: 12, href: "/serengeti-safari", highlight: "Great Migration" },
  { name: "Ngorongoro Crater", desc: "A UNESCO World Heritage Site and the world's largest intact volcanic caldera, sheltering 30,000+ animals within its ancient walls.", image: ngorongoro, tours: 8, href: "/ngorongoro-safari", highlight: "World Heritage" },
  { name: "Mount Kilimanjaro", desc: "Africa's highest peak at 5,895m — the ultimate mountaineering challenge and one of the Seven Summits, accessible to determined trekkers.", image: kiliSummit, tours: 6, href: "/kilimanjaro", highlight: "Roof of Africa" },
  { name: "Zanzibar", desc: "Tropical paradise with pristine coral beaches, spice plantations, historic Stone Town, and world-class diving.", image: zanzibarBeach, tours: 5, href: "/zanzibar-tour", highlight: "Spice Island" },
  { name: "Tarangire National Park", desc: "Famous for massive elephant herds, iconic baobab trees, and excellent dry-season game viewing away from the crowds.", image: tarangire, tours: 7, href: "/tarangire-safari", highlight: "Elephant Kingdom" },
  { name: "Lake Manyara", desc: "Known for tree-climbing lions, vast flocks of flamingos, and a diverse ecosystem from groundwater forest to alkaline lake.", image: lakeManyara, tours: 4, href: "/lake-manyara-safari", highlight: "Tree-Climbing Lions" },
];

const Destinations = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] -mt-24">
        <img src={migration} alt="Tanzania landscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-14 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-3"><MapPin className="w-3.5 h-3.5" /> Explore Tanzania</p>
            <h1 className="text-hero font-serif text-primary-foreground">Destinations</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mt-3">Discover the diverse landscapes and incredible wildlife of Tanzania's most iconic destinations.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="space-y-8">
            {destinations.map((dest, i) => (
              <motion.div key={dest.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.08 }}>
                <Link to={dest.href} className={`group grid md:grid-cols-2 bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden md:[direction:ltr]">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center md:[direction:ltr]">
                    <p className="badge-meta bg-accent/10 text-accent mb-4 w-fit">{dest.highlight}</p>
                    <h2 className="font-serif text-3xl text-foreground group-hover:text-accent transition-colors mb-3">{dest.name}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{dest.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{dest.tours} Tours Available</span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:text-accent transition-colors uppercase tracking-wider">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-14">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
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
