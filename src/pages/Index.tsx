import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Users, Award, Mountain, Compass, Camera, Clock, MapPin, ChevronRight } from "lucide-react";
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

import { fadeInUp, easeOutQuint } from "@/lib/animations";

const destinations = [
  { name: "Serengeti", image: serengeti, tours: 12, href: "/serengeti-safari" },
  { name: "Ngorongoro", image: ngorongoro, tours: 8, href: "/ngorongoro-safari" },
  { name: "Kilimanjaro", image: kiliHero, tours: 6, href: "/kilimanjaro" },
  { name: "Zanzibar", image: zanzibar, tours: 5, href: "/zanzibar-tour" },
  { name: "Tarangire", image: tarangire, tours: 7, href: "/tarangire-safari" },
  { name: "Lake Manyara", image: lakeManyara, tours: 4, href: "/lake-manyara-safari" },
];

const kiliRoutes = [
  { name: "Lemosho Route", days: "8 Days", difficulty: "Moderate", rate: "95%", href: "/lemosho-route" },
  { name: "Machame Route", days: "7 Days", difficulty: "Moderate-Hard", rate: "90%", href: "/machame-route" },
  { name: "Marangu Route", days: "6 Days", difficulty: "Moderate", rate: "85%", href: "/marangu-route" },
  { name: "Northern Circuit", days: "9 Days", difficulty: "Moderate", rate: "97%", href: "/northern-circuit" },
];

const safaris = [
  { name: "Serengeti Great Migration", days: "5 Days", price: "$2,400", image: serengeti, href: "/serengeti-safari" },
  { name: "Ngorongoro Crater Safari", days: "3 Days", price: "$1,800", image: ngorongoro, href: "/ngorongoro-safari" },
  { name: "Tarangire Elephant Safari", days: "4 Days", price: "$1,600", image: tarangire, href: "/tarangire-safari" },
  { name: "Zanzibar Beach Escape", days: "5 Days", price: "$1,200", image: zanzibar, href: "/zanzibar-tour" },
];

