import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Shield, Users, Award, Mountain, Compass, Clock, ChevronRight, Binoculars, Tent, Quote, Play, MapPin, ChevronLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import { ScrollReveal, StaggerContainer, StaggerItem, ParallaxImage } from "@/hooks/useScrollAnimation";
import axios from "@/lib/axios";
import { getStorageUrl } from "@/lib/storage";

import { easeOutQuint } from "@/lib/animations";

interface Destination {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  image: string;
  region: string;
}

interface Safari {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  duration: string;
  days: number;
  price: number;
  currency: string;
  image: string;
  featured: boolean;
}

interface Route {
  id: number;
  name: string;
  slug: string;
  days: number;
  difficulty: string;
  success_rate: string;
  image: string;
  featured: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  trip: string;
}

const whyUs = [
  { icon: Shield, title: "Safety First", desc: "Certified guides, emergency protocols, and medical support on every expedition." },
  { icon: Award, title: "98% Summit Rate", desc: "Our expert acclimatization profiles ensure the highest success rates on Kilimanjaro." },
  { icon: Users, title: "15+ Years Experience", desc: "Over 10,000 satisfied travelers since 2008, with deep local expertise." },
  { icon: Compass, title: "Custom Itineraries", desc: "Every journey is tailored to your preferences, pace, and budget." },
];

