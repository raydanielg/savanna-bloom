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
  Globe,
  Image as ImageIcon
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    short_description: "",
    description: "",
    image: "",
    region: "",
    country: "Tanzania",
    featured: false,
    active: true,
  });

  useEffect(() => {
    if (id && id !== "create") {
      fetchDestination();
    }
  }, [id]);

  const fetchDestination = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/destinations/${id}`);
      const data = response.data.data || response.data;
      setFormData({
        name: data.name || "",
        subtitle: data.subtitle || "",
        short_description: data.short_description || "",
        description: data.description || "",
        image: data.image || "",
        region: data.region || "",
        country: data.country || "Tanzania",
        featured: data.featured || false,
        active: data.active ?? true,
      });
    } catch (error) {
      console.error("Failed to fetch destination:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load destination details",
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
        await axios.put(`/api/admin/destinations/${id}`, formData);
        toast({ title: "Success", description: "Destination updated successfully" });
      } else {
        await axios.post("/api/admin/destinations", formData);
        toast({ title: "Success", description: "Destination created successfully" });
      }
      navigate("/admin/destinations");
    } catch (error: any) {
      console.error("Failed to save destination:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to save destination",
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
            onClick={() => navigate("/admin/destinations")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {id === "create" ? "Create Destination" : "Edit Destination"}
            </h1>
            <p className="text-slate-500">Define a new location for your safari expeditions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Globe className="h-5 w-5 text-orange-500" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-semibold">Destination Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Serengeti National Park"
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-slate-700 font-semibold">Subtitle / Catchphrase</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g., The Land of Infinite Plains"
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-slate-700 font-semibold">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g., Northern Tanzania"
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-700 font-semibold">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g., Tanzania"
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-orange-500" />
                  Featured Image
                </Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-orange-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description" className="text-slate-700 font-semibold">Short Summary (for listings)</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="A brief teaser about this destination..."
                  rows={2}
                  className="bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-semibold">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell the full story of this location..."
                  rows={6}
                  className="bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="featured" className="text-slate-900 font-bold">Featured Destination</Label>
                  <p className="text-xs text-slate-500">Showcase this prominently on the home page</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="active" className="text-slate-900 font-bold">Visible on Website</Label>
                  <p className="text-xs text-slate-500">Turn this off to hide the destination from public</p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-12">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate("/admin/destinations")}
              className="h-12 px-8 rounded-xl font-semibold text-slate-500 hover:bg-slate-100"
            >
              Discard Changes
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-10 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 gap-2"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {id === "create" ? "Publish Destination" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
