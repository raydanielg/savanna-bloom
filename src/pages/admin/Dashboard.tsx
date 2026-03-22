import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  Calendar, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  MessageSquare,
  Globe,
  Mountain,
  TreePalm,
  FileText,
  Package,
  Star,
  ExternalLink,
  Plus
} from "lucide-react";

interface Stats {
  totalSafaris: number;
  activeBookings: number;
  totalUsers: number;
  revenue: number;
  inquiries: number;
  destinations: number;
  kilimanjaroRoutes: number;
  dayTrips: number;
  blogPosts: number;
  packages: number;
  featuredItems: number;
}

interface RecentInquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  created_at: string;
}

interface RecentBooking {
  id: number;
  customer_name: string;
  bookable?: { name: string };
  start_date: string;
  status: string;
  total_amount: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalSafaris: 0,
    activeBookings: 0,
    totalUsers: 0,
    revenue: 0,
    inquiries: 0,
    destinations: 0,
    kilimanjaroRoutes: 0,
    dayTrips: 0,
    blogPosts: 0,
    packages: 0,
    featuredItems: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/api/user");
        setUser(userResponse.data);

        // Fetch all data in parallel
        const [safarisRes, bookingsRes, inquiriesRes, destinationsRes, routesRes, tripsRes, postsRes, packagesRes, usersRes] = await Promise.all([
          axios.get("/api/safaris").catch(() => ({ data: [] })),
          axios.get("/api/admin/bookings").catch(() => ({ data: { data: [] } })),
          axios.get("/api/admin/inquiries").catch(() => ({ data: { data: [] } })),
          axios.get("/api/destinations").catch(() => ({ data: [] })),
          axios.get("/api/kilimanjaro-routes").catch(() => ({ data: [] })),
          axios.get("/api/day-trips").catch(() => ({ data: [] })),
          axios.get("/api/blog-posts").catch(() => ({ data: [] })),
          axios.get("/api/admin/packages").catch(() => ({ data: [] })),
          axios.get("/api/admin/users").catch(() => ({ data: [] })),
        ]);

        // Extract data from responses (handle both paginated and non-paginated)
        const safaris = safarisRes.data?.data || safarisRes.data || [];
        const bookings = bookingsRes.data?.data || bookingsRes.data || [];
        const inquiries = inquiriesRes.data?.data || inquiriesRes.data || [];
        const destinations = destinationsRes.data?.data || destinationsRes.data || [];
        const routes = routesRes.data?.data || routesRes.data || [];
        const trips = tripsRes.data?.data || tripsRes.data || [];
        const posts = postsRes.data?.data || postsRes.data || [];
        const packages = packagesRes.data?.data || packagesRes.data || [];
        const users = usersRes.data?.data || usersRes.data || [];

        console.log('Dashboard data loaded:', { 
          safaris: safaris.length, 
          bookings: bookings.length, 
          inquiries: inquiries.length,
          destinations: destinations.length,
          routes: routes.length,
          trips: trips.length,
          posts: posts.length,
          packages: packages.length,
          users: users.length
        });

        // Calculate stats
        const activeBookings = bookings.filter((b: any) => 
          b.status === "confirmed" || b.status === "pending"
        );
        
        const revenue = bookings
          .filter((b: any) => b.payment_status === "paid" || b.payment_status === "partial")
          .reduce((sum: number, b: any) => sum + (parseFloat(b.paid_amount) || 0), 0);
        
        const featuredItems = [...safaris, ...trips, ...packages].filter((item: any) => 
          item.featured === true || item.featured === 1
        ).length;

        setStats({
          totalSafaris: safaris.length,
          activeBookings: activeBookings.length,
          totalUsers: users.length,
          revenue,
          inquiries: inquiries.length,
          destinations: destinations.length,
          kilimanjaroRoutes: routes.length,
          dayTrips: trips.length,
          blogPosts: posts.length,
          packages: packages.length,
          featuredItems,
        });

        setRecentInquiries(inquiries.slice(0, 4).map((inquiry: any) => ({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          subject: inquiry.subject || inquiry.inquiry_type || 'General Inquiry',
          created_at: inquiry.created_at,
        })));

