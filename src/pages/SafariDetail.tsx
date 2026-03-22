import { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Camera, Star, MapPin, Check, X as XIcon, ChevronDown, ChevronUp, Users, Binoculars, Sun, Tent, Calendar, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimation";
import axios from "@/lib/axios";

interface SafariData {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  duration: string;
  days: number;
  price: number;
  currency: string;
  image: string;
  gallery: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  difficulty: string;
  min_guests: number;
  max_guests: number;
  destination?: { name: string };
  featured: boolean;
  active: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const SafariDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [safari, setSafari] = useState<SafariData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchSafari();
  }, [slug]);

  const fetchSafari = async () => {
    try {
      // Try to fetch by slug from API
      const response = await axios.get(`/api/safaris`);
      const safaris = response.data?.data || response.data || [];
      
      // Find by slug or by ID
      const found = safaris.find((s: any) => s.slug === slug || s.id === parseInt(slug || '0'));
      
      if (found) {
        setSafari(found);
      } else {
        // Try fetching by ID directly
        try {
          const byIdResponse = await axios.get(`/api/safaris/${slug}`);
          setSafari(byIdResponse.data);
        } catch (err) {
          console.error("Safari not found:", err);
        }
      }
    } catch (error) {
      console.error("Failed to fetch safari:", error);
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

  if (!safari) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Safari Not Found</h2>
            <p className="text-gray-600 mb-6">The safari you're looking for doesn't exist or has been removed.</p>
            <Link to="/tanzania-safaris" className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
              Browse All Safaris
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const gallery = safari.gallery?.length > 0 ? safari.gallery : [safari.image];
  const highlights = safari.highlights || [];
  const included = safari.included || [];
  const excluded = safari.excluded || [];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] -mt-24">
        <img 
          src={safari.image || '/placeholder-safari.jpg'} 
          alt={safari.name} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-16 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-3">
              <Binoculars className="w-3.5 h-3.5" /> {safari.category || 'Wildlife Safari'}
            </p>
            <h1 className="text-hero font-serif text-primary-foreground mb-4">{safari.name}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                <Clock className="w-3 h-3" /> {safari.duration || `${safari.days} Days`}
              </span>
              {safari.difficulty && (
                <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                  <TrendingUp className="w-3 h-3" /> {safari.difficulty}
                </span>
              )}
              <span className="badge-meta bg-accent/25 text-accent backdrop-blur-sm">
                <MapPin className="w-3 h-3" /> {safari.destination?.name || 'Tanzania'}
              </span>
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                <Users className="w-3 h-3" /> {safari.min_guests || 2}-{safari.max_guests || 8} Guests
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
                <h2 className="text-section font-serif text-foreground mb-5">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {safari.description || safari.short_description}
                </p>
              </motion.div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <motion.div {...fadeInUp} className="mt-12">
                  <h3 className="text-subsection font-serif text-foreground mb-6">Safari Highlights</h3>
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

              {/* Gallery */}
              {gallery.length > 0 && (
                <motion.div {...fadeInUp} className="mt-12">
                  <h3 className="text-subsection font-serif text-foreground mb-6">Photo Gallery</h3>
                  <div className="space-y-4">
                    <div className="image-reveal rounded-2xl aspect-[16/9] overflow-hidden">
                      <img 
                        src={gallery[selectedImage] || safari.image} 
                        alt={`${safari.name} view`} 
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
                        <p className="text-sm font-medium text-foreground">{safari.duration || `${safari.days} Days`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b border-border">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Group Size</span>
                        <p className="text-sm font-medium text-foreground">{safari.min_guests || 2}-{safari.max_guests || 8} travelers</p>
                      </div>
                    </div>
                    {safari.difficulty && (
                      <div className="flex items-center gap-3 py-3 border-b border-border">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Difficulty</span>
                          <p className="text-sm font-medium text-foreground">{safari.difficulty}</p>
                        </div>
                      </div>
                    )}
                    {safari.destination?.name && (
                      <div className="flex items-center gap-3 py-3 border-b border-border">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Destination</span>
                          <p className="text-sm font-medium text-foreground">{safari.destination.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-accent rounded-2xl p-8 text-accent-foreground">
                  <p className="font-serif text-2xl mb-1">
                    {safari.currency || 'USD'} ${safari.price?.toLocaleString()}
                  </p>
                  <p className="text-sm opacity-80 mb-5">per person</p>
                  <button 
                    onClick={() => setInquiryOpen(true)}
                    className="w-full px-6 py-4 bg-accent-foreground text-accent rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase"
                  >
                    Book This Safari
                  </button>
                </div>

                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                >
                  Inquire About This Safari <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour={safari.name} />
    </Layout>
  );
};

export default SafariDetail;
