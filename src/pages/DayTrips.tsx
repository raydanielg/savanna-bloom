import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Sun, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import ngorongoro from "@/assets/ngorongoro.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";
import tarangire from "@/assets/tarangire.jpg";

import { fadeInUp, staggerDelay } from "@/lib/animations";

const dayTrips = [
  { name: "Materuni Waterfall & Coffee Tour", duration: "Full Day", price: "From $120", desc: "Visit the stunning Materuni Waterfall and experience traditional Chagga coffee culture at the foothills of Kilimanjaro.", image: ngorongoro, href: "/materuni-waterfall" },
  { name: "Chemka Hot Springs", duration: "Full Day", price: "From $100", desc: "Swim in the crystal-clear natural hot springs surrounded by lush tropical vegetation.", image: lakeManyara, href: "/chemka-hot-springs" },
  { name: "Arusha Coffee Tour", duration: "Half Day", price: "From $80", desc: "Experience the complete journey of Tanzania's world-renowned coffee from bean to cup.", image: tarangire, href: "/coffee-tour" },
  { name: "Arusha National Park Safari", duration: "Full Day", price: "From $200", desc: "A day safari in the shadow of Mount Meru, home to giraffes, buffalos, and colobus monkeys.", image: tarangire, href: "/day-trips" },
];

const DayTrips = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Layout>
      <section className="section-padding bg-background pt-32">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-3"><Sun className="w-3.5 h-3.5" /> Day Adventures</p>
            <h1 className="text-hero font-serif text-foreground">Day Trips & Excursions</h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Short on time? Explore Tanzania's hidden gems on a day trip from Arusha or Moshi.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dayTrips.map((trip, i) => (
              <motion.div key={trip.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <div className="group bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={trip.image} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="badge-meta bg-muted text-muted-foreground"><Clock className="w-3 h-3" /> {trip.duration}</span>
                      <span className="text-sm font-medium text-accent">{trip.price}</span>
                    </div>
                    <h3 className="font-serif text-xl text-foreground mb-2">{trip.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{trip.desc}</p>
                    <button onClick={() => setInquiryOpen(true)} className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-accent transition-colors">
                      Book This Trip <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
};

export default DayTrips;
