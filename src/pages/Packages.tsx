import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  Users,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Package as PackageIcon,
  ArrowRight,
  Tag
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

  const categories = [...new Set(packages.map(p => p.category))];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Wildlife Safari": "bg-green-100 text-green-700 border-green-200",
      "Mountain Climbing": "bg-purple-100 text-purple-700 border-purple-200",
      "Beach Holiday": "bg-blue-100 text-blue-700 border-blue-200",
      "Multi-Park Safari": "bg-orange-100 text-orange-700 border-orange-200",
      "Wilderness Safari": "bg-teal-100 text-teal-700 border-teal-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Packages</h2>
                <p className="text-gray-500 mt-1">Our most popular and highly recommended experiences</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPackages.slice(0, 3).map((pkg) => (
                <Card key={pkg.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    {pkg.image ? (
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=800';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <PackageIcon className="h-16 w-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(pkg.category)}>
                        {pkg.category}
                      </Badge>
                    </div>
                    {pkg.discount_price && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500 text-white">
                          <Tag className="h-3 w-3 mr-1" />
                          {Math.round((1 - pkg.discount_price / pkg.price) * 100)}% OFF
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-medium">{pkg.destination?.name || 'Tanzania'}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{pkg.name}</h3>
                    {pkg.subtitle && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">{pkg.subtitle}</p>
                    )}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.short_description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {pkg.duration_days}D/{pkg.duration_nights}N
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {pkg.min_guests}-{pkg.max_guests}
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(pkg.difficulty)}>
                        {pkg.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {pkg.discount_price ? (
                          <div>
                            <span className="text-2xl font-bold text-green-600">${pkg.discount_price.toLocaleString()}</span>
                            <span className="text-sm text-gray-400 line-through ml-2">${pkg.price.toLocaleString()}</span>
                            <p className="text-xs text-gray-500">per person</p>
                          </div>
                        ) : (
                          <div>
                            <span className="text-2xl font-bold text-gray-900">${pkg.price.toLocaleString()}</span>
                            <p className="text-xs text-gray-500">per person</p>
                          </div>
                        )}
                      </div>
                      <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => handleBookNow(pkg)}
                      >
                        Book Now
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=800';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <PackageIcon className="h-12 w-12 text-white/50" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className={getCategoryColor(pkg.category)}>
                      {pkg.category}
                    </Badge>
                  </div>
                  {pkg.featured && (
                    <div className="absolute top-3 right-3">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{pkg.short_description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pkg.duration_days}D/{pkg.duration_nights}N
                    </span>
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(pkg.difficulty)}`}>
                      {pkg.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {pkg.discount_price ? (
                        <div>
                          <span className="text-lg font-bold text-green-600">${pkg.discount_price.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 line-through ml-1">${pkg.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">${pkg.price.toLocaleString()}</span>
                      )}
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
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
