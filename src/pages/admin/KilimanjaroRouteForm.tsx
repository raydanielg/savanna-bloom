import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { useAuth } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Mountain,
  Clock,
  TrendingUp,
  DollarSign,
  Image as ImageIcon
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function KilimanjaroRouteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    days: 5,
    difficulty: "Moderate",
    price: 0,
    currency: "USD",
    image: "",
    success_rate: 90,
    featured: false,
    active: true,
  });

  useEffect(() => {
    if (id && id !== "create") {
      fetchRoute();
    }
  }, [id]);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/kilimanjaro-routes/${id}`);
      const data = response.data.data || response.data;
      setFormData({
        name: data.name || "",
        short_description: data.short_description || "",
        description: data.description || "",
        days: data.days || 5,
        difficulty: data.difficulty || "Moderate",
        price: data.price || 0,
        currency: data.currency || "USD",
        image: data.image || "",
        success_rate: data.success_rate || 90,
        featured: data.featured || false,
        active: data.active ?? true,
      });
    } catch (error) {
      console.error("Failed to fetch route:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load route details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id && id !== "create") {
        await axios.put(`/api/admin/kilimanjaro-routes/${id}`, formData);
        toast({ title: "Success", description: "Route updated successfully" });
      } else {
        await axios.post("/api/admin/kilimanjaro-routes", formData);
        toast({ title: "Success", description: "Route created successfully" });
      }
      navigate("/admin/kilimanjaro-routes");
    } catch (error: any) {
      console.error("Failed to save route:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to save route",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/admin/kilimanjaro-routes")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {id === "create" ? "Create Kili Route" : "Edit Kili Route"}
            </h1>
            <p className="text-slate-500">Define climbing specs for Mt. Kilimanjaro routes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Mountain className="h-5 w-5 text-orange-500" />
                Route Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-semibold">Route Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Machame Route"
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days" className="text-slate-700 font-semibold">Duration (Days) *</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-slate-700 font-semibold">Difficulty Level</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Difficult">Difficult</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-700 font-semibold">Base Price ($) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success_rate" className="text-slate-700 font-semibold">Success Rate (%)</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="success_rate"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.success_rate}
                      onChange={(e) => setFormData({ ...formData, success_rate: parseInt(e.target.value) })}
                      className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-orange-500" />
                  Route Map / Hero Image
                </Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-orange-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description" className="text-slate-700 font-semibold">Short Summary</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="A quick overview of the route's character..."
                  rows={2}
                  className="bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-semibold">Comprehensive Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full details about terrain, acclimatization, and scenery..."
                  rows={6}
                  className="bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="featured" className="text-slate-900 font-bold">Featured Route</Label>
                    <p className="text-xs text-slate-500">Recommend this to climbers</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="active" className="text-slate-900 font-bold">Active Status</Label>
                    <p className="text-xs text-slate-500">Available for public booking</p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-12">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate("/admin/kilimanjaro-routes")}
              className="h-12 px-8 rounded-xl font-semibold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-10 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 gap-2"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {id === "create" ? "Add Route" : "Update Route"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
