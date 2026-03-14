import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mountain, Clock, TrendingUp, MapPin, Check, X as XIcon, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import kiliClimbing from "@/assets/kilimanjaro-climbing.jpg";
import kiliHero from "@/assets/kilimanjaro-hero.jpg";

import { fadeInUp, staggerDelay } from "@/lib/animations";

interface RouteData {
  name: string; days: number; difficulty: string; success: string;
  maxAlt: string; desc: string; heroImage: string;
  itinerary: { day: number; title: string; altitude: string; desc: string }[];
  inclusions: string[]; exclusions: string[];
}

const routeData: Record<string, RouteData> = {
  "lemosho-route": {
    name: "Lemosho Route", days: 8, difficulty: "Moderate", success: "95%", maxAlt: "5,895m",
    desc: "The Lemosho Route is widely regarded as the most beautiful route on Kilimanjaro. Starting from the western Londorossi Gate, it traverses the pristine rainforest before crossing the Shira Plateau. With excellent acclimatization profiles, it offers one of the highest success rates.",
    heroImage: kiliClimbing,
    itinerary: [
      { day: 1, title: "Londorossi Gate to Mti Mkubwa Camp", altitude: "2,750m", desc: "Drive to Londorossi Gate for registration, then trek through lush montane forest to the first camp." },
      { day: 2, title: "Mti Mkubwa to Shira 2 Camp", altitude: "3,840m", desc: "Ascend through the heather zone onto the spectacular Shira Plateau with views of Kibo peak." },
      { day: 3, title: "Shira 2 to Barranco Camp", altitude: "3,960m", desc: "Climb to Lava Tower (4,630m) for acclimatization then descend to Barranco Camp." },
      { day: 4, title: "Barranco to Karanga Camp", altitude: "3,995m", desc: "Scramble up the famous Barranco Wall, then traverse to Karanga Camp." },
      { day: 5, title: "Karanga to Barafu Camp", altitude: "4,673m", desc: "Final preparation day. Short hike to Barafu base camp for summit night." },
      { day: 6, title: "Summit Day — Uhuru Peak", altitude: "5,895m", desc: "Depart at midnight for the summit push. Reach Uhuru Peak at sunrise. Descend to Mweka Camp." },
      { day: 7, title: "Mweka Camp to Gate", altitude: "1,640m", desc: "Final descent through the rainforest to Mweka Gate. Transfer to hotel." },
      { day: 8, title: "Departure Day", altitude: "—", desc: "Transfer to Kilimanjaro Airport or continue to safari." },
    ],
    inclusions: ["Professional mountain guides", "All park fees and camping fees", "Quality camping equipment", "All meals during the climb", "Emergency oxygen and first aid", "Airport transfers", "Pre and post-climb hotel nights"],
    exclusions: ["International flights", "Travel insurance", "Personal climbing gear", "Tips for guides and porters", "Visa fees"],
  },
  "machame-route": {
    name: "Machame Route", days: 7, difficulty: "Moderate-Hard", success: "90%", maxAlt: "5,895m",
    desc: "The Machame Route, known as the 'Whiskey Route', is one of the most popular paths on Kilimanjaro. It offers diverse scenery through rainforest, heath, moorland, alpine desert, and glaciers.",
    heroImage: kiliHero,
    itinerary: [
      { day: 1, title: "Machame Gate to Machame Camp", altitude: "3,000m", desc: "Trek through the rainforest zone with its incredible biodiversity." },
      { day: 2, title: "Machame Camp to Shira Camp", altitude: "3,840m", desc: "Climb through heather and moorland to the Shira Plateau." },
      { day: 3, title: "Shira Camp to Barranco Camp", altitude: "3,960m", desc: "Acclimatization hike to Lava Tower (4,630m) then descent." },
      { day: 4, title: "Barranco to Karanga Camp", altitude: "3,995m", desc: "Climb the Barranco Wall, then traverse to Karanga." },
      { day: 5, title: "Karanga to Barafu Camp", altitude: "4,673m", desc: "Short but steep climb to summit base camp." },
      { day: 6, title: "Summit Day — Uhuru Peak", altitude: "5,895m", desc: "Midnight summit push. Descend to Mweka Camp." },
      { day: 7, title: "Mweka Camp to Gate", altitude: "1,640m", desc: "Final descent through rainforest." },
    ],
    inclusions: ["Professional mountain guides", "All park fees", "Camping equipment", "All meals", "Emergency oxygen", "Airport transfers", "Hotel nights"],
    exclusions: ["Flights", "Travel insurance", "Personal gear", "Tips", "Visa fees"],
  },
};