const Index = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [safaris, setSafaris] = useState<Safari[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    "/beautiful-african-leopard-sitting-big-tree-trunk-middle-jungle.jpg",
    "/beautiful-shot-african-wildebeest-grassy-plain_181624-18962.jpg",
    "/beautiful-shot-three-zebras-crossing-road-safari-with-trees_181624-30309.jpg",
    "/cute-massai-giraffe-tsavo-east-national-park-kenya-africa_181624-20860.jpg",
    "/large (1).jpg",
    "/large (2).jpg",
    "/large (3).jpg",
    "/large.jpg"
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [destRes, safarisRes, routesRes, testimonialsRes] = await Promise.all([
        axios.get("/api/destinations").catch(() => ({ data: { data: [] } })),
        axios.get("/api/safaris").catch(() => ({ data: { data: [] } })),
        axios.get("/api/kilimanjaro-routes").catch(() => ({ data: { data: [] } })),
        axios.get("/api/testimonials").catch(() => ({ data: { data: [] } })),
      ]);

      setDestinations(destRes.data?.data || destRes.data || []);
      setSafaris(safarisRes.data?.data || safarisRes.data || []);
      setRoutes(routesRes.data?.data || routesRes.data || []);
      setTestimonials(testimonialsRes.data?.data || testimonialsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredSafaris = safaris.filter(s => s.featured).slice(0, 4);
  const featuredRoutes = routes.filter(r => r.featured).slice(0, 4);
  const displaySafaris = featuredSafaris.length > 0 ? featuredSafaris : safaris.slice(0, 4);
  const displayRoutes = featuredRoutes.length > 0 ? featuredRoutes : routes.slice(0, 4);

  return (
    <Layout>
      {/* Animated Slider Hero */}
      <section className="relative h-screen min-h-[700px] -mt-24 overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={heroImages[currentSlide]} 
              alt="Go Deep Africa Safari" 
              className="w-full h-full object-cover"
            />
            <div className="hero-gradient-strong absolute inset-0" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-center safari-container z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOutQuint, delay: 0.3 }}
            className="max-w-4xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutQuint, delay: 0.5 }}
              className="badge-meta bg-accent/20 text-accent mx-auto mb-6 backdrop-blur-md border border-accent/20"
            >
              Tanzania's Premier Safari Company
            </motion.p>
            <h1 className="text-hero font-serif text-primary-foreground mb-6 drop-shadow-2xl">
              Discover the Heart<br />of the Wild.
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-12 max-w-2xl mx-auto drop-shadow-lg"
            >
              Unforgettable Kilimanjaro climbs, high-end wildlife safaris, and custom Tanzanian adventures crafted by local experts.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-10 py-4 bg-accent text-accent-foreground rounded-full font-bold transition-all hover:opacity-90 hover:scale-[1.05] active:scale-[0.98] text-sm tracking-widest uppercase shadow-xl shadow-accent/20"
              >
                Plan Your Safari
              </button>
              <Link
                to="/kilimanjaro"
                className="px-10 py-4 bg-white/10 text-primary-foreground backdrop-blur-md rounded-full font-bold transition-all hover:bg-white/20 border border-white/20 text-sm tracking-widest uppercase shadow-xl"
              >
                Climb Kilimanjaro
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Slide Navigation Buttons */}
        <div className="absolute inset-x-0 bottom-12 flex items-center justify-between px-6 md:px-12 z-20 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all pointer-events-auto group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          {/* Progress Indicators */}
          <div className="flex gap-3 pointer-events-auto">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  currentSlide === idx ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            className="p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all pointer-events-auto group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-10">
        <StaggerContainer className="safari-container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "10,000+", label: "Happy Travelers" },
            { val: "98%", label: "Summit Success" },
            { val: "15+", label: "Years Experience" },
            { val: "500+", label: "5-Star Reviews" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <p className="text-3xl md:text-4xl font-serif text-accent">{s.val}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50 mt-2">{s.label}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Destinations */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <ScrollReveal className="text-center mb-16">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-4">Explore Tanzania</p>
            <h2 className="text-section font-serif text-foreground">Iconic Destinations</h2>
            <div className="luxury-divider mt-5" />
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg leading-relaxed">From the vast Serengeti plains to the tropical beaches of Zanzibar, discover Tanzania's most legendary destinations.</p>
          </ScrollReveal>

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
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinations.slice(0, 6).map((dest, i) => (
                <StaggerItem key={dest.id} className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                  <Link to={`/destination/${dest.slug || dest.id}`} className="route-card group block overflow-hidden rounded-2xl" style={{ aspectRatio: i === 0 ? "1" : "4/5" }}>
                    <img src={dest.image ? getStorageUrl(dest.image) : '/placeholder-destination.jpg'} alt={dest.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="hero-gradient absolute inset-0" />
                    <div className="card-content">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50 mb-1">{dest.region || 'Tanzania'}</p>
                      <h3 className={`font-serif text-primary-foreground ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>{dest.name}</h3>
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-sm text-accent">Explore</span>
                        <ArrowRight className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Full-width parallax break */}
      <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
        <motion.img
          src={getStorageUrl('/storage/hero/migration.jpg')}
          alt="Wildebeest Great Migration"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: easeOutQuint }}
          viewport={{ once: true }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative h-full flex items-center justify-center text-center safari-container">
          <ScrollReveal scale>
            <p className="badge-meta bg-accent/20 text-accent mb-4">The Greatest Show on Earth</p>
            <h2 className="text-section font-serif text-primary-foreground">Witness the Great Migration</h2>
            <p className="text-primary-foreground/70 mt-4 max-w-lg mx-auto text-lg">Over 2 million wildebeest cross the Serengeti in nature's most spectacular annual journey.</p>
            <Link to="/tanzania-safaris" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium text-sm uppercase tracking-wider hover:opacity-90 transition-all hover:scale-[1.02]">
              Explore Safari Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Kilimanjaro */}
      <section className="section-padding bg-secondary/40">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="badge-meta bg-accent/10 text-accent mb-4">
                <Mountain className="w-3.5 h-3.5" /> Kilimanjaro Climbing
              </p>
              <h2 className="text-section font-serif text-foreground mb-5">The Roof of Africa Awaits</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                Standing at 5,895m, Mount Kilimanjaro is Africa's tallest peak and one of the Seven Summits. Our expert guides have achieved a 98% summit success rate across all routes.
              </p>
              {routes.length === 0 ? (
                <p className="text-muted-foreground">Routes coming soon...</p>
              ) : (
                <div className="space-y-3 mb-8">
                  {displayRoutes.map((route) => (
                    <Link key={route.id} to={`/kilimanjaro/${route.slug || route.id}`}
                      className="flex items-center justify-between p-4 bg-card rounded-xl card-shadow hover:card-shadow-lg transition-shadow group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                          <Mountain className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{route.name}</h4>
                            {route.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Popular</span>}
                          </div>
                          <div className="flex gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">{route.days} Days</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{route.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline badge-meta bg-primary/5 text-primary">{route.success_rate || '90%'} success</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/kilimanjaro" className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors text-sm uppercase tracking-wider">
                View All Routes <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="route-card group aspect-[3/4] rounded-3xl overflow-hidden">
                <img src={routes[0]?.image ? getStorageUrl(routes[0].image) : getStorageUrl('/storage/kilimanjaro/kilimanjaro-climbing.jpg')} alt="Climbers ascending Kilimanjaro" className="w-full h-full object-cover" />
                <div className="hero-gradient absolute inset-0" />
                <div className="card-content p-8">
                  <p className="badge-meta bg-accent/20 text-accent mb-3">Most Popular</p>
                  <h3 className="font-serif text-4xl text-primary-foreground">{routes[0]?.name || 'Kilimanjaro Climb'}</h3>
                  <p className="text-primary-foreground/70 mt-2">{routes[0]?.days || 8} Days • {routes[0]?.success_rate || '95%'} Success Rate</p>
                  <button onClick={() => setInquiryOpen(true)} className="mt-4 px-6 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all">
                    Get a Free Quote
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Safari Packages */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <ScrollReveal className="text-center mb-16">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-4">
              <Binoculars className="w-3.5 h-3.5" /> Wildlife Adventures
            </p>
            <h2 className="text-section font-serif text-foreground">Tanzania Safari Packages</h2>
            <div className="luxury-divider mt-5" />
          </ScrollReveal>
          
          {safaris.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Binoculars className="h-12 w-12 text-accent" />
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
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {displaySafaris.map((safari) => (
                <StaggerItem key={safari.id}>
                  <Link to={`/safari/${safari.slug || safari.id}`} className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all">
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img src={safari.image ? getStorageUrl(safari.image) : '/placeholder-safari.jpg'} alt={safari.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                      <div className="absolute top-4 right-4">
                        <span className="badge-meta bg-primary/90 text-primary-foreground backdrop-blur-sm">
                          <Clock className="w-3 h-3" /> {safari.duration || `${safari.days} Days`}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 lg:p-8">
                      <h3 className="font-serif text-xl lg:text-2xl text-foreground group-hover:text-accent transition-colors">{safari.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{safari.short_description}</p>
                      <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
                        <span className="font-serif text-2xl text-accent">
                          {safari.currency || 'USD'} ${safari.price?.toLocaleString()}<span className="text-sm text-muted-foreground font-sans"> /person</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:text-accent transition-colors">
                          View Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
          <ScrollReveal className="text-center mt-12">
            <Link to="/tanzania-safaris" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
              View All Safaris <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Luxury Experience Section */}
      <section className="section-padding bg-primary text-primary-foreground overflow-hidden">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="badge-meta bg-accent/20 text-accent mb-4">
                <Tent className="w-3.5 h-3.5" /> Luxury Experience
              </p>
              <h2 className="text-section font-serif mb-5">Where Adventure Meets Comfort</h2>
              <p className="text-primary-foreground/70 leading-relaxed text-lg mb-8">
                After a day exploring the wild, retreat to luxury tented camps with panoramic views, gourmet dining, and personalized service that rivals the finest hotels.
              </p>
              <StaggerContainer className="grid grid-cols-2 gap-4">
                {[
                  { label: "Luxury Camps", value: "Hand-picked lodges" },
                  { label: "Gourmet Dining", value: "Bush cuisine" },
                  { label: "Private Guides", value: "Expert naturalists" },
                  { label: "Custom Journeys", value: "Tailored to you" },
                ].map((item) => (
                  <StaggerItem key={item.label}>
                    <div className="bg-primary-foreground/5 rounded-xl p-4 hover:bg-primary-foreground/10 transition-colors">
                      <p className="text-accent text-sm font-medium">{item.label}</p>
                      <p className="text-primary-foreground/60 text-xs mt-1">{item.value}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="image-reveal rounded-2xl aspect-[3/4] overflow-hidden">
                    <img src={getStorageUrl('/storage/gallery/luxury-lodge.jpg')} alt="Luxury safari lodge" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="image-reveal rounded-2xl aspect-square overflow-hidden">
                    <img src={getStorageUrl('/storage/gallery/leopard.jpg')} alt="Leopard on tree" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="image-reveal rounded-2xl aspect-square overflow-hidden">
                    <img src={getStorageUrl('/storage/gallery/wildlife-lion.jpg')} alt="Lion in the savannah" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="image-reveal rounded-2xl aspect-[3/4] overflow-hidden">
                    <img src={getStorageUrl('/storage/kilimanjaro/serengeti-sunset.jpg')} alt="Sunset safari" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-section font-serif text-foreground">Why Travel With Us</h2>
            <div className="luxury-divider mt-5" />
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item) => (
              <StaggerItem key={item.title} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Safari Vehicles */}
      <section className="section-padding bg-secondary/40">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="image-reveal rounded-3xl overflow-hidden">
                <img src={getStorageUrl('/storage/gallery/safari-vehicle.jpg')} alt="Safari vehicle in the Serengeti" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <p className="badge-meta bg-accent/10 text-accent mb-4">Our Fleet</p>
              <h2 className="text-section font-serif text-foreground mb-5">Premium Safari Vehicles</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                Travel in comfort aboard our fleet of custom-modified 4x4 Toyota Land Cruisers. Each vehicle features pop-up roofs for 360° wildlife viewing, charging ports, and refrigeration.
              </p>
              <ul className="space-y-4">
                {["Pop-up roof for panoramic game viewing", "Maximum 6 guests per vehicle", "Experienced, certified drivers", "Two-way radio communication"].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <ScrollReveal className="text-center mb-16">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-4">Traveler Reviews</p>
            <h2 className="text-section font-serif text-foreground">What Our Guests Say</h2>
            <div className="luxury-divider mt-5" />
          </ScrollReveal>
          
          {testimonials.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Star className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">Reviews Coming Soon</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Our travelers have amazing stories to share. Check back soon for testimonials from our safari and Kilimanjaro adventures.
                </p>
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] text-sm"
                >
                  Be Our Next Adventurer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((t) => (
                <StaggerItem key={t.id} className="bg-card rounded-2xl p-8 card-shadow relative">
                  <Quote className="w-10 h-10 text-accent/15 absolute top-6 right-6" />
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6">"{t.text}"</p>
                  <div className="pt-5 border-t border-border">
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.location} • {t.trip}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-36 overflow-hidden">
        <motion.img
          src="/beautiful-shot-african-wildebeest-grassy-plain_181624-18962.jpg"
          alt="Wildebeest Great Migration"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: easeOutQuint }}
          viewport={{ once: true }}
        />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative safari-container text-center">
          <ScrollReveal scale>
            <p className="badge-meta bg-accent/20 text-accent mb-5">Start Planning Today</p>
            <h2 className="text-section font-serif text-primary-foreground mb-5">Ready for Your<br />African Adventure?</h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-10 text-lg leading-relaxed">Let our expert team craft your perfect Tanzanian journey. No obligation, no commitment — just exceptional travel planning.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => setInquiryOpen(true)}
                className="px-10 py-4 bg-accent text-accent-foreground rounded-full font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
                Plan Your Safari <ArrowRight className="w-4 h-4 inline ml-2" />
              </button>
              <Link to="/contact"
                className="px-10 py-4 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm rounded-full font-medium transition-all hover:bg-primary-foreground/20 border border-primary-foreground/20 text-sm tracking-wide uppercase">
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
};

export default Index;