const testimonials = [
  { name: "Sarah & James", location: "United Kingdom", text: "An absolutely life-changing experience. The guides were incredibly knowledgeable and made us feel safe throughout the entire Kilimanjaro climb.", rating: 5 },
  { name: "Michael R.", location: "United States", text: "The Serengeti safari exceeded all expectations. We saw the Big Five on our first day! The luxury camps were outstanding.", rating: 5 },
  { name: "Anna K.", location: "Germany", text: "From start to finish, everything was perfectly organized. The team went above and beyond to make our honeymoon safari magical.", rating: 5 },
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
      <section className="relative h-screen min-h-[600px] -mt-24">
        <img src={heroSafari} alt="African savannah at golden hour with elephants" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative h-full flex items-end pb-20 md:pb-28 safari-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutQuint, delay: 0.2 }}
            className="max-w-3xl"
          >
            <p className="badge-meta bg-accent/20 text-accent mb-4">Tanzania's Premier Safari Company</p>
            <h1 className="text-hero font-serif text-primary-foreground mb-4">
              The Wild is Calling.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-xl">
              Kilimanjaro climbs, wildlife safaris, and unforgettable adventures across Tanzania — crafted by local experts.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Begin Your Expedition
              </button>
              <Link
                to="/kilimanjaro"
                className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm rounded-full font-medium transition-all hover:bg-primary-foreground/20 border border-primary-foreground/20"
              >
                Explore Routes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="safari-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "10,000+", label: "Happy Travelers" },
            { val: "98%", label: "Summit Success" },
            { val: "15+", label: "Years Experience" },
            { val: "500+", label: "5-Star Reviews" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-serif text-accent">{s.val}</p>
              <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-3">Explore Tanzania</p>
            <h2 className="text-section font-serif text-foreground">Popular Destinations</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">From the vast Serengeti plains to the tropical beaches of Zanzibar, discover Tanzania's most iconic destinations.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <motion.div key={dest.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <Link to={dest.href} className="route-card block aspect-[4/5]">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="hero-gradient absolute inset-0" />
                  <div className="card-content">
                    <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-1">{dest.tours} Tours Available</p>
                    <h3 className="font-serif text-2xl text-primary-foreground">{dest.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kilimanjaro */}
      <section className="section-padding bg-secondary/50">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <p className="badge-meta bg-accent/10 text-accent mb-3">
                <Mountain className="w-3.5 h-3.5" /> Kilimanjaro Climbing
              </p>
              <h2 className="text-section font-serif text-foreground mb-4">The Roof of Africa is Calling</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Standing at 5,895m, Mount Kilimanjaro is Africa's tallest peak and one of the Seven Summits. Our expert guides have achieved a 98% summit success rate across all routes.
              </p>
              <div className="space-y-3 mb-8">
                {kiliRoutes.map((route) => (
                  <Link key={route.name} to={route.href}
                    className="flex items-center justify-between p-4 bg-card rounded-xl card-shadow hover:shadow-md transition-shadow group">
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{route.name}</h4>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{route.days}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{route.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge-meta bg-primary/10 text-primary">{route.rate} success</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/kilimanjaro" className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors">
                View All Routes <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <div className="route-card aspect-[4/5]">
                <img src={kiliClimbing} alt="Climbers ascending Kilimanjaro" className="w-full h-full object-cover" />
                <div className="hero-gradient absolute inset-0" />
                <div className="card-content">
                  <p className="badge-meta bg-accent/20 text-accent mb-2">Most Popular</p>
                  <h3 className="font-serif text-3xl text-primary-foreground">Lemosho Route</h3>
                  <p className="text-primary-foreground/70 text-sm mt-1">8 Days • 95% Success Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safari Packages */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-3">Wildlife Adventures</p>
            <h2 className="text-section font-serif text-foreground">Tanzania Safari Packages</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safaris.map((safari, i) => (
              <motion.div key={safari.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <Link to={safari.href} className="route-card block aspect-[16/10]">
                  <img src={safari.image} alt={safari.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="hero-gradient absolute inset-0" />
                  <div className="card-content">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-serif text-2xl text-primary-foreground">{safari.name}</h3>
                        <div className="flex gap-3 mt-1">
                          <span className="badge-meta bg-primary-foreground/20 text-primary-foreground text-[11px]">
                            <Clock className="w-3 h-3" /> {safari.days}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif text-2xl text-accent">
                        {safari.price}<span className="text-sm text-primary-foreground/60">/pp</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeInUp} className="text-center mt-10">
            <Link to="/tanzania-safaris" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              View All Safaris <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-section font-serif">Why Travel With Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safari Vehicles */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <div className="rounded-2xl overflow-hidden">
                <img src={safariVehicle} alt="Safari vehicle in the Serengeti" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <p className="badge-meta bg-accent/10 text-accent mb-3">Our Fleet</p>
              <h2 className="text-section font-serif text-foreground mb-4">Premium Safari Vehicles</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Travel in comfort aboard our fleet of custom-modified 4x4 Toyota Land Cruisers. Each vehicle features pop-up roofs for 360° wildlife viewing, charging ports, and refrigeration.
              </p>
              <ul className="space-y-3">
                {["Pop-up roof for panoramic game viewing", "Maximum 6 guests per vehicle", "Experienced, certified drivers", "Two-way radio communication"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/50">
        <div className="safari-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="badge-meta bg-accent/10 text-accent mx-auto mb-3">Traveler Reviews</p>
            <h2 className="text-section font-serif text-foreground">What Our Guests Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 card-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="font-medium text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <img src={wildlifeLion} alt="Lion in the savannah" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative safari-container text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-section font-serif text-primary-foreground mb-4">Ready for Your African Adventure?</h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">Let our expert team craft your perfect Tanzanian journey. No obligation, no commitment — just exceptional travel planning.</p>
            <button onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]">
              Plan Your Safari <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </Layout>
  );
};

export default Index;
