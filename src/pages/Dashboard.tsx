import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Map, Calendar, LogOut } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-sans">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-orange-600">Savanna Bloom</h2>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600">
            <LayoutDashboard size={20} /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600">
            <Map size={20} /> Safaris
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600">
            <Calendar size={20} /> Bookings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600">
            <Users size={20} /> Users
          </Button>
          <div className="pt-10">
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={20} /> Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-orange-600 font-semibold uppercase">{user?.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Safaris</CardTitle>
              <Map className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-gray-500">+15% increase</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,204</div>
              <p className="text-xs text-gray-500">+12.5% increase</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <span className="text-orange-600 font-bold">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-gray-500">+20.1% increase</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Safari Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-4 items-center">
                    <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                      <Map size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Serengeti Premium Safari Inquiry</p>
                      <p className="text-xs text-gray-500">From: john@example.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
