import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Camera, Star, MapPin, Users, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import axios from "@/lib/axios";

import { fadeInUp } from "@/lib/animations";

interface Safari {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  category: string;
  duration: string;
  days: number;
  price: number;
  currency: string;
  image: string;
  featured: boolean;
  destination?: { name: string };
  min_guests: number;
  max_guests: number;
  difficulty: string;
}

const TanzaniaSafaris = () => {
  const [safaris, setSafaris] = useState<Safari[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    fetchSafaris();
  }, []);

  const fetchSafaris = async () => {
    try {
      const response = await axios.get("/api/safaris");
      const data = response.data?.data || response.data || [];
      setSafaris(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch safaris:", error);
    } finally {
      setLoading(false);
    }
  };

  const featured = safaris.find(s => s.featured);
  const rest = safaris.filter(s => !s.featured);

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
      <section className="relative h-[70vh] min-h-[500px] -mt-24">
        <img src="/storage/hero/kilimanjaro-hero.jpg" alt="Mount Kilimanjaro at sunrise" className="absolute inset-0 w-full h-full object-cover" />
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
              <Link to={`/safari/${featured.slug || featured.id}`} className="group grid lg:grid-cols-2 bg-card rounded-3xl overflow-hidden card-shadow-lg hover:shadow-2xl transition-shadow">
                <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <img src={featured.image || '/placeholder-safari.jpg'} alt={featured.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <p className="badge-meta bg-accent/10 text-accent mb-4"><Star className="w-3 h-3" /> Featured Safari</p>
                  <h2 className="font-serif text-3xl lg:text-4xl text-foreground group-hover:text-accent transition-colors mb-3">{featured.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{featured.short_description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featured.category && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium">{featured.category}</span>
                    )}
                    {featured.destination?.name && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium">{featured.destination.name}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-4">
                      <span className="badge-meta bg-muted text-foreground"><Clock className="w-3 h-3" /> {featured.duration || `${featured.days} Days`}</span>
                      <span className="font-serif text-2xl text-accent">{featured.currency || 'USD'} ${featured.price?.toLocaleString()}</span>
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

          {safaris.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">Safaris Coming Soon</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're preparing incredible safari experiences across Tanzania's national parks. From the Serengeti to Ngorongoro, adventure awaits.
                </p>
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] text-sm"
                >
                  Request a Custom Safari <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featured ? rest : safaris).map((safari, i) => (
                <motion.div key={safari.id} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.08 }}>
                  <Link to={`/safari/${safari.slug || safari.id}`} className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all h-full">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={safari.image || '/placeholder-safari.jpg'} alt={safari.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                      <div className="absolute top-4 left-4">
                        <span className="badge-meta bg-primary/90 text-primary-foreground backdrop-blur-sm">
                          <Clock className="w-3 h-3" /> {safari.duration || `${safari.days} Days`}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">{safari.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{safari.short_description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        {safari.destination?.name && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {safari.destination.name}
                          </span>
                        )}
                        {safari.difficulty && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {safari.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="font-serif text-xl text-accent">{safari.currency || 'USD'} ${safari.price?.toLocaleString()}</span>
                        <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:text-accent transition-colors">
                          View <ArrowRight className="w-4 h-4" />
                        </span>
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
