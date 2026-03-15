import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Users, Award, Mountain, Compass, Clock, ChevronRight, Binoculars, Tent, Quote } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";

import heroSafari from "@/assets/hero-safari.jpg";
import kiliHero from "@/assets/kilimanjaro-hero.jpg";
import kiliClimbing from "@/assets/kilimanjaro-climbing.jpg";
import serengeti from "@/assets/serengeti.jpg";
import ngorongoro from "@/assets/ngorongoro.jpg";
import zanzibar from "@/assets/zanzibar.jpg";
import tarangire from "@/assets/tarangire.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";
import wildlifeLion from "@/assets/wildlife-lion.jpg";
import safariVehicle from "@/assets/safari-vehicle.jpg";
import migration from "@/assets/migration.jpg";
import luxuryCamp from "@/assets/luxury-camp.jpg";
import elephant from "@/assets/elephant.jpg";
import kiliSummit from "@/assets/kili-summit.jpg";
import leopard from "@/assets/leopard.jpg";
import zanzibarBeach from "@/assets/zanzibar-beach.jpg";

import { fadeInUp, easeOutQuint } from "@/lib/animations";

const destinations = [
  { name: "Serengeti", subtitle: "Great Migration", image: serengeti, tours: 12, href: "/serengeti-safari" },
  { name: "Ngorongoro", subtitle: "The Eighth Wonder", image: ngorongoro, tours: 8, href: "/ngorongoro-safari" },
  { name: "Kilimanjaro", subtitle: "Roof of Africa", image: kiliSummit, tours: 6, href: "/kilimanjaro" },
  { name: "Zanzibar", subtitle: "Spice Island Paradise", image: zanzibarBeach, tours: 5, href: "/zanzibar-tour" },
  { name: "Tarangire", subtitle: "Elephant Kingdom", image: tarangire, tours: 7, href: "/tarangire-safari" },
  { name: "Lake Manyara", subtitle: "Tree-Climbing Lions", image: lakeManyara, tours: 4, href: "/lake-manyara-safari" },
];

const kiliRoutes = [
  { name: "Lemosho Route", days: "8 Days", difficulty: "Moderate", rate: "95%", href: "/lemosho-route", tag: "Most Popular" },
  { name: "Machame Route", days: "7 Days", difficulty: "Moderate-Hard", rate: "90%", href: "/machame-route" },
  { name: "Marangu Route", days: "6 Days", difficulty: "Moderate", rate: "85%", href: "/marangu-route" },
  { name: "Northern Circuit", days: "9 Days", difficulty: "Moderate", rate: "97%", href: "/northern-circuit", tag: "Highest Success" },
];

const safaris = [
  { name: "Serengeti Great Migration", days: "5 Days", price: "$2,400", image: migration, href: "/serengeti-safari", desc: "Witness millions of wildebeest cross the Mara River" },
  { name: "Ngorongoro Crater Safari", days: "3 Days", price: "$1,800", image: ngorongoro, href: "/ngorongoro-safari", desc: "Explore the world's largest volcanic caldera" },
  { name: "Tarangire Elephant Safari", days: "4 Days", price: "$1,600", image: elephant, href: "/tarangire-safari", desc: "Walk among herds of 300+ elephants" },
  { name: "Zanzibar Beach Escape", days: "5 Days", price: "$1,200", image: zanzibarBeach, href: "/zanzibar-tour", desc: "Pristine beaches and rich Swahili culture" },
];

const testimonials = [
  { name: "Sarah & James Mitchell", location: "United Kingdom", text: "An absolutely life-changing experience. The guides were incredibly knowledgeable and made us feel safe throughout the entire Kilimanjaro climb. We summited at sunrise — a memory we'll treasure forever.", rating: 5, trip: "Lemosho Route" },
  { name: "Michael Rodriguez", location: "United States", text: "The Serengeti safari exceeded all expectations. We saw the Big Five on our first day! The luxury camps were outstanding — we fell asleep listening to lions roar.", rating: 5, trip: "Serengeti Safari" },
  { name: "Anna & Klaus Weber", location: "Germany", text: "From start to finish, everything was perfectly organized. The team went above and beyond to make our honeymoon safari magical. The Ngorongoro sunrise was unreal.", rating: 5, trip: "Honeymoon Safari" },
];

const whyUs = [
  { icon: Shield, title: "Safety First", desc: "Certified guides, emergency protocols, and medical support on every expedition." },
  { icon: Award, title: "98% Summit Rate", desc: "Our expert acclimatization profiles ensure the highest success rates on Kilimanjaro." },
  { icon: Users, title: "15+ Years Experience", desc: "Over 10,000 satisfied travelers since 2008, with deep local expertise." },
  { icon: Compass, title: "Custom Itineraries", desc: "Every journey is tailored to your preferences, pace, and budget." },
];

