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
  Mountain, 
  Clock, 
  TrendingUp, 
  Calendar, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign
} from "lucide-react";
import { getStorageUrl } from "@/lib/storage";

interface KilimanjaroRoute {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  days: number;
  difficulty: string;
  price: number;
  currency: string;
  image: string;
  success_rate: number;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export default function KilimanjaroRouteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [route, setRoute] = useState<KilimanjaroRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRoute = async () => {
      try {
        const response = await axios.get(`/api/kilimanjaro-routes/${id}`);
        if (isMounted) {
          setRoute(response.data.data || response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch route:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load route details");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchRoute();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <p className="text-gray-500">Loading route details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !route) {
    return (
      <AdminLayout user={user}>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Route</h2>
          <p className="text-gray-500 max-w-md mb-6">{error || "The climbing route could not be found."}</p>
          <Button onClick={() => navigate("/admin/kilimanjaro-routes")} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Routes
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-green-100 text-green-700 border-green-200",
      Moderate: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Challenging: "bg-orange-100 text-orange-700 border-orange-200",
      Difficult: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-600";
  };

  return (
    <AdminLayout user={user}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/kilimanjaro-routes")}
              className="rounded-full h-10 w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{route.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={route.active ? "default" : "secondary"}>
                  {route.active ? "Active" : "Inactive"}
                </Badge>
                {route.featured && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">Featured</Badge>
                )}
                <span className="text-sm text-gray-500 ml-2">ID: #{route.id}</span>
              </div>
            </div>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2 shadow-lg shadow-orange-200">
            <Edit className="h-4 w-4" /> Edit Route
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="relative aspect-video w-full">
                <img 
                  src={route.image ? getStorageUrl(route.image) : "/placeholder.svg"} 
                  alt={route.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm border-0 shadow-sm text-lg py-1.5 px-4 font-bold">
                    From ${route.price?.toLocaleString()}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mountain className="h-5 w-5 text-orange-600" /> Route Overview
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {route.description || route.short_description}
                </p>
              </CardContent>
            </Card>

            {/* Success Tips or Additional Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Route Statistics & Success</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <h4 className="font-bold text-orange-900">Success Rate</h4>
                    </div>
                    <p className="text-3xl font-extrabold text-orange-600">{route.success_rate}%</p>
                    <p className="text-sm text-orange-700 mt-1">Average summit success for this route.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h4 className="font-bold text-blue-900">Optimal Duration</h4>
                    </div>
                    <p className="text-3xl font-extrabold text-blue-600">{route.days} Days</p>
                    <p className="text-sm text-blue-700 mt-1">Recommended time for proper acclimatization.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-1">Duration</p>
                    <p className="font-bold text-gray-900">{route.days} Days</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${getDifficultyColor(route.difficulty)}`}>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-1">Difficulty</p>
                    <p className="font-bold text-gray-900">{route.difficulty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-green-50 rounded-xl">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-1">Price</p>
                    <p className="font-bold text-gray-900">{route.currency} ${route.price?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-orange-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-1">Created</p>
                    <p className="font-bold text-gray-900">{new Date(route.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Summit Readiness</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  <p className="text-sm text-slate-300">
                    This route is currently <span className={route.active ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                      {route.active ? "OPEN" : "CLOSED"}
                    </span> for bookings.
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white border-0">
                    Manage Bookings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
