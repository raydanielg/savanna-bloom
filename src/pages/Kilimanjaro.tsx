import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mountain, Clock, TrendingUp, ChevronRight, ArrowRight, Star, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import axios from "@/lib/axios";

import { fadeInUp } from "@/lib/animations";

interface Route {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  days: number;
  difficulty: string;
  success_rate: string;
  max_altitude: string;
  image: string;
  featured: boolean;
}

const Kilimanjaro = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get("/api/kilimanjaro-routes");
      const data = response.data?.data || response.data || [];
      setRoutes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] -mt-24">
        <img src="/storage/hero/kilimanjaro-hero.jpg" alt="Mount Kilimanjaro at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-20 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-4"><Mountain className="w-3.5 h-3.5" /> 5,895m · Africa's Highest Peak</p>
            <h1 className="text-hero font-serif text-primary-foreground mb-4">Climb Kilimanjaro</h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl leading-relaxed">Choose your path to the summit. Multiple distinct routes, each offering a unique journey to Uhuru Peak.</p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <Shield className="w-4 h-4 text-accent" /> Expert Guides
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <Star className="w-4 h-4 text-accent" /> High Success Rate
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

          {routes.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mountain className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">Routes Coming Soon</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're preparing Kilimanjaro climbing routes with expert guides and high success rates. From Lemosho to Machame, your summit journey awaits.
                </p>
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] text-sm"
                >
                  Request a Quote <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {routes.map((route, i) => (
                <motion.div key={route.id} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.08 }}>
                  <Link to={`/kilimanjaro/${route.slug || route.id}`} className="group grid md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all">
                    <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                      <img src={route.image || '/placeholder-kilimanjaro.jpg'} alt={route.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">{route.name}</h3>
                          {route.featured && <span className="badge-meta bg-accent/10 text-accent text-[10px]">Popular</span>}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{route.short_description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
                        <div className="flex flex-wrap gap-3">
                          <span className="badge-meta bg-secondary text-foreground"><Clock className="w-3 h-3" /> {route.days} Days</span>
                          <span className="badge-meta bg-secondary text-foreground"><TrendingUp className="w-3 h-3" /> {route.difficulty}</span>
                          <span className="badge-meta bg-accent/10 text-accent"><Star className="w-3 h-3" /> {route.success_rate || '90%'}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div {...fadeInUp} className="text-center mt-14">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
              Get a Free Quote <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour="Kilimanjaro Climb" />
    </Layout>
  );
};

export default Kilimanjaro;
