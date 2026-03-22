import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Users,
  Star,
  MapPin,
  Clock,
  Check,
  X,
  Package as PackageIcon,
  ArrowLeft,
  Heart,
  Share2,
  Mail,
  Phone,
  TrendingUp,
  Shield,
  CreditCard
} from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";

interface Package {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
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
  accommodation_type: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: { day: number; title: string; description: string }[];
  featured: boolean;
  active: boolean;
}

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'includes'>('overview');
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetchPackage();
  }, [slug]);

  const fetchPackage = async () => {
    try {
      const response = await axios.get(`/api/packages/${slug}`);
      setPkg(response.data);
    } catch (error) {
      console.error("Failed to fetch package:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <PackageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h2>
            <p className="text-gray-500 mb-4">The package you're looking for doesn't exist.</p>
            <Link to="/packages">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Packages
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const effectivePrice = pkg.discount_price || pkg.price;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Link to="/packages">
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getCategoryColor(pkg.category)}>
                {pkg.category}
              </Badge>
              {pkg.featured && (
                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500">
                  <Star className="h-3 w-3 mr-1 fill-yellow-900" />
                  Featured
                </Badge>
              )}
              {pkg.discount_price && (
                <Badge className="bg-red-500 text-white border-red-600">
                  {Math.round((1 - pkg.discount_price / pkg.price) * 100)}% OFF
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{pkg.name}</h1>
            {pkg.subtitle && (
              <p className="text-lg text-white/90 mb-3">{pkg.subtitle}</p>
            )}
            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {pkg.destination?.name || 'Tanzania'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {pkg.duration_days} Days, {pkg.duration_nights} Nights
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {pkg.min_guests}-{pkg.max_guests} Guests
              </span>
              <Badge variant="outline" className={getDifficultyColor(pkg.difficulty)}>
                {pkg.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b">
                  {[
                    { key: 'overview', label: 'Overview' },
                    { key: 'itinerary', label: 'Itinerary' },
                    { key: 'includes', label: "What's Included" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <CardContent className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">About This Package</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {pkg.description || pkg.short_description}
                        </p>
                      </div>
                      {pkg.highlights && pkg.highlights.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pkg.highlights.map((highlight, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {pkg.accommodation_type && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Accommodation</h3>
                          <p className="text-gray-600">{pkg.accommodation_type}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'itinerary' && pkg.itinerary && pkg.itinerary.length > 0 && (
                    <div className="space-y-4">
                      {pkg.itinerary.map((day, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                              {day.day}
                            </div>
                            {i < pkg.itinerary!.length - 1 && (
                              <div className="w-0.5 h-full bg-orange-200 my-2"></div>
                            )}
                          </div>
                          <div className="pb-6">
                            <h4 className="font-semibold text-gray-900">{day.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'includes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                          <Check className="h-5 w-5" />
                          What's Included
                        </h3>
                        <ul className="space-y-2">
                          {pkg.includes?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                          <X className="h-5 w-5" />
                          What's Not Included
                        </h3>
                        <ul className="space-y-2">
                          {pkg.excludes?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Price Card */}
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Starting from</p>
                      <div className="flex items-baseline gap-2">
                        {pkg.discount_price ? (
                          <>
                            <span className="text-3xl font-bold text-green-600">
                              ${pkg.discount_price.toLocaleString()}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              ${pkg.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-gray-900">
                            ${pkg.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-gray-500">per person</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{pkg.duration_days} Days, {pkg.duration_nights} Nights</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{pkg.min_guests}-{pkg.max_guests} Guests</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span>Best Price Guarantee</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                      onClick={() => setBookingOpen(true)}
                    >
                      Book Now
                    </Button>

                    <p className="text-center text-xs text-gray-500 mt-3">
                      Free cancellation up to 48 hours before
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="shadow-sm border-0">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Need Help?</p>
                    <div className="space-y-2">
                      <a href="tel:+255123456789" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600">
                        <Phone className="h-4 w-4" />
                        +255 123 456 789
                      </a>
                      <a href="mailto:info@savannabloom.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600">
                        <Mail className="h-4 w-4" />
                        info@savannabloom.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Secure Booking</p>
                    </div>
                    <div>
                      <CreditCard className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Flexible Payment</p>
                    </div>
                    <div>
                      <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Best Rates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        packageData={pkg}
      />
    </div>
  );
}
