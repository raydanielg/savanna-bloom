import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mountain, Clock, TrendingUp, ChevronRight, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import kiliHero from "@/assets/kilimanjaro-hero.jpg";
import kiliClimbing from "@/assets/kilimanjaro-climbing.jpg";

import { fadeInUp, staggerDelay } from "@/lib/animations";

const routes = [
  { name: "Lemosho Route", days: 8, difficulty: "Moderate", success: "95%", scenery: "Exceptional", desc: "The most scenic route with excellent acclimatization. Our most recommended route for first-time climbers.", href: "/lemosho-route", image: kiliClimbing },
  { name: "Machame Route", days: 7, difficulty: "Moderate-Hard", success: "90%", scenery: "Excellent", desc: "Known as the 'Whiskey Route' for its challenging terrain and stunning views across diverse ecosystems.", href: "/machame-route", image: kiliHero },
  { name: "Marangu Route", days: 6, difficulty: "Moderate", success: "85%", scenery: "Good", desc: "The only route with hut accommodation. Often called the 'Coca-Cola Route', it's the most established path.", href: "/marangu-route", image: kiliClimbing },
  { name: "Rongai Route", days: 7, difficulty: "Moderate", success: "90%", scenery: "Good", desc: "Approaching from the north, this quieter route offers a unique perspective of Kilimanjaro.", href: "/rongai-route", image: kiliHero },
  { name: "Northern Circuit", days: 9, difficulty: "Moderate", success: "97%", scenery: "Exceptional", desc: "The longest route with the best acclimatization and highest success rate. A true circumnavigation.", href: "/northern-circuit", image: kiliClimbing },
];

const Kilimanjaro = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] -mt-24">
        <img src={kiliHero} alt="Mount Kilimanjaro at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative h-full flex items-end pb-16 safari-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-3"><Mountain className="w-3.5 h-3.5" /> 5,895m · Africa's Highest Peak</p>
            <h1 className="text-hero font-serif text-primary-foreground mb-3">Climb Kilimanjaro</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl">Choose your path to the summit. Five distinct routes, each offering a unique journey to Uhuru Peak.</p>
          </motion.div>
        </div>
      </section>

      {/* Routes */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-section font-serif text-foreground">Choose Your Route</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Each route offers a different experience. Our team will help you choose the best path based on your fitness level and preferences.</p>
          </motion.div>

          <div className="space-y-6">
            {routes.map((route, i) => (
              <motion.div key={route.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <Link to={route.href} className="group grid md:grid-cols-[300px_1fr] bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                    <img src={route.image} alt={route.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">{route.name}</h3>
                        {route.success === "97%" && <span className="badge-meta bg-accent/10 text-accent text-[10px]">Highest Success</span>}
                        {route.name === "Lemosho Route" && <span className="badge-meta bg-primary/10 text-primary text-[10px]">Most Popular</span>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{route.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex gap-4">
                        <span className="badge-meta bg-muted text-foreground"><Clock className="w-3 h-3" /> {route.days} Days</span>
                        <span className="badge-meta bg-muted text-foreground"><TrendingUp className="w-3 h-3" /> {route.difficulty}</span>
                        <span className="badge-meta bg-muted text-foreground">{route.success} Success</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Begin Your Expedition <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour="Lemosho Route (8 Days)" />
    </Layout>
  );
};

export default Kilimanjaro;