// Default fallback for routes without full data
const defaultRoute: RouteData = {
  name: "Kilimanjaro Route", days: 7, difficulty: "Moderate", success: "90%", maxAlt: "5,895m",
  desc: "An incredible journey to the Roof of Africa through diverse ecological zones. Contact us for the full detailed itinerary.",
  heroImage: kiliClimbing,
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

  const displayName = routeData[slug] ? route.name : slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] -mt-24">
        <img src={route.heroImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative h-full flex items-end pb-12 safari-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-hero font-serif text-primary-foreground mb-2">{displayName}</h1>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="badge-meta bg-primary-foreground/20 text-primary-foreground"><Clock className="w-3 h-3" /> {route.days} Days</span>
              <span className="badge-meta bg-primary-foreground/20 text-primary-foreground"><TrendingUp className="w-3 h-3" /> {route.difficulty}</span>
              <span className="badge-meta bg-accent/30 text-accent"><Mountain className="w-3 h-3" /> {route.maxAlt}</span>
              <span className="badge-meta bg-primary-foreground/20 text-primary-foreground">{route.success} Success Rate</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12">
            {/* Main Content */}
            <div>
              <motion.div {...fadeInUp}>
                <h2 className="text-section font-serif text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{route.desc}</p>
              </motion.div>

              {/* Itinerary */}
              <motion.div {...fadeInUp} className="mt-12">
                <h2 className="text-section font-serif text-foreground mb-6">Day-by-Day Itinerary</h2>
                <div className="relative pl-8">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {route.itinerary.map((day, i) => (
                      <motion.div key={day.day} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.05 }}>
                        <button onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                          className="w-full text-left">
                          <div className="flex items-start gap-4">
                            <div className={`relative -ml-8 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${expandedDay === i ? "bg-accent ring-4 ring-background" : "bg-muted"}`}>
                              <span className="text-[10px] font-bold text-accent-foreground">{day.day}</span>
                            </div>
                            <div className="flex-1 bg-card rounded-xl p-4 card-shadow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-foreground">Day {day.day}: {day.title}</h4>
                                  <span className="badge-meta bg-muted text-muted-foreground mt-1"><MapPin className="w-3 h-3" /> {day.altitude}</span>
                                </div>
                                {expandedDay === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                              </div>
                              {expandedDay === i && (
                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                  {day.desc}
                                </motion.p>
                              )}
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Inclusions */}
              <motion.div {...fadeInUp} className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 card-shadow">
                  <h3 className="font-serif text-lg text-foreground mb-4">Included</h3>
                  <ul className="space-y-2.5">
                    {route.inclusions.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card rounded-2xl p-6 card-shadow">
                  <h3 className="font-serif text-lg text-foreground mb-4">Not Included</h3>
                  <ul className="space-y-2.5">
                    {route.exclusions.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <XIcon className="w-4 h-4 text-destructive flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-2xl p-6 card-shadow">
                  <h3 className="font-serif text-xl text-foreground mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Duration", value: `${route.days} Days` },
                      { label: "Difficulty", value: route.difficulty },
                      { label: "Max Altitude", value: route.maxAlt },
                      { label: "Success Rate", value: route.success },
                      { label: "Best Season", value: "Jan-Mar, Jun-Oct" },
                    ].map((fact) => (
                      <div key={fact.label} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground">{fact.label}</span>
                        <span className="text-sm font-medium text-foreground">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setInquiryOpen(true)}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Inquire About This Route <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
                <button onClick={() => setInquiryOpen(true)}
                  className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all">
                  Get a Free Quote
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