const Index = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-screen min-h-[700px] -mt-24">
        <img src={heroSafari} alt="African savannah at golden hour with elephants" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-24 md:pb-32 safari-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeOutQuint, delay: 0.3 }}
            className="max-w-3xl"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutQuint, delay: 0.5 }}
              className="badge-meta bg-accent/20 text-accent mb-5"
            >
              Tanzania's Premier Safari Company
            </motion.p>
            <h1 className="text-hero font-serif text-primary-foreground mb-5">
              The Wild<br />is Calling.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-10 max-w-xl">
              Kilimanjaro climbs, wildlife safaris, and unforgettable adventures across Tanzania — crafted by local experts who call this land home.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase"
              >
                Plan Your Safari
              </button>
              <Link
                to="/kilimanjaro"
                className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm rounded-full font-medium transition-all hover:bg-primary-foreground/20 border border-primary-foreground/20 text-sm tracking-wide uppercase"
              >
                Climb Kilimanjaro
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-primary-foreground/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="safari-container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "10,000+", label: "Happy Travelers" },
            { val: "98%", label: "Summit Success" },
            { val: "15+", label: "Years Experience" },
            { val: "500+", label: "5-Star Reviews" },
          ].map((s, i) => (
            <motion.div key={s.label} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
              <p className="text-3xl md:text-4xl font-serif text-accent">{s.val}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Destinations — Masonry-style grid */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-4">Explore Tanzania</p>
            <h2 className="text-section font-serif text-foreground">Iconic Destinations</h2>
            <div className="luxury-divider mt-5" />
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg leading-relaxed">From the vast Serengeti plains to the tropical beaches of Zanzibar, discover Tanzania's most legendary destinations.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((dest, i) => (
              <motion.div 
                key={dest.name} 
                {...fadeInUp} 
                transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
                className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
              >
                <Link to={dest.href} className="route-card group block overflow-hidden rounded-2xl" style={{ aspectRatio: i === 0 ? "1" : "4/5" }}>
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="hero-gradient absolute inset-0" />
                  <div className="card-content">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50 mb-1">{dest.subtitle}</p>
                    <h3 className={`font-serif text-primary-foreground ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>{dest.name}</h3>
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-sm text-accent">{dest.tours} Tours</span>
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width image break */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={migration} alt="Wildebeest Great Migration" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative h-full flex items-center justify-center text-center safari-container">
          <motion.div {...fadeInUp}>
            <p className="badge-meta bg-accent/20 text-accent mb-4">The Greatest Show on Earth</p>
            <h2 className="text-section font-serif text-primary-foreground">Witness the Great Migration</h2>
            <p className="text-primary-foreground/70 mt-3 max-w-lg mx-auto">Over 2 million wildebeest cross the Serengeti in nature's most spectacular annual journey.</p>
            <Link to="/serengeti-safari" className="inline-flex items-center gap-2 mt-6 text-accent hover:text-primary-foreground transition-colors font-medium text-sm uppercase tracking-wider">
              Explore Safari Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Kilimanjaro */}
      <section className="section-padding bg-secondary/40">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <p className="badge-meta bg-accent/10 text-accent mb-4">
                <Mountain className="w-3.5 h-3.5" /> Kilimanjaro Climbing
              </p>
              <h2 className="text-section font-serif text-foreground mb-5">The Roof of Africa Awaits</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                Standing at 5,895m, Mount Kilimanjaro is Africa's tallest peak and one of the Seven Summits. Our expert guides have achieved a 98% summit success rate across all routes.
              </p>
              <div className="space-y-3 mb-8">
                {kiliRoutes.map((route) => (
                  <Link key={route.name} to={route.href}
                    className="flex items-center justify-between p-4 bg-card rounded-xl card-shadow hover:card-shadow-lg transition-shadow group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <Mountain className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{route.name}</h4>
                          {route.tag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{route.tag}</span>}
                        </div>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{route.days}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{route.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline badge-meta bg-primary/5 text-primary">{route.rate} success</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/kilimanjaro" className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors text-sm uppercase tracking-wider">
                View All Routes <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <div className="route-card group aspect-[3/4] rounded-3xl overflow-hidden">
                <img src={kiliClimbing} alt="Climbers ascending Kilimanjaro" className="w-full h-full object-cover" />
                <div className="hero-gradient absolute inset-0" />
                <div className="card-content p-8">
                  <p className="badge-meta bg-accent/20 text-accent mb-3">Most Popular</p>
                  <h3 className="font-serif text-4xl text-primary-foreground">Lemosho Route</h3>
                  <p className="text-primary-foreground/70 mt-2">8 Days • 95% Success Rate</p>
                  <button onClick={() => setInquiryOpen(true)} className="mt-4 px-6 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all">
                    Get a Free Quote
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safari Packages */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-4">
              <Binoculars className="w-3.5 h-3.5" /> Wildlife Adventures
            </p>
            <h2 className="text-section font-serif text-foreground">Tanzania Safari Packages</h2>
            <div className="luxury-divider mt-5" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {safaris.map((safari, i) => (
              <motion.div key={safari.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <Link to={safari.href} className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-all">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img src={safari.image} alt={safari.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" loading="lazy" />
                    <div className="absolute top-4 right-4">
                      <span className="badge-meta bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        <Clock className="w-3 h-3" /> {safari.days}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <h3 className="font-serif text-xl lg:text-2xl text-foreground group-hover:text-accent transition-colors">{safari.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{safari.desc}</p>
                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
                      <span className="font-serif text-2xl text-accent">
                        {safari.price}<span className="text-sm text-muted-foreground font-sans"> /person</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:text-accent transition-colors">
                        View Details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeInUp} className="text-center mt-12">
            <Link to="/tanzania-safaris" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
              View All Safaris <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Luxury Experience Section */}
      <section className="section-padding bg-primary text-primary-foreground overflow-hidden">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <p className="badge-meta bg-accent/20 text-accent mb-4">
                <Tent className="w-3.5 h-3.5" /> Luxury Experience
              </p>
              <h2 className="text-section font-serif mb-5">Where Adventure Meets Comfort</h2>
              <p className="text-primary-foreground/70 leading-relaxed text-lg mb-8">
                After a day exploring the wild, retreat to luxury tented camps with panoramic views, gourmet dining, and personalized service that rivals the finest hotels.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Luxury Camps", value: "Hand-picked lodges" },
                  { label: "Gourmet Dining", value: "Bush cuisine" },
                  { label: "Private Guides", value: "Expert naturalists" },
                  { label: "Custom Journeys", value: "Tailored to you" },
                ].map((item) => (
                  <div key={item.label} className="bg-primary-foreground/5 rounded-xl p-4">
                    <p className="text-accent text-sm font-medium">{item.label}</p>
                    <p className="text-primary-foreground/60 text-xs mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="image-reveal rounded-2xl aspect-[3/4]">
                    <img src={luxuryCamp} alt="Luxury safari camp" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="image-reveal rounded-2xl aspect-square">
                    <img src={leopard} alt="Leopard on tree" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="image-reveal rounded-2xl aspect-square">
                    <img src={wildlifeLion} alt="Lion in the savannah" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="image-reveal rounded-2xl aspect-[3/4]">
                    <img src={elephant} alt="Elephant at sunset" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-section font-serif text-foreground">Why Travel With Us</h2>
            <div className="luxury-divider mt-5" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safari Vehicles */}
      <section className="section-padding bg-secondary/40">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <div className="image-reveal rounded-3xl overflow-hidden">
                <img src={safariVehicle} alt="Safari vehicle in the Serengeti" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-4">Traveler Reviews</p>
            <h2 className="text-section font-serif text-foreground">What Our Guests Say</h2>
            <div className="luxury-divider mt-5" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-8 card-shadow relative">
                <Quote className="w-10 h-10 text-accent/15 absolute top-6 right-6" />
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6">"{t.text}"</p>
                <div className="pt-5 border-t border-border">
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.location} • {t.trip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <img src={kiliSummit} alt="Kilimanjaro summit at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative safari-container text-center">
          <motion.div {...fadeInUp}>
            <p className="badge-meta bg-accent/20 text-accent mb-5">Start Planning Today</p>
            <h2 className="text-section font-serif text-primary-foreground mb-5">Ready for Your<br />African Adventure?</h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-10 text-lg leading-relaxed">Let our expert team craft your perfect Tanzanian journey. No obligation, no commitment — just exceptional travel planning.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => setInquiryOpen(true)}
                className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
                Plan Your Safari <ArrowRight className="w-4 h-4 inline ml-2" />
              </button>
              <Link to="/contact"
                className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm rounded-full font-medium transition-all hover:bg-primary-foreground/20 border border-primary-foreground/20 text-sm tracking-wide uppercase">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
};

export default Index;
