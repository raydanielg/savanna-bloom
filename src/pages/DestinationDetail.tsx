import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Star, ArrowLeft, ArrowRight, Share2, Heart, CheckCircle2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import axios from "@/lib/axios";
import { getStorageUrl } from "@/lib/storage";
import { fadeInUp } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Destination {
  id: number;
  name: string;
  slug: string;
  subtitle?: string;
  short_description: string;
  description: string;
  image: string;
  country: string;
  region: string;
  highlights?: string[];
  best_time_to_visit?: string;
  safaris?: any[];
}

export default function DestinationDetail() {
  const { slug } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDestination();
  }, [slug]);

  const fetchDestination = async () => {
    try {
      const response = await axios.get(`/api/destinations/${slug}`);
      setDestination(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch destination details:", error);
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

  if (!destination) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <MapPin className="h-16 w-12 text-slate-200 mb-4" />
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Destination Not Found</h2>
          <p className="text-slate-500 mb-8">The wilderness location you are looking for doesn't seem to exist.</p>
          <Button asChild className="rounded-full px-8">
            <Link to="/destinations">Explore All Destinations</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden -mt-24">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={destination.image ? getStorageUrl(destination.image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=1600'} 
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </motion.div>

        <div className="relative h-full flex flex-col justify-end pb-20 safari-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Link to="/destinations" className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Badge className="bg-orange-600 hover:bg-orange-600 text-white border-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {destination.region || "Tanzania"}
              </Badge>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
              {destination.name}
            </h1>
            
            {destination.subtitle && (
              <p className="text-2xl font-serif text-white/90 italic mb-8 border-l-4 border-orange-500 pl-6">
                {destination.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-8 text-white">
              {destination.best_time_to_visit && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/50 leading-none mb-1">Best Time</p>
                    <p className="font-bold text-sm uppercase">{destination.best_time_to_visit}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Star className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/50 leading-none mb-1">Experience</p>
                  <p className="font-bold text-sm uppercase">World Class Safari</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-3xl -mr-64 -mt-64" />
        
        <div className="safari-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
              <motion.div {...fadeInUp} className="prose prose-slate prose-xl max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600">
                <div dangerouslySetInnerHTML={{ __html: destination.description }} />
              </motion.div>

              {destination.highlights && destination.highlights.length > 0 && (
                <motion.div {...fadeInUp} className="space-y-10">
                  <h2 className="text-4xl font-serif text-slate-900 flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-orange-600 rounded-full" />
                    Destination Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {destination.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-orange-600" />
                        </div>
                        <p className="text-slate-700 font-medium pt-2">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden sticky top-32"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h3 className="font-serif text-3xl mb-6">Plan Your Trip</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-10 italic">
                  Ready to experience {destination.name}? Let our experts craft the perfect itinerary for you.
                </p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <span className="font-medium">Tailor-made Itineraries</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <span className="font-medium">Expert Local Guides</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <span className="font-medium">24/7 On-ground Support</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setInquiryOpen(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white h-16 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 active:scale-95 transition-all"
                >
                  Request a Quote
                </Button>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=1600" alt="Safari" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-slate-900/80" />
        </div>
        <div className="safari-container relative text-center">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">The Adventure Awaits</h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Don't just dream of Africa. Experience the raw beauty, the majestic wildlife, and the vibrant culture of Tanzania with Godeep Africa Safaris.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => setInquiryOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-12 h-16 rounded-full font-black text-lg"
              >
                Plan Your Safari
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-12 h-16 rounded-full font-black text-lg backdrop-blur-sm"
              >
                <Link to="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
}
