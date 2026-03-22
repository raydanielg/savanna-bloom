import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { useAuth } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { getStorageUrl } from "@/lib/storage";

interface Safari {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  duration_days: number;
  duration_nights: number;
  price_from: number;
  image: string;
  itinerary: any[];
  highlights: string[];
  included: string[];
  excluded: string[];
  active: boolean;
  featured: boolean;
  destination?: { name: string };
}

export default function SafariDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [safari, setSafari] = useState<Safari | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSafari = async () => {
      try {
        const response = await axios.get(`/api/safaris/${id}`);
        setSafari(response.data.data || response.data);
      } catch (err: any) {
        console.error("Failed to fetch safari:", err);
        setError(err.response?.data?.message || "Failed to load safari details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSafari();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <p className="text-gray-500">Loading safari details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !safari) {
    return (
      <AdminLayout user={user}>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Safari</h2>
          <p className="text-gray-500 max-w-md mb-6">{error || "The safari you are looking for could not be found."}</p>
          <Button onClick={() => navigate("/admin/safaris")} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Safaris
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/safaris")}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{safari.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={safari.active ? "default" : "secondary"}>
                  {safari.active ? "Active" : "Inactive"}
                </Badge>
                {safari.featured && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">Featured</Badge>
                )}
                <span className="text-sm text-gray-500 ml-2">ID: #{safari.id}</span>
              </div>
            </div>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
            <Edit className="h-4 w-4" /> Edit Safari
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="relative aspect-video w-full">
                <img 
                  src={safari.image ? getStorageUrl(safari.image) : "/placeholder.svg"} 
                  alt={safari.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm border-0 shadow-sm text-lg py-1 px-3">
                    From ${safari.price_from?.toLocaleString()}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {safari.description || safari.short_description}
                </p>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-6">
                  {Array.isArray(safari.itinerary) && safari.itinerary.length > 0 ? (
                    safari.itinerary.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 relative">
                        {idx !== safari.itinerary.length - 1 && (
                          <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-100" />
                        )}
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm z-10 shrink-0">
                          {idx + 1}
                        </div>
                        <div className="pb-4">
                          <h4 className="font-bold text-gray-900">{item.title || `Day ${idx + 1}`}</h4>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          {item.accommodation && (
                            <p className="text-xs text-orange-600 font-medium mt-2">
                              🏨 Accommodation: {item.accommodation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">No itinerary data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</p>
                    <p className="font-medium text-gray-900">{safari.duration_days} Days, {safari.duration_nights} Nights</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Destination</p>
                    <p className="font-medium text-gray-900">{safari.destination?.name || "Multiple Locations"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Created At</p>
                    {/* @ts-ignore */}
                    <p className="font-medium text-gray-900">{new Date(safari.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Included</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2">
                  {safari.included?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  )) || <li className="text-gray-400 italic">No inclusions specified</li>}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-red-700">Excluded</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2">
                  {safari.excluded?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  )) || <li className="text-gray-400 italic">No exclusions specified</li>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
