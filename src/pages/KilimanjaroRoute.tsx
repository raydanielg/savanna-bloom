import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Clock, TrendingUp, MapPin, Check, X as XIcon, ArrowRight, ChevronDown, ChevronUp, Star, Thermometer, Sun } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import kiliClimbing from "@/assets/kilimanjaro-climbing.jpg";
import kiliHero from "@/assets/kilimanjaro-hero.jpg";
import kiliSummit from "@/assets/kili-summit.jpg";

import { fadeInUp } from "@/lib/animations";

interface RouteData {
  name: string; days: number; difficulty: string; success: string;
  maxAlt: string; desc: string; heroImage: string; gallery: string[];
  itinerary: { day: number; title: string; altitude: string; desc: string; distance?: string }[];
  inclusions: string[]; exclusions: string[];
  highlights: string[];
}

const routeData: Record<string, RouteData> = {
  "lemosho-route": {
    name: "Lemosho Route", days: 8, difficulty: "Moderate", success: "95%", maxAlt: "5,895m",
    desc: "The Lemosho Route is widely regarded as the most beautiful route on Kilimanjaro. Starting from the western Londorossi Gate, it traverses the pristine rainforest before crossing the Shira Plateau. With excellent acclimatization profiles, it offers one of the highest success rates.",
    heroImage: kiliClimbing,
    gallery: [kiliClimbing, kiliHero, kiliSummit],
    highlights: ["Most scenic route with diverse ecosystems", "Excellent acclimatization profile", "95% summit success rate", "Remote start with fewer crowds", "Traverse through 5 climate zones"],
    itinerary: [
      { day: 1, title: "Londorossi Gate to Mti Mkubwa Camp", altitude: "2,750m", distance: "6km", desc: "Drive to Londorossi Gate for registration, then trek through lush montane forest to the first camp. The trail winds through ancient trees draped in moss." },
      { day: 2, title: "Mti Mkubwa to Shira 2 Camp", altitude: "3,840m", distance: "14km", desc: "Ascend through the heather zone onto the spectacular Shira Plateau with panoramic views of Kibo peak emerging above the clouds." },
      { day: 3, title: "Shira 2 to Barranco Camp", altitude: "3,960m", distance: "10km", desc: "Climb to Lava Tower (4,630m) for acclimatization then descend to the stunning Barranco Valley. This 'climb high, sleep low' strategy is key to summit success." },
      { day: 4, title: "Barranco to Karanga Camp", altitude: "3,995m", distance: "5km", desc: "Scramble up the famous Barranco Wall — the most exhilarating section of the climb — then traverse to Karanga Camp." },
      { day: 5, title: "Karanga to Barafu Camp", altitude: "4,673m", distance: "4km", desc: "Final preparation day. Short but significant hike to Barafu base camp. Rest and prepare for the summit attempt." },
      { day: 6, title: "Summit Day — Uhuru Peak", altitude: "5,895m", distance: "7km", desc: "Depart at midnight under the stars for the summit push. Reach Uhuru Peak at sunrise for breathtaking views across Africa. Descend to Mweka Camp." },
      { day: 7, title: "Mweka Camp to Gate", altitude: "1,640m", distance: "10km", desc: "Final descent through the lush rainforest to Mweka Gate. Certificate ceremony and transfer to hotel." },
      { day: 8, title: "Departure Day", altitude: "—", desc: "Breakfast at hotel. Transfer to Kilimanjaro Airport or continue to an unforgettable safari." },
    ],
    inclusions: ["Professional KINAPA-certified mountain guides", "All park fees and camping fees", "Quality 4-season camping equipment", "All meals during the climb (3 per day)", "Emergency oxygen and first aid kit", "Airport transfers", "Pre and post-climb hotel nights (B&B)", "Rescue fees and evacuation insurance"],
    exclusions: ["International flights", "Travel/medical insurance", "Personal climbing gear & clothing", "Tips for guides and porters", "Visa fees ($50 USD)", "Personal expenses and souvenirs"],
  },
  "machame-route": {
    name: "Machame Route", days: 7, difficulty: "Moderate-Hard", success: "90%", maxAlt: "5,895m",
    desc: "The Machame Route, known as the 'Whiskey Route', is one of the most popular paths on Kilimanjaro. It offers diverse scenery through rainforest, heath, moorland, alpine desert, and glaciers.",
    heroImage: kiliHero,
    gallery: [kiliHero, kiliClimbing, kiliSummit],
    highlights: ["Known as the 'Whiskey Route'", "Diverse and dramatic scenery", "Steep and challenging terrain", "Popular with experienced hikers", "Stunning glacier views"],
    itinerary: [
      { day: 1, title: "Machame Gate to Machame Camp", altitude: "3,000m", distance: "11km", desc: "Trek through the rainforest zone with its incredible biodiversity." },
      { day: 2, title: "Machame Camp to Shira Camp", altitude: "3,840m", distance: "5km", desc: "Climb through heather and moorland to the Shira Plateau." },
      { day: 3, title: "Shira Camp to Barranco Camp", altitude: "3,960m", distance: "10km", desc: "Acclimatization hike to Lava Tower (4,630m) then descent." },
      { day: 4, title: "Barranco to Karanga Camp", altitude: "3,995m", distance: "5km", desc: "Climb the Barranco Wall, then traverse to Karanga." },
      { day: 5, title: "Karanga to Barafu Camp", altitude: "4,673m", distance: "4km", desc: "Short but steep climb to summit base camp." },
      { day: 6, title: "Summit Day — Uhuru Peak", altitude: "5,895m", distance: "7km", desc: "Midnight summit push. Descend to Mweka Camp." },
      { day: 7, title: "Mweka Camp to Gate", altitude: "1,640m", distance: "10km", desc: "Final descent through rainforest." },
    ],
    inclusions: ["Professional mountain guides", "All park fees", "Camping equipment", "All meals", "Emergency oxygen", "Airport transfers", "Hotel nights"],
    exclusions: ["Flights", "Travel insurance", "Personal gear", "Tips", "Visa fees"],
  },
};

