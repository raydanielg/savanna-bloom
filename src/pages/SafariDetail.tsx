import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Camera, Star, MapPin, Check, X as XIcon, ChevronDown, ChevronUp, Users, Binoculars, Sun, Tent, Calendar } from "lucide-react";
import Layout from "@/components/layout/Layout";
import InquiryModal from "@/components/InquiryModal";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimation";

import serengeti from "@/assets/serengeti.jpg";
import serengetiSunset from "@/assets/serengeti-sunset.jpg";
import ngorongoro from "@/assets/ngorongoro.jpg";
import ngorongoroCrater from "@/assets/ngorongoro-crater.jpg";
import tarangire from "@/assets/tarangire.jpg";
import tarangireElephants from "@/assets/tarangire-elephants.jpg";
import lakeManyara from "@/assets/lake-manyara.jpg";
import lakeManyaraFlamingos from "@/assets/lake-manyara-flamingos.jpg";
import zanzibarParadise from "@/assets/zanzibar-paradise.jpg";
import zanzibarBeach from "@/assets/zanzibar-beach.jpg";
import migration from "@/assets/migration.jpg";
import wildlifeLion from "@/assets/wildlife-lion.jpg";
import elephant from "@/assets/elephant.jpg";
import leopard from "@/assets/leopard.jpg";
import luxuryLodge from "@/assets/luxury-lodge.jpg";
import luxuryCamp from "@/assets/luxury-camp.jpg";

interface SafariData {
  name: string;
  tagline: string;
  days: number;
  price: string;
  heroImage: string;
  gallery: string[];
  desc: string;
  longDesc: string;
  wildlife: string[];
  highlights: string[];
  bestTime: string;
  groupSize: string;
  itinerary: { day: number; title: string; desc: string; meals?: string }[];
  accommodations: { name: string; type: string; desc: string; image: string }[];
  inclusions: string[];
  exclusions: string[];
}

