import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Sun, ArrowRight, MapPin, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import axios from "@/lib/axios";

import { fadeInUp } from "@/lib/animations";

interface DayTrip {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  highlights: string[];
  included: string[];
  destination?: { name: string };
  featured: boolean;
}

const DayTrips = () => {
  const [trips, setTrips] = useState<DayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/api/day-trips");
      const data = response.data?.data || response.data || [];
      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch day trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquire = (tripName: string) => {
    setSelectedTrip(tripName);
    setInquiryOpen(true);
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
      <section className="relative h-[50vh] min-h-[400px] -mt-24">
        <img src="/storage/hero/hero-safari.jpg" alt="Tanzania day trip" className="absolute inset-0 w-full h-full object-cover" />
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
          {trips.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sun className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">Day Trips Coming Soon</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're preparing exciting day trip experiences for you. From waterfall hikes to coffee tours and hot springs, adventure awaits.
                </p>
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] text-sm"
                >
                  Request a Custom Trip <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {trips.map((trip, i) => (
                <motion.div key={trip.id} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                  <div className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all">
                    <div className="grid md:grid-cols-[400px_1fr] lg:grid-cols-[480px_1fr]">
                      <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                        <img src={trip.image || '/placeholder-trip.jpg'} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                      </div>
                      <div className="p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="badge-meta bg-accent/10 text-accent"><Clock className="w-3 h-3" /> {trip.duration || 'Full Day'}</span>
                            {trip.destination?.name && (
                              <span className="badge-meta bg-primary/5 text-primary"><MapPin className="w-3 h-3" /> {trip.destination.name}</span>
                            )}
                          </div>
                          <h3 className="font-serif text-2xl text-foreground mb-3">{trip.name}</h3>
                          <p className="text-muted-foreground leading-relaxed mb-5">{trip.short_description || trip.description}</p>

                          {trip.highlights && trip.highlights.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-5">
                              {trip.highlights.slice(0, 4).map((h, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                  {h}
                                </div>
                              ))}
                            </div>
                          )}

                          {trip.included && trip.included.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {trip.included.slice(0, 3).map((item, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1">
                                  <Check className="w-3 h-3 text-accent" /> {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-border">
                          <div>
                            <span className="font-serif text-2xl text-accent">{trip.currency || 'USD'} ${trip.price?.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground ml-2">per person</span>
                          </div>
                          <button 
                            onClick={() => handleInquire(trip.name)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                          >
                            Inquire <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div {...fadeInUp} className="text-center mt-14">
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase"
            >
              Plan Your Day Trip <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour={selectedTrip || "Day Trip"} />
    </Layout>
  );
};

export default DayTrips;