const defaultRoute: RouteData = {
  name: "Kilimanjaro Route", days: 7, difficulty: "Moderate", success: "90%", maxAlt: "5,895m",
  desc: "An incredible journey to the Roof of Africa through diverse ecological zones. Contact us for the full detailed itinerary.",
  heroImage: kiliClimbing,
  gallery: [kiliClimbing, kiliHero, kiliSummit],
  highlights: ["Professional certified guides", "High summit success rate", "Beautiful diverse scenery", "All-inclusive packages", "Small group sizes"],
  itinerary: [
    { day: 1, title: "Arrival and Registration", altitude: "2,800m", desc: "Begin your trek through the mountain's lower slopes." },
    { day: 2, title: "Forest to Moorland", altitude: "3,500m", desc: "Ascend through changing vegetation zones." },
    { day: 3, title: "Acclimatization Day", altitude: "4,200m", desc: "Hike high, sleep low for proper acclimatization." },
    { day: 4, title: "Alpine Desert", altitude: "4,600m", desc: "Enter the stark beauty of the alpine desert." },
    { day: 5, title: "Base Camp", altitude: "4,700m", desc: "Final preparations for summit night." },
    { day: 6, title: "Summit Day", altitude: "5,895m", desc: "Reach Uhuru Peak and descend." },
    { day: 7, title: "Descent and Departure", altitude: "1,640m", desc: "Return to the gate and transfer." },
  ],
  inclusions: ["Professional guides", "Park fees", "Camping equipment", "Meals", "Emergency oxygen", "Transfers", "Hotel"],
  exclusions: ["Flights", "Insurance", "Personal gear", "Tips", "Visa"],
};