        setRecentBookings(bookings.slice(0, 3).map((booking: any) => ({
          id: booking.id,
          customer_name: booking.customer_name,
          bookable: booking.bookable,
          start_date: booking.start_date,
          status: booking.status,
          total_amount: parseFloat(booking.total_amount) || 0,
        })));

      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        // Only redirect to login if it's an auth error (401)
        if (error.response?.status === 401) {
          navigate("/login");
        }
        // For other errors, just show the dashboard with empty data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const mainStats = [
    { 
      title: "Total Safaris", 
      value: stats.totalSafaris, 
      change: stats.totalSafaris > 0 ? `${stats.totalSafaris} active` : "0", 
      trend: stats.totalSafaris > 0 ? "up" : "neutral", 
      icon: Map,
      color: "orange",
      href: "/admin/safaris"
    },
    { 
      title: "Active Bookings", 
      value: stats.activeBookings, 
      change: stats.activeBookings > 0 ? "Processing" : "No pending", 
      trend: stats.activeBookings > 0 ? "up" : "neutral", 
      icon: Calendar,
      color: "blue",
      href: "/admin/bookings"
    },
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      change: stats.totalUsers > 1 ? "Registered" : "1 admin", 
      trend: "up", 
      icon: Users,
      color: "green",
      href: "/admin/users"
    },
    { 
      title: "Revenue", 
      value: `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
      change: stats.revenue > 0 ? "Paid bookings" : "No revenue yet", 
      trend: stats.revenue > 0 ? "up" : "neutral", 
      icon: TrendingUp,
      color: "purple",
      href: "/admin/bookings"
    },
  ];

  const secondaryStats = [
    { title: "Inquiries", value: stats.inquiries, icon: MessageSquare, href: "/admin/inquiries", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Destinations", value: stats.destinations, icon: Globe, href: "/admin/destinations", color: "text-green-600", bg: "bg-green-50" },
    { title: "Kilimanjaro Routes", value: stats.kilimanjaroRoutes, icon: Mountain, href: "/admin/kilimanjaro-routes", color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Day Trips", value: stats.dayTrips, icon: TreePalm, href: "/admin/day-trips", color: "text-teal-600", bg: "bg-teal-50" },
    { title: "Packages", value: stats.packages, icon: Package, href: "/admin/packages", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Featured", value: stats.featuredItems, icon: Star, href: "/admin/packages", color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "Blog Posts", value: stats.blogPosts, icon: FileText, href: "/admin/blog", color: "text-pink-600", bg: "bg-pink-50" },
  ];

  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    orange: { bg: "bg-orange-50", icon: "text-orange-600", text: "text-orange-600" },
    blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-600" },
    green: { bg: "bg-green-50", icon: "text-green-600", text: "text-green-600" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", text: "text-purple-600" },
  };

  return (
    <AdminLayout user={user}>
      {/* Welcome Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-teal-600 p-6 text-white shadow-lg shadow-orange-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0] || "Admin"}! 👋</h1>
            <p className="text-orange-100 mt-1">Here's what's happening with your safaris today.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => window.open('/', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Website
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={() => navigate('/admin/safaris/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Safari
            </Button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm" onClick={() => navigate(stat.href)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[stat.color].bg}`}>
                  <stat.icon className={`h-5 w-5 ${colorClasses[stat.color].icon}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : 
                  stat.trend === "down" ? "text-red-600" : 
                  "text-gray-500"
                }`}>
                  {stat.trend === "up" && <ArrowUpRight size={16} />}
                  {stat.trend === "down" && <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        {secondaryStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm" onClick={() => navigate(stat.href)}>
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              <CardDescription>Latest safari inquiries from customers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700" onClick={() => navigate("/admin/inquiries")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-sm">
                      {inquiry.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inquiry.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{inquiry.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{inquiry.subject}</p>
                    <p className="text-xs text-gray-400">{getTimeAgo(inquiry.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No inquiries yet</p>
            </div>
          )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <CardDescription>Latest confirmed and pending bookings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700" onClick={() => navigate("/admin/bookings")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.customer_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{booking.bookable?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "confirmed" 
                          ? "bg-green-100 text-green-700" 
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">${booking.total_amount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(booking.start_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No bookings yet</p>
            </div>
          )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { label: "Add Safari", icon: Map, href: "/admin/safaris/create", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
            { label: "Add Package", icon: Package, href: "/admin/packages/create", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
            { label: "Add Destination", icon: Globe, href: "/admin/destinations/create", color: "bg-green-50 text-green-600 hover:bg-green-100" },
            { label: "Add Route", icon: Mountain, href: "/admin/kilimanjaro-routes/create", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
            { label: "Add Day Trip", icon: TreePalm, href: "/admin/day-trips/create", color: "bg-teal-50 text-teal-600 hover:bg-teal-100" },
            { label: "Write Blog", icon: FileText, href: "/admin/blog/create", color: "bg-pink-50 text-pink-600 hover:bg-pink-100" },
            { label: "View Inquiries", icon: MessageSquare, href: "/admin/inquiries", color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.href)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${action.color}`}
            >
              <action.icon className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
