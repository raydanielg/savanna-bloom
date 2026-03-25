import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStorageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  Star,
  MapPin,
  Clock,
  Package as PackageIcon,
  ArrowRight,
  TrendingUp,
  Calendar
} from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";

interface Package {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  short_description: string;
  image: string;
  category: string;
  destination?: { name: string };
  duration_days: number;
  duration_nights: number;
  price: number;
  discount_price: number | null;
  difficulty: string;
  min_guests: number;
  max_guests: number;
  featured: boolean;
  active: boolean;
  highlights?: string[];
}

export default function PackagesPage() {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const [packagesRes, featuredRes] = await Promise.all([
        axios.get("/api/packages"),
        axios.get("/api/packages/featured"),
      ]);
      setPackages(packagesRes.data?.data || packagesRes.data || []);
      setFeaturedPackages(featuredRes.data || []);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (pkg: Package) => {
    setSelectedPackage(pkg);
    setBookingOpen(true);
  };

  const filteredPackages = packages
    .filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || pkg.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") return a.duration_days - b.duration_days;
      if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  const categories = packages.length > 0 ? [...new Set(packages.map(p => p.category))] : [];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Wildlife Safari": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Mountain Climbing": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Beach Holiday": "bg-sky-100 text-sky-700 border-sky-200",
      "Luxury Safari": "bg-amber-100 text-amber-700 border-amber-200",
      "Family Safari": "bg-rose-100 text-rose-700 border-rose-200",
    };
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-green-50 text-green-600 border-green-200",
      Moderate: "bg-yellow-50 text-yellow-600 border-yellow-200",
      Challenging: "bg-orange-50 text-orange-600 border-orange-200",
      Difficult: "bg-red-50 text-red-600 border-red-200",
    };
    return colors[difficulty] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <PackageIcon className="h-3 w-3 mr-1" />
              Safari Packages
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Perfect Safari
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Handcrafted safari experiences designed to create unforgettable memories in Tanzania's wilderness
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Star className="h-5 w-5" />
                <span>Curated Experiences</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Users className="h-5 w-5" />
                <span>Expert Guides</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <MapPin className="h-5 w-5" />
                <span>Best Destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      {featuredPackages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Handpicked Experiences</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Our most recommended Tanzanian adventures, curated for excellence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.slice(0, 3).map((pkg) => (
                <Card key={pkg.id} className="group overflow-hidden border-0 shadow-xl shadow-slate-200/50 rounded-3xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.image ? getStorageUrl(pkg.image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=800'}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <Badge className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-wider border-0 shadow-lg", getCategoryColor(pkg.category))}>
                        {pkg.category}
                      </Badge>
                    </div>
                    {pkg.discount_price && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-rose-500 text-white border-0 shadow-lg px-3 py-1 font-bold">
                          {Math.round((1 - pkg.discount_price / pkg.price) * 100)}% OFF
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                        <MapPin className="h-3.5 w-3.5 text-orange-400" />
                        {pkg.destination?.name || 'Tanzania'}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{pkg.name}</h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{pkg.short_description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                        <Clock className="h-3.5 w-3.5 text-orange-500" />
                        <span className="font-semibold">{pkg.duration_days}D/{pkg.duration_nights}N</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                        <Users className="h-3.5 w-3.5 text-orange-500" />
                        <span className="font-semibold">{pkg.min_guests}-{pkg.max_guests} Guests</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        {pkg.discount_price ? (
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900">${pkg.discount_price.toLocaleString()}</span>
                            <span className="text-xs text-slate-400 line-through">${pkg.price.toLocaleString()}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900">${pkg.price.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Starting from</span>
                          </div>
                        )}
                      </div>
                      <Button
                        className="bg-slate-900 hover:bg-orange-600 text-white rounded-2xl px-6 h-12 font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
                        onClick={() => handleBookNow(pkg)}
                      >
                        Book Expedition
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Packages */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-serif text-slate-900 mb-2">Explore All Journeys</h2>
              <p className="text-slate-500">Filter our extensive collection of safari and trekking packages.</p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 w-full md:w-64 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-orange-500/20"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 w-full md:w-48 bg-white border-slate-200 rounded-2xl shadow-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="all">All Styles</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="group overflow-hidden border-0 shadow-md shadow-slate-200/50 rounded-[2rem] hover:shadow-xl transition-all duration-500 bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image ? getStorageUrl(pkg.image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=800'}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3">
                    <Badge className={cn("px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-tighter border-0 shadow-md", getCategoryColor(pkg.category))}>
                      {pkg.category}
                    </Badge>
                  </div>
                  {pkg.featured && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md">
                      <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">{pkg.name}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-500" />
                      {pkg.duration_days} Days
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-slate-500">{pkg.difficulty}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-lg font-black text-slate-900">${(pkg.discount_price || pkg.price).toLocaleString()}</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter -mt-1">Per Person</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-slate-50 hover:bg-orange-600 text-slate-900 hover:text-white rounded-xl px-4 h-9 font-bold transition-all shadow-sm"
                      onClick={() => handleBookNow(pkg)}
                    >
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <PackageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Book With Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We're committed to providing exceptional safari experiences with unmatched service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "Curated Experiences", desc: "Hand-picked destinations and activities" },
              { icon: Users, title: "Expert Guides", desc: "Professional, knowledgeable local guides" },
              { icon: TrendingUp, title: "Best Value", desc: "Competitive prices with no hidden fees" },
              { icon: Calendar, title: "Flexible Booking", desc: "Easy booking with free cancellation" },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors">
                <item.icon className="h-10 w-10 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        packageData={selectedPackage}
      />
    </div>
  );
}
