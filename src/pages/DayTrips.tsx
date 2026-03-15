import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sun, ArrowRight, MapPin, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import ngorongoro from "@/assets/ngorongoro.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";
import tarangire from "@/assets/tarangire.jpg";
import heroSafari from "@/assets/hero-safari.jpg";

import { fadeInUp } from "@/lib/animations";

const dayTrips = [
  {
    name: "Materuni Waterfall & Coffee Tour",
    duration: "Full Day",
    price: "From $120",
    desc: "Visit the stunning 80-meter Materuni Waterfall and experience traditional Chagga coffee culture at the foothills of Kilimanjaro. Walk through banana plantations and learn the art of coffee roasting.",
    image: ngorongoro,
    href: "/materuni-waterfall",
    highlights: ["80m waterfall", "Coffee tasting", "Chagga village", "Mountain views"],
    includes: ["Transport", "Local guide", "Lunch", "Coffee tasting"],
  },
  {
    name: "Chemka Hot Springs",
    duration: "Full Day",
    price: "From $100",
    desc: "Swim in crystal-clear natural hot springs surrounded by lush tropical vegetation. The turquoise waters maintain a perfect temperature year-round — a hidden gem of northern Tanzania.",
    image: lakeManyara,
    href: "/chemka-hot-springs",
    highlights: ["Natural springs", "Crystal clear water", "Tropical forest", "Picnic lunch"],
    includes: ["Transport", "Entrance fees", "Lunch", "Towels"],
  },
  {
    name: "Arusha Coffee Plantation Tour",
    duration: "Half Day",
    price: "From $80",
    desc: "Experience the complete journey of Tanzania's world-renowned Arabica coffee from bean to cup on a working estate near Mount Meru.",
    image: tarangire,
    href: "/coffee-tour",
    highlights: ["Working plantation", "Roasting demo", "Cupping session", "Mount Meru views"],
    includes: ["Transport", "Guide", "Coffee samples", "Snacks"],
  },
  {
    name: "Arusha National Park Safari",
    duration: "Full Day",
    price: "From $200",
    desc: "A spectacular day safari in the shadow of Mount Meru, home to giraffes, buffalos, colobus monkeys, and stunning crater lakes.",
    image: heroSafari,
    href: "/day-trips",
    highlights: ["Mount Meru views", "Momella Lakes", "Colobus monkeys", "Walking safari option"],
    includes: ["Safari vehicle", "Park fees", "Lunch", "Guide"],
  },
];

const DayTrips = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("");

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] -mt-24">
        <img src={heroSafari} alt="Tanzania day trip" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-14 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-3"><Sun className="w-3.5 h-3.5" /> Day Adventures</p>
            <h1 className="text-hero font-serif text-primary-foreground">Day Trips & Excursions</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl mt-3">Short on time? Explore Tanzania's hidden gems on a day trip from Arusha or Moshi.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="space-y-8">
            {dayTrips.map((trip, i) => (
              <motion.div key={trip.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <div className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all">
                  <div className="grid md:grid-cols-[400px_1fr] lg:grid-cols-[480px_1fr]">
                    <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                      <img src={trip.image} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="badge-meta bg-accent/10 text-accent"><Clock className="w-3 h-3" /> {trip.duration}</span>
                          <span className="badge-meta bg-primary/5 text-primary"><MapPin className="w-3 h-3" /> Arusha / Moshi</span>
                        </div>
                        <h3 className="font-serif text-2xl text-foreground mb-3">{trip.name}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-5">{trip.desc}</p>

                        <div className="grid grid-cols-2 gap-2 mb-5">
                          {trip.highlights.map((h) => (
                            <div key={h} className="flex items-center gap-2 text-xs text-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                              {h}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {trip.includes.map((inc) => (
                            <span key={inc} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                              <Check className="w-3 h-3 text-primary" /> {inc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-border">
                        <span className="font-serif text-2xl text-accent">{trip.price}<span className="text-sm text-muted-foreground font-sans"> /person</span></span>
                        <button 
                          onClick={() => { setSelectedTrip(trip.name); setInquiryOpen(true); }} 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Book Now <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour={selectedTrip} />
    </Layout>
  );
};

export default DayTrips;
