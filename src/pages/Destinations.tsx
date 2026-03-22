import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import axios from "@/lib/axios";
import { getStorageUrl } from "@/lib/storage";

import { fadeInUp } from "@/lib/animations";

interface Destination {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image: string;
  country: string;
  region: string;
  highlights: string[];
  best_time_to_visit: string;
  active: boolean;
}

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("/api/destinations");
      const data = response.data?.data || response.data || [];
      setDestinations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
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
      <section className="relative h-[60vh] min-h-[450px] -mt-24">
        <img src={getStorageUrl('/storage/hero/migration.jpg')} alt="Tanzania landscape" className="absolute inset-0 w-full h-full object-cover" />
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
          {destinations.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">Destinations Coming Soon</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're adding Tanzania's most iconic destinations. From the Serengeti plains to Zanzibar beaches, incredible places await.
                </p>
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] text-sm"
                >
                  Plan Your Adventure <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {destinations.map((dest, i) => (
                <motion.div key={dest.id} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.08 }}>
                  <Link to={`/destination/${dest.slug || dest.id}`} className={`group grid md:grid-cols-2 bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                    <div className="aspect-[16/10] md:aspect-auto overflow-hidden md:[direction:ltr]">
                      <img src={dest.image ? getStorageUrl(dest.image) : '/placeholder-destination.jpg'} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center md:[direction:ltr]">
                      {dest.region && (
                        <p className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-widest uppercase mb-4 w-fit">
                          {dest.region}
                        </p>
                      )}
                      <h2 className="font-serif text-4xl lg:text-5xl text-foreground group-hover:text-accent transition-colors mb-4">{dest.name}</h2>
                      <p className="text-muted-foreground leading-relaxed text-lg mb-8">{dest.short_description || dest.description}</p>
                      {dest.highlights && dest.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-8">
                          {dest.highlights.slice(0, 4).map((h, idx) => (
                            <span key={idx} className="text-xs px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-semibold shadow-sm border border-secondary-foreground/5">{h}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                        {dest.best_time_to_visit && (
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-tighter text-muted-foreground/60 font-bold">Best Time to Visit</span>
                            <span className="text-sm text-foreground font-medium">{dest.best_time_to_visit}</span>
                          </div>
                        )}
                        <span className="inline-flex items-center gap-2 text-sm text-primary font-bold group-hover:text-accent transition-all uppercase tracking-widest group-hover:gap-3">
                          Explore Destination <ArrowRight className="w-4 h-4" />
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