const KilimanjaroRoute = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const route = routeData[slug] || defaultRoute;
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const displayName = routeData[slug] ? route.name : slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] -mt-24">
        <img src={route.heroImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-16 safari-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="badge-meta bg-accent/20 text-accent mb-3">
              <Mountain className="w-3.5 h-3.5" /> Kilimanjaro Climbing
            </p>
            <h1 className="text-hero font-serif text-primary-foreground mb-4">{displayName}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm"><Clock className="w-3 h-3" /> {route.days} Days</span>
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm"><TrendingUp className="w-3 h-3" /> {route.difficulty}</span>
              <span className="badge-meta bg-accent/25 text-accent backdrop-blur-sm"><Mountain className="w-3 h-3" /> {route.maxAlt}</span>
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm"><Star className="w-3 h-3" /> {route.success} Success</span>
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
                <p className="text-muted-foreground leading-relaxed text-lg">{route.desc}</p>
              </motion.div>

              {/* Highlights */}
              <motion.div {...fadeInUp} className="mt-12">
                <h3 className="text-subsection font-serif text-foreground mb-6">Route Highlights</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {route.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Gallery */}
              <motion.div {...fadeInUp} className="mt-12">
                <h3 className="text-subsection font-serif text-foreground mb-6">Photo Gallery</h3>
                <div className="space-y-4">
                  <div className="image-reveal rounded-2xl aspect-[16/9] overflow-hidden">
                    <img src={route.gallery[selectedImage]} alt={`${displayName} view`} className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {route.gallery.map((img, i) => (
                      <button key={i} onClick={() => setSelectedImage(i)}
                        className={`aspect-[4/3] rounded-xl overflow-hidden transition-all ${selectedImage === i ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Itinerary */}
              <motion.div {...fadeInUp} className="mt-16">
                <h2 className="text-section font-serif text-foreground mb-8">Day-by-Day Itinerary</h2>
                <div className="relative pl-10">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent via-border to-border" />
                  <div className="space-y-4">
                    {route.itinerary.map((day, i) => (
                      <motion.div key={day.day} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.04 }}>
                        <button onClick={() => setExpandedDay(expandedDay === i ? null : i)} className="w-full text-left">
                          <div className="flex items-start gap-5">
                            <div className={`relative -ml-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${expandedDay === i ? "bg-accent ring-4 ring-background scale-110" : "bg-card border-2 border-border"}`}>
                              <span className={`text-[11px] font-bold ${expandedDay === i ? "text-accent-foreground" : "text-muted-foreground"}`}>{day.day}</span>
                            </div>
                            <div className="flex-1 bg-card rounded-2xl p-5 card-shadow hover:card-shadow-lg transition-shadow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-foreground text-base">Day {day.day}: {day.title}</h4>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className="badge-meta bg-muted text-muted-foreground"><MapPin className="w-3 h-3" /> {day.altitude}</span>
                                    {day.distance && <span className="badge-meta bg-muted text-muted-foreground">{day.distance}</span>}
                                  </div>
                                </div>
                                {expandedDay === i ? <ChevronUp className="w-5 h-5 text-accent" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <AnimatePresence>
                                {expandedDay === i && (
                                  <motion.p 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-sm text-muted-foreground mt-4 leading-relaxed border-t border-border pt-4"
                                  >
                                    {day.desc}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Inclusions */}
              <motion.div {...fadeInUp} className="mt-16 grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-8 card-shadow">
                  <h3 className="font-serif text-xl text-foreground mb-5 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" /> What's Included
                  </h3>
                  <ul className="space-y-3">
                    {route.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card rounded-2xl p-8 card-shadow">
                  <h3 className="font-serif text-xl text-foreground mb-5 flex items-center gap-2">
                    <XIcon className="w-5 h-5 text-destructive" /> Not Included
                  </h3>
                  <ul className="space-y-3">
                    {route.exclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <XIcon className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-28 space-y-6">
                <div className="bg-card rounded-2xl p-8 card-shadow-lg">
                  <h3 className="font-serif text-xl text-foreground mb-6">Quick Facts</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Clock, label: "Duration", value: `${route.days} Days` },
                      { icon: TrendingUp, label: "Difficulty", value: route.difficulty },
                      { icon: Mountain, label: "Max Altitude", value: route.maxAlt },
                      { icon: Star, label: "Success Rate", value: route.success },
                      { icon: Sun, label: "Best Season", value: "Jan-Mar, Jun-Oct" },
                      { icon: Thermometer, label: "Summit Temp", value: "-15°C to -25°C" },
                    ].map((fact) => (
                      <div key={fact.label} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <fact.icon className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs text-muted-foreground">{fact.label}</span>
                          <p className="text-sm font-medium text-foreground">{fact.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-accent/5 rounded-2xl p-8 border border-accent/20">
                  <p className="font-serif text-lg text-foreground mb-2">Ready to climb?</p>
                  <p className="text-sm text-muted-foreground mb-5">Get a free, no-obligation quote for your Kilimanjaro expedition.</p>
                  <button onClick={() => setInquiryOpen(true)}
                    className="w-full px-6 py-4 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase">
                    Get Free Quote
                  </button>
                </div>

                <button onClick={() => setInquiryOpen(true)}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
                  Inquire About This Route <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour={`${displayName} (${route.days} Days)`} />
    </Layout>
  );
};

export default KilimanjaroRoute;