const safariData: Record<string, SafariData> = {
  "serengeti-safari": {
    name: "Serengeti Great Migration Safari",
    tagline: "Witness the Greatest Wildlife Spectacle on Earth",
    days: 5,
    price: "From $2,400",
    heroImage: serengeti,
    gallery: [serengeti, serengetiSunset, migration, wildlifeLion, leopard, luxuryCamp],
    desc: "Experience the awe-inspiring Great Migration across the endless plains of the Serengeti.",
    longDesc: "The Serengeti National Park, a UNESCO World Heritage Site spanning 14,763 km², is home to the greatest concentration of large mammals on Earth. Our expert-guided safari takes you deep into the heart of this magnificent ecosystem, from the vast Southern Plains where over 500,000 calves are born each year, to the dramatic Mara River crossings where crocodiles await the thundering herds. Every moment in the Serengeti is a masterclass in the raw beauty of nature.",
    wildlife: ["Lions", "Leopards", "Elephants", "Wildebeest", "Zebras", "Cheetahs", "Hippos", "Crocodiles"],
    highlights: ["Witness the Great Migration river crossings", "Big Five game viewing", "Sunrise hot air balloon safari option", "Luxury tented camp experience", "Expert naturalist guides", "Sundowner cocktails on the plains"],
    bestTime: "June - October (Migration), January - March (Calving)",
    groupSize: "2 - 8 travelers",
    itinerary: [
      { day: 1, title: "Arrival in Arusha", desc: "Arrive at Kilimanjaro International Airport. Meet your personal safari guide and transfer to your luxury lodge in Arusha for a welcome dinner briefing.", meals: "Dinner" },
      { day: 2, title: "Arusha to Central Serengeti", desc: "Early morning flight to Seronera airstrip in the heart of the Serengeti. Afternoon game drive through the central Serengeti, home to resident prides of lions and elusive leopards.", meals: "All meals" },
      { day: 3, title: "Full Day Serengeti Safari", desc: "Full day exploring the Serengeti ecosystem. Visit kopjes (rocky outcrops) where lions rest, scan the plains for cheetahs, and follow the migration herds. Optional sunrise hot air balloon safari.", meals: "All meals" },
      { day: 4, title: "Northern Serengeti & Mara River", desc: "Drive to the northern Serengeti for dramatic Mara River crossing views. Witness the tension as thousands of wildebeest gather courage to cross the crocodile-infested waters.", meals: "All meals" },
      { day: 5, title: "Final Game Drive & Departure", desc: "Sunrise game drive for last wildlife encounters. Transfer to the airstrip for your flight back to Arusha. Optional extension to Ngorongoro or Zanzibar.", meals: "Breakfast, Lunch" },
    ],
    accommodations: [
      { name: "Serengeti Luxury Camp", type: "Luxury Tented Camp", desc: "En-suite tented suites with private verandas overlooking the plains. Gourmet dining under the stars.", image: luxuryCamp },
      { name: "Serengeti Safari Lodge", type: "Premium Lodge", desc: "Stone and canvas lodge perched on a kopje with infinity pool and panoramic Serengeti views.", image: luxuryLodge },
    ],
    inclusions: ["Domestic flights (Arusha-Serengeti-Arusha)", "All park and conservation fees", "Luxury accommodation with full board", "Private 4x4 safari vehicle with pop-up roof", "Expert English-speaking naturalist guide", "All game drives as per itinerary", "Drinking water throughout", "Airport transfers", "Flying Doctor emergency evacuation cover"],
    exclusions: ["International flights", "Travel & medical insurance", "Visa fees ($50 USD)", "Alcoholic beverages", "Tips & gratuities", "Hot air balloon safari ($599 pp)", "Personal expenses", "Laundry service"],
  },
  "ngorongoro-safari": {
    name: "Ngorongoro Crater Safari",
    tagline: "Descend into the World's Largest Volcanic Caldera",
    days: 3,
    price: "From $1,800",
    heroImage: ngorongoro,
    gallery: [ngorongoro, ngorongoroCrater, wildlifeLion, elephant, luxuryLodge, leopard],
    desc: "Explore the Ngorongoro Crater — a natural amphitheater sheltering 30,000+ animals.",
    longDesc: "The Ngorongoro Crater is one of Africa's most remarkable natural wonders. This collapsed volcanic caldera, 19 km wide and 600 meters deep, creates a self-contained ecosystem that supports an incredible density of wildlife. With an estimated 30,000 animals living within its walls, including the densest population of lions in Africa and critically endangered black rhinos, every game drive delivers extraordinary encounters. The crater rim offers breathtaking views and world-class lodges perched 2,200 meters above sea level.",
    wildlife: ["Black Rhino", "Lions", "Elephants", "Hippos", "Flamingos", "Buffalo", "Zebras", "Hyenas"],
    highlights: ["Descend 600m into the crater floor", "Spot critically endangered black rhinos", "Visit Maasai cultural boma", "Crater rim sunrise experience", "Lake Magadi flamingo viewing", "Lerai Forest exploration"],
    bestTime: "Year-round (best June - October)",
    groupSize: "2 - 6 travelers",
    itinerary: [
      { day: 1, title: "Arusha to Ngorongoro Crater Rim", desc: "Drive from Arusha through the Great Rift Valley to the Ngorongoro Conservation Area. Stop at a Maasai village for a cultural visit. Arrive at your crater rim lodge for sunset views.", meals: "Lunch, Dinner" },
      { day: 2, title: "Full Day Crater Floor Safari", desc: "Descend 600 meters into the crater at dawn. Full day exploring the crater floor — lions, rhinos, elephants, hippos, and thousands of flamingos at Lake Magadi. Picnic lunch by the hippo pool.", meals: "All meals" },
      { day: 3, title: "Sunrise Game Drive & Departure", desc: "Early morning game drive along the crater rim for final wildlife viewing. Transfer back to Arusha with stops at viewpoints along the way.", meals: "Breakfast, Lunch" },
    ],
    accommodations: [
      { name: "Ngorongoro Crater Lodge", type: "Luxury Lodge", desc: "Perched on the crater rim with floor-to-ceiling windows overlooking the caldera. Butler service and gourmet cuisine.", image: luxuryLodge },
    ],
    inclusions: ["All ground transportation", "Park and crater fees", "Luxury crater rim accommodation", "Private safari vehicle", "Expert guide", "All meals as per itinerary", "Drinking water", "Maasai village visit"],
    exclusions: ["International flights", "Insurance", "Visa fees", "Alcoholic drinks", "Tips", "Personal expenses"],
  },
  "tarangire-safari": {
    name: "Tarangire Elephant Safari",
    tagline: "Walk Among Giants Beneath Ancient Baobab Trees",
    days: 4,
    price: "From $1,600",
    heroImage: tarangire,
    gallery: [tarangire, tarangireElephants, elephant, wildlifeLion, luxuryCamp, serengeti],
    desc: "Home to massive elephant herds and iconic baobab trees — Tarangire is an elephant lover's paradise.",
    longDesc: "Tarangire National Park is a hidden gem of the northern Tanzania safari circuit. During the dry season (June-October), the Tarangire River becomes a vital lifeline, drawing thousands of elephants — sometimes herds of 300 or more — along with zebras, wildebeest, and predators. The park's landscape is dotted with massive baobab trees, some over 1,000 years old, creating an almost otherworldly backdrop for your safari experience.",
    wildlife: ["Elephants", "Lions", "Leopards", "Python", "Tree-climbing Lions", "Oryx", "Gerenuk", "Baobab Trees"],
    highlights: ["Herds of 300+ elephants", "Ancient baobab tree forests", "Walking safari option", "Night game drives available", "Tarangire River wildlife corridor", "Bird watching (550+ species)"],
    bestTime: "June - October (dry season)",
    groupSize: "2 - 8 travelers",
    itinerary: [
      { day: 1, title: "Arusha to Tarangire", desc: "Morning departure from Arusha. Enter Tarangire through the northern gate with an afternoon game drive along the Tarangire River, spotting elephants, giraffes, and tree-climbing pythons.", meals: "Lunch, Dinner" },
      { day: 2, title: "Full Day Tarangire Safari", desc: "Full day exploring the diverse habitats — from the river valley to the swamps and baobab woodlands. Look for predators stalking the herds and massive python nests.", meals: "All meals" },
      { day: 3, title: "Walking Safari & Southern Circuit", desc: "Morning walking safari with an armed ranger through the southern wilderness. Afternoon game drive to discover remote areas few tourists ever reach.", meals: "All meals" },
      { day: 4, title: "Sunrise Drive & Departure", desc: "Final sunrise game drive for last encounters. Transfer back to Arusha with a stop at a local Maasai market.", meals: "Breakfast, Lunch" },
    ],
    accommodations: [
      { name: "Tarangire Tented Lodge", type: "Luxury Tented Camp", desc: "Elevated tented suites nestled among baobab trees with views of the river valley.", image: luxuryCamp },
    ],
    inclusions: ["All transportation", "Park fees", "Luxury tented accommodation", "Private safari vehicle", "Expert guide", "Walking safari with ranger", "All meals", "Drinking water"],
    exclusions: ["Flights", "Insurance", "Visa", "Drinks", "Tips", "Night game drive supplement ($80pp)"],
  },
  "lake-manyara-safari": {
    name: "Lake Manyara National Park Safari",
    tagline: "Where Tree-Climbing Lions Meet Flamingo Shores",
    days: 2,
    price: "From $900",
    heroImage: lakeManyara,
    gallery: [lakeManyara, lakeManyaraFlamingos, wildlifeLion, elephant, luxuryLodge, ngorongoro],
    desc: "A compact paradise of groundwater forest, flamingo-lined shores, and tree-climbing lions.",
    longDesc: "Ernest Hemingway called Lake Manyara 'the loveliest I had seen in Africa.' This compact national park, nestled between the Great Rift Valley escarpment and the soda lake, packs extraordinary biodiversity into a small area. Walk through the groundwater forest where blue monkeys swing through the canopy, emerge onto open grasslands where elephants graze, and reach the alkaline lakeshore where hundreds of thousands of flamingos create a shimmering pink carpet.",
    wildlife: ["Tree-climbing Lions", "Flamingos", "Elephants", "Hippos", "Blue Monkeys", "Baboons", "Pelicans", "Giraffes"],
    highlights: ["Famous tree-climbing lions", "Thousands of flamingos", "Groundwater forest walk", "Hot springs visit", "Night game drives available", "Rift Valley viewpoint"],
    bestTime: "Year-round",
    groupSize: "2 - 8 travelers",
    itinerary: [
      { day: 1, title: "Arusha to Lake Manyara", desc: "Drive to Lake Manyara with stops at the Rift Valley viewpoint. Afternoon game drive through the groundwater forest and along the lakeshore. Search for the famous tree-climbing lions.", meals: "Lunch, Dinner" },
      { day: 2, title: "Sunrise Safari & Departure", desc: "Dawn game drive to the southern end of the park for hot springs and flamingo viewing. Transfer back to Arusha or continue to Ngorongoro.", meals: "Breakfast, Lunch" },
    ],
    accommodations: [
      { name: "Lake Manyara Serena Lodge", type: "Premium Lodge", desc: "Clifftop lodge overlooking the lake and the Rift Valley floor.", image: luxuryLodge },
    ],
    inclusions: ["All transportation", "Park fees", "Lodge accommodation", "Private vehicle", "Guide", "All meals", "Water"],
    exclusions: ["Flights", "Insurance", "Visa", "Drinks", "Tips"],
  },
  "zanzibar-tour": {
    name: "Zanzibar Beach & Culture Experience",
    tagline: "Tropical Paradise Meets Ancient History",
    days: 5,
    price: "From $1,200",
    heroImage: zanzibarParadise,
    gallery: [zanzibarParadise, zanzibarBeach, luxuryLodge, luxuryCamp, ngorongoro, serengeti],
    desc: "Pristine white-sand beaches, historic Stone Town, spice plantations, and crystal-clear waters.",
    longDesc: "Zanzibar — the Spice Island — is the perfect complement to any East African safari. This semi-autonomous archipelago off the Tanzanian coast offers a mesmerizing blend of African, Arab, Indian, and European cultures. Explore the UNESCO-listed Stone Town with its labyrinthine alleys and intricately carved doors, visit working spice plantations where vanilla, cloves, and cinnamon perfume the air, then sink your toes into powder-white sand on some of the Indian Ocean's most beautiful beaches.",
    wildlife: ["Dolphins", "Sea Turtles", "Coral Reefs", "Colobus Monkeys", "Starfish", "Tropical Fish"],
    highlights: ["UNESCO Stone Town walking tour", "Spice plantation visit", "Pristine beach relaxation", "Dolphin watching excursion", "Snorkeling at Mnemba Atoll", "Traditional dhow sunset cruise"],
    bestTime: "June - October, December - February",
    groupSize: "2 - 12 travelers",
    itinerary: [
      { day: 1, title: "Arrival in Zanzibar", desc: "Arrive at Zanzibar International Airport. Transfer to your beachfront resort. Evening sunset dhow cruise with canapés and cocktails.", meals: "Dinner" },
      { day: 2, title: "Stone Town Heritage Tour", desc: "Full day exploring UNESCO-listed Stone Town — the Sultan's Palace, House of Wonders, slave market memorial, and Forodhani Gardens night food market.", meals: "Breakfast, Lunch" },
      { day: 3, title: "Spice Tour & Beach", desc: "Morning spice plantation tour — taste vanilla, cinnamon, nutmeg, and cloves fresh from the source. Afternoon relaxation on Nungwi Beach.", meals: "Breakfast, Lunch" },
      { day: 4, title: "Marine Adventure Day", desc: "Morning dolphin watching at Kizimkazi, followed by snorkeling at Mnemba Atoll — one of the best dive sites in East Africa. BBQ seafood lunch on the beach.", meals: "All meals" },
      { day: 5, title: "Beach & Departure", desc: "Final morning of beach relaxation or optional visit to Jozani Forest (red colobus monkeys). Transfer to airport.", meals: "Breakfast" },
    ],
    accommodations: [
      { name: "Zanzibar Beach Resort", type: "Luxury Beach Resort", desc: "Beachfront suites with private plunge pools, overwater restaurant, and spa.", image: luxuryLodge },
    ],
    inclusions: ["All Zanzibar transfers", "Luxury beachfront accommodation", "Stone Town guided tour", "Spice tour", "Dolphin trip & snorkeling", "Dhow sunset cruise", "Meals as specified", "Drinking water"],
    exclusions: ["Flights to/from Zanzibar", "Insurance", "Visa", "Alcoholic drinks", "Tips", "Diving supplement", "Personal expenses"],
  },
};

