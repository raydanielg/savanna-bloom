import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mountain, Clock, TrendingUp, ChevronRight, ArrowRight, Star, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import kiliHero from "@/assets/kilimanjaro-hero.jpg";
import kiliClimbing from "@/assets/kilimanjaro-climbing.jpg";
import kiliSummit from "@/assets/kili-summit.jpg";

import { fadeInUp } from "@/lib/animations";

const routes = [
  { name: "Lemosho Route", days: 8, difficulty: "Moderate", success: "95%", scenery: "Exceptional", desc: "The most scenic route with excellent acclimatization. Our most recommended route for first-time climbers.", href: "/lemosho-route", image: kiliClimbing, tag: "Most Popular" },
  { name: "Machame Route", days: 7, difficulty: "Moderate-Hard", success: "90%", scenery: "Excellent", desc: "Known as the 'Whiskey Route' for its challenging terrain and stunning views across diverse ecosystems.", href: "/machame-route", image: kiliHero },
  { name: "Marangu Route", days: 6, difficulty: "Moderate", success: "85%", scenery: "Good", desc: "The only route with hut accommodation. Often called the 'Coca-Cola Route', it's the most established path.", href: "/marangu-route", image: kiliClimbing },
  { name: "Rongai Route", days: 7, difficulty: "Moderate", success: "90%", scenery: "Good", desc: "Approaching from the north, this quieter route offers a unique perspective of Kilimanjaro.", href: "/rongai-route", image: kiliHero },
  { name: "Northern Circuit", days: 9, difficulty: "Moderate", success: "97%", scenery: "Exceptional", desc: "The longest route with the best acclimatization and highest success rate. A true circumnavigation.", href: "/northern-circuit", image: kiliSummit, tag: "Highest Success" },
];

const Kilimanjaro = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] -mt-24">
        <img src={kiliSummit} alt="Mount Kilimanjaro at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-20 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-4"><Mountain className="w-3.5 h-3.5" /> 5,895m · Africa's Highest Peak</p>
            <h1 className="text-hero font-serif text-primary-foreground mb-4">Climb Kilimanjaro</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl leading-relaxed">Choose your path to the summit. Five distinct routes, each offering a unique journey to Uhuru Peak.</p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <Shield className="w-4 h-4 text-accent" /> 98% Summit Rate
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <Star className="w-4 h-4 text-accent" /> 15+ Years Experience
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Routes */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-section font-serif text-foreground">Choose Your Route</h2>
            <div className="w-16 h-px bg-accent mx-auto mt-5" />
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">Each route offers a different experience. Our team will help you choose the best path based on your fitness level and preferences.</p>
          </motion.div>

          <div className="space-y-6">
            {routes.map((route, i) => (
              <motion.div key={route.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.08 }}>
                <Link to={route.href} className="group grid md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all">
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                    <img src={route.image} alt={route.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                  </div>
                  <div className="p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">{route.name}</h3>
                        {route.tag && <span className="badge-meta bg-accent/10 text-accent text-[10px]">{route.tag}</span>}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{route.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
                      <div className="flex flex-wrap gap-3">
                        <span className="badge-meta bg-secondary text-foreground"><Clock className="w-3 h-3" /> {route.days} Days</span>
                        <span className="badge-meta bg-secondary text-foreground"><TrendingUp className="w-3 h-3" /> {route.difficulty}</span>
                        <span className="badge-meta bg-accent/10 text-accent"><Star className="w-3 h-3" /> {route.success}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-14">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
              Get a Free Quote <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour="Lemosho Route (8 Days)" />
    </Layout>
  );
};

export default Kilimanjaro;
