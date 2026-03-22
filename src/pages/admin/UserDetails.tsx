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
  Mail, 
  Shield, 
  Calendar, 
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  bookings_count?: number;
  inquiries_count?: number;
}

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/admin/users/${id}`);
        if (isMounted) {
          setProfile(response.data.data || response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch user:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load user details");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id && authUser) fetchUser();
  }, [id, authUser]);

  if (loading) {
    return (
      <AdminLayout user={authUser}>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <p className="text-gray-500">Loading user profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !profile) {
    return (
      <AdminLayout user={authUser}>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-500 max-w-md mb-6">{error || "The user profile could not be found."}</p>
          <Button onClick={() => navigate("/admin/users")} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      editor: "bg-blue-100 text-blue-700 border-blue-200",
      user: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-600";
  };

  return (
    <AdminLayout user={authUser}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/users")}
              className="rounded-full h-10 w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getRoleColor(profile.role)}>
                  {profile.role?.toUpperCase() || "USER"}
                </Badge>
                {profile.email_verified_at ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Unverified</Badge>
                )}
                <span className="text-sm text-gray-500 ml-2">User ID: #{profile.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="border-0 shadow-sm overflow-hidden lg:col-span-1">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 pb-12 pt-8">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  <UserIcon className="h-12 w-12 text-orange-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-8 -mt-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email Address</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Account Role</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{profile.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Joined Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(profile.created_at).toLocaleDateString("en-US", { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity/Stats Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                      <h3 className="text-3xl font-bold mt-1">{profile.bookings_count || 0}</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Active Inquiries</p>
                      <h3 className="text-3xl font-bold mt-1">{profile.inquiries_count || 0}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  <div className="p-6 text-center text-gray-500 text-sm italic">
                    Detailed user activity logs coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