const SafariDetail = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const safari = safariData[slug];
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!safari) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif text-foreground mb-4">Safari Not Found</h1>
            <Link to="/tanzania-safaris" className="text-accent hover:underline">View All Safaris</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero with parallax */}
      <section className="relative h-[80vh] min-h-[600px] -mt-24 overflow-hidden">
        <motion.img
          src={safari.heroImage}
          alt={safari.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative h-full flex items-end pb-20 safari-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <p className="badge-meta bg-accent/20 text-accent mb-4">
              <Camera className="w-3.5 h-3.5" /> {safari.days}-Day Safari
            </p>
            <h1 className="text-hero font-serif text-primary-foreground mb-3">{safari.name}</h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">{safari.tagline}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                <Clock className="w-3 h-3" /> {safari.days} Days
              </span>
              <span className="badge-meta bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                <Users className="w-3 h-3" /> {safari.groupSize}
              </span>
              <span className="badge-meta bg-accent/25 text-accent backdrop-blur-sm">
                <Star className="w-3 h-3" /> {safari.price}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding bg-background">
        <div className="safari-container">
          <div className="grid lg:grid-cols-[1fr_380px] gap-16">
            <div>
              <ScrollReveal>
                <h2 className="text-section font-serif text-foreground mb-6">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{safari.longDesc}</p>
              </ScrollReveal>

              {/* Wildlife */}
              <ScrollReveal delay={0.1} className="mt-10">
                <h3 className="text-subsection font-serif text-foreground mb-5">Wildlife Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {safari.wildlife.map((w) => (
                    <span key={w} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              </ScrollReveal>

              {/* Highlights */}
              <ScrollReveal delay={0.15} className="mt-10">
                <h3 className="text-subsection font-serif text-foreground mb-5">Safari Highlights</h3>
                <StaggerContainer className="grid sm:grid-cols-2 gap-3">
                  {safari.highlights.map((h) => (
                    <StaggerItem key={h}>
                      <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm text-foreground">{h}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </ScrollReveal>

              {/* Gallery */}
              <ScrollReveal className="mt-14">
                <h3 className="text-subsection font-serif text-foreground mb-6">Photo Gallery</h3>
                <div className="space-y-4">
                  <div className="image-reveal rounded-2xl aspect-[16/9] overflow-hidden">
                    <motion.img
                      key={selectedImage}
                      src={safari.gallery[selectedImage]}
                      alt={`${safari.name} gallery`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {safari.gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`aspect-square rounded-xl overflow-hidden transition-all ${selectedImage === i ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "opacity-50 hover:opacity-100"}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Itinerary */}
              <ScrollReveal className="mt-16">
                <h2 className="text-section font-serif text-foreground mb-8">Day-by-Day Itinerary</h2>
                <div className="relative pl-10">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent via-border to-border" />
                  <div className="space-y-4">
                    {safari.itinerary.map((day, i) => (
                      <ScrollReveal key={day.day} delay={i * 0.05}>
                        <button onClick={() => setExpandedDay(expandedDay === i ? null : i)} className="w-full text-left">
                          <div className="flex items-start gap-5">
                            <div className={`relative -ml-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${expandedDay === i ? "bg-accent ring-4 ring-background scale-110" : "bg-card border-2 border-border"}`}>
                              <span className={`text-[11px] font-bold ${expandedDay === i ? "text-accent-foreground" : "text-muted-foreground"}`}>{day.day}</span>
                            </div>
                            <div className="flex-1 bg-card rounded-2xl p-5 card-shadow hover:card-shadow-lg transition-shadow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-foreground text-base">Day {day.day}: {day.title}</h4>
                                  {day.meals && (
                                    <span className="badge-meta bg-muted text-muted-foreground mt-1.5">{day.meals}</span>
                                  )}
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
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Accommodation */}
              <ScrollReveal className="mt-16">
                <h2 className="text-section font-serif text-foreground mb-8">Accommodation</h2>
                <div className="space-y-6">
                  {safari.accommodations.map((acc) => (
                    <div key={acc.name} className="group grid md:grid-cols-2 bg-card rounded-2xl overflow-hidden card-shadow">
                      <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                        <img src={acc.image} alt={acc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-quint" />
                      </div>
                      <div className="p-6 lg:p-8 flex flex-col justify-center">
                        <span className="badge-meta bg-accent/10 text-accent w-fit mb-3">{acc.type}</span>
                        <h3 className="font-serif text-2xl text-foreground mb-3">{acc.name}</h3>
                        <p className="text-muted-foreground leading-relaxed">{acc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Inclusions */}
              <ScrollReveal className="mt-16">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-8 card-shadow">
                    <h3 className="font-serif text-xl text-foreground mb-5 flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" /> What's Included
                    </h3>
                    <ul className="space-y-3">
                      {safari.inclusions.map((item) => (
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
                      {safari.exclusions.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <XIcon className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-28 space-y-6">
                <ScrollReveal direction="right">
                  <div className="bg-card rounded-2xl p-8 card-shadow-lg">
                    <h3 className="font-serif text-xl text-foreground mb-6">Safari Details</h3>
                    <div className="space-y-4">
                      {[
                        { icon: Clock, label: "Duration", value: `${safari.days} Days / ${safari.days - 1} Nights` },
                        { icon: Users, label: "Group Size", value: safari.groupSize },
                        { icon: Sun, label: "Best Time", value: safari.bestTime },
                        { icon: MapPin, label: "Location", value: "Northern Tanzania" },
                        { icon: Binoculars, label: "Wildlife", value: `${safari.wildlife.length} Key Species` },
                        { icon: Tent, label: "Accommodation", value: safari.accommodations[0]?.type || "Lodge" },
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
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.1}>
                  <div className="bg-accent/5 rounded-2xl p-8 border border-accent/20">
                    <p className="font-serif text-2xl text-foreground mb-1">{safari.price}</p>
                    <p className="text-sm text-muted-foreground mb-5">per person sharing</p>
                    <button
                      onClick={() => setInquiryOpen(true)}
                      className="w-full px-6 py-4 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase mb-3"
                    >
                      Get Free Quote <ArrowRight className="w-4 h-4 inline ml-1" />
                    </button>
                    <button
                      onClick={() => setInquiryOpen(true)}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all text-sm"
                    >
                      Customize This Safari
                    </button>
                    <p className="text-xs text-center text-muted-foreground mt-4">No obligation • Response within 24 hours</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.2}>
                  <Link to="/tanzania-safaris" className="flex items-center gap-2 text-sm text-primary font-medium hover:text-accent transition-colors">
                    <ArrowRight className="w-4 h-4 rotate-180" /> View All Safaris
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <motion.img
          src={safari.gallery[1] || safari.heroImage}
          alt="Safari landscape"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        />
        <div className="hero-gradient-strong absolute inset-0" />
        <div className="relative safari-container text-center">
          <ScrollReveal>
            <p className="badge-meta bg-accent/20 text-accent mb-5">Start Planning</p>
            <h2 className="text-section font-serif text-primary-foreground mb-5">Ready for This Adventure?</h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-10 text-lg">Our safari experts are ready to craft your perfect {safari.name} experience.</p>
            <button
              onClick={() => setInquiryOpen(true)}
              className="px-10 py-4 bg-accent text-accent-foreground rounded-full font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide uppercase"
            >
              Plan Your Safari <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} defaultTour={safari.name} />
    </Layout>
  );
};

export default SafariDetail;
