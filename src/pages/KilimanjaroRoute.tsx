import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Clock, TrendingUp, MapPin, Check, X as XIcon, ArrowRight, ChevronDown, ChevronUp, Star, Thermometer, Sun, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import axios from "@/lib/axios";

interface RouteData {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  days: number;
  difficulty: string;
  success_rate: string;
  max_altitude: string;
  image: string;
  gallery: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: { day: number; title: string; altitude: string; description: string; distance?: string }[];
  featured: boolean;
  active: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const KilimanjaroRoute = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchRoute();
  }, [slug]);

  const fetchRoute = async () => {
    try {
      const response = await axios.get(`/api/kilimanjaro-routes`);
      const routes = response.data?.data || response.data || [];
      
      const found = routes.find((r: any) => r.slug === slug || r.id === parseInt(slug || '0'));
      
      if (found) {
        setRoute(found);
      } else {
        try {
          const byIdResponse = await axios.get(`/api/kilimanjaro-routes/${slug}`);
          setRoute(byIdResponse.data);
        } catch (err) {
          console.error("Route not found:", err);
        }
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
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

  if (!route) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Route Not Found</h2>
            <p className="text-gray-600 mb-6">The Kilimanjaro route you're looking for doesn't exist.</p>
            <Link to="/kilimanjaro" className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
              Browse All Routes
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const gallery = route.gallery?.length > 0 ? route.gallery : [route.image];
  const highlights = route.highlights || [];
  const included = route.included || [];
  const excluded = route.excluded || [];
  const itinerary = route.itinerary || [];

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "text-green-600 bg-green-50",
      Moderate: "text-yellow-600 bg-yellow-50",
      Challenging: "text-orange-600 bg-orange-50",
      Difficult: "text-red-600 bg-red-50",
    };
    return colors[difficulty] || "text-gray-600 bg-gray-50";
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] -mt-24">
        <img 
          src={route.image || '/placeholder-kilimanjaro.jpg'} 
          alt={route.name} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-16 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-3">
              <Mountain className="w-3.5 h-3.5" /> Kilimanjaro Climb
            </p>
            <h1 className="text-hero font-serif text-primary-foreground mb-4">{route.name}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                <Clock className="w-3 h-3" /> {route.days} Days
              </span>
              <span className={`badge-meta ${getDifficultyColor(route.difficulty)}`}>
                <TrendingUp className="w-3 h-3" /> {route.difficulty}
              </span>
              <span className="badge-meta bg-accent/25 text-accent backdrop-blur-sm">
                <Mountain className="w-3 h-3" /> {route.max_altitude}
              </span>
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                <Users className="w-3 h-3" /> {route.success_rate || '90%'} Success
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16">
            {/* Main Content */}
            <div>
              <motion.div {...fadeInUp}>
                <h2 className="text-section font-serif text-foreground mb-5">Route Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {route.description || route.short_description}
                </p>
              </motion.div>

              {/* Key Stats */}
              <motion.div {...fadeInUp} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl p-6 text-center card-shadow">
                  <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{route.days}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center card-shadow">
                  <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{route.difficulty}</p>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center card-shadow">
                  <Mountain className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{route.max_altitude}</p>
                  <p className="text-xs text-muted-foreground">Max Altitude</p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center card-shadow">
                  <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{route.success_rate || '90%'}</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </motion.div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <motion.div {...fadeInUp} className="mt-12">
                  <h3 className="text-subsection font-serif text-foreground mb-6">Route Highlights</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm text-foreground">{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <motion.div {...fadeInUp} className="mt-12">
                  <h3 className="text-subsection font-serif text-foreground mb-6">Day-by-Day Itinerary</h3>
                  <div className="space-y-3">
                    {itinerary.map((day, i) => (
                      <div key={i} className="bg-card rounded-xl overflow-hidden card-shadow">
                        <button 
                          onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                              <span className="font-bold text-accent">{day.day}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{day.title}</p>
                              <p className="text-xs text-muted-foreground">{day.altitude}</p>
                            </div>
                          </div>
                          {expandedDay === i ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </button>
                        <AnimatePresence>
                          {expandedDay === i && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-border"
                            >
                              <div className="p-4 text-sm text-muted-foreground">
                                <p>{day.description}</p>
                                {day.distance && (
                                  <p className="mt-2 text-xs text-accent">Distance: {day.distance}</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <motion.div {...fadeInUp} className="mt-12">
                  <h3 className="text-subsection font-serif text-foreground mb-6">Photo Gallery</h3>
                  <div className="space-y-4">
                    <div className="image-reveal rounded-2xl aspect-[16/9] overflow-hidden">
                      <img 
                        src={gallery[selectedImage] || route.image} 
                        alt={`${route.name} view`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {gallery.length > 1 && (
                      <div className="grid grid-cols-3 gap-3">
                        {gallery.slice(0, 6).map((img, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelectedImage(i)}
                            className={`aspect-[4/3] rounded-xl overflow-hidden transition-all ${selectedImage === i ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"}`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Inclusions */}
              {(included.length > 0 || excluded.length > 0) && (
                <motion.div {...fadeInUp} className="mt-16 grid md:grid-cols-2 gap-6">
                  {included.length > 0 && (
                    <div className="bg-card rounded-2xl p-8 card-shadow">
                      <h3 className="font-serif text-xl text-foreground mb-5 flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" /> What's Included
                      </h3>
                      <ul className="space-y-3">
                        {included.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {excluded.length > 0 && (
                    <div className="bg-card rounded-2xl p-8 card-shadow">
                      <h3 className="font-serif text-xl text-foreground mb-5 flex items-center gap-2">
                        <XIcon className="w-5 h-5 text-destructive" /> Not Included
                      </h3>
                      <ul className="space-y-3">
                        {excluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <XIcon className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-28 space-y-6">
                <div className="bg-card rounded-2xl p-8 card-shadow-lg">
                  <h3 className="font-serif text-xl text-foreground mb-6">Quick Facts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 py-3 border-b border-border">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Duration</span>
                        <p className="text-sm font-medium text-foreground">{route.days} Days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b border-border">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Difficulty</span>
                        <p className="text-sm font-medium text-foreground">{route.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b border-border">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Mountain className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Max Altitude</span>
                        <p className="text-sm font-medium text-foreground">{route.max_altitude}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b border-border">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Star className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Success Rate</span>
                        <p className="text-sm font-medium text-foreground">{route.success_rate || '90%'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="w-full px-6 py-4 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase"
                >
                  Book This Climb
                </button>

                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                >
                  Inquire About This Route <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour={route.name} />
    </Layout>
  );
};

export default KilimanjaroRoute;
