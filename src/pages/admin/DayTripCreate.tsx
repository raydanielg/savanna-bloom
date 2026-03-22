import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "@/lib/axios";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  TreePalm,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Plus,
  X,
  Camera,
  Shield,
  HelpCircle,
  ListChecks,
} from "lucide-react";

export default function DayTripCreate() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    category: "Wildlife",
    price: 0,
    discount_price: "",
    currency: "USD",
    duration: "Full Day",
    image: "",
    gallery: [] as string[],
    highlights: [] as string[],
    included: [] as string[],
    excluded: [] as string[],
    location: "",
    min_guests: 1,
    max_guests: 10,
    featured: false,
    active: true,
    meta_title: "",
    meta_description: "",
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get("/api/user");
      setUser(userResponse.data);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = {
        ...formData,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      };

      await axios.post("/api/admin/day-trips", submitData);
      navigate("/admin/day-trips");
    } catch (error) {
      console.error("Failed to create day trip:", error);
    } finally {
      setSaving(false);
    }
  };

  // Add/Remove functions
  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

  const addInclude = () => {
    if (includeInput.trim()) {
      setFormData({ ...formData, included: [...formData.included, includeInput.trim()] });
      setIncludeInput("");
    }
  };

  const removeInclude = (index: number) => {
    setFormData({ ...formData, included: formData.included.filter((_, i) => i !== index) });
  };

  const addExclude = () => {
    if (excludeInput.trim()) {
      setFormData({ ...formData, excluded: [...formData.excluded, excludeInput.trim()] });
      setExcludeInput("");
    }
  };

  const removeExclude = (index: number) => {
    setFormData({ ...formData, excluded: formData.excluded.filter((_, i) => i !== index) });
  };

  const addGalleryImage = () => {
    if (galleryInput.trim()) {
      setFormData({ ...formData, gallery: [...formData.gallery, galleryInput.trim()] });
      setGalleryInput("");
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Wildlife: "bg-green-100 text-green-700",
      Cultural: "bg-purple-100 text-purple-700",
      Adventure: "bg-orange-100 text-orange-700",
      Beach: "bg-blue-100 text-blue-700",
      "Water Sports": "bg-cyan-100 text-cyan-700",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/day-trips">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Day Trip</h1>
              <p className="text-gray-500">Add a new day trip experience</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label className="text-sm">{formData.active ? "Active" : "Draft"}</Label>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSubmit} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Creating..." : "Create Day Trip"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TreePalm className="h-5 w-5 text-teal-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Trip Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Arusha National Park Day Trip"
                      className="text-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="Brief description for cards and listings..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of the day trip..."
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wildlife">Wildlife</SelectItem>
                          <SelectItem value="Cultural">Cultural</SelectItem>
                          <SelectItem value="Adventure">Adventure</SelectItem>
                          <SelectItem value="Beach">Beach</SelectItem>
                          <SelectItem value="Water Sports">Water Sports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Arusha, Zanzibar"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Duration */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Pricing & Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_price">Discount ($)</Label>
                      <Input
                        id="discount_price"
                        type="number"
                        min="0"
                        value={formData.discount_price}
                        onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Half Day (4 hours)">Half Day (4 hours)</SelectItem>
                          <SelectItem value="Full Day (6-8 hours)">Full Day (6-8 hours)</SelectItem>
                          <SelectItem value="Full Day (8+ hours)">Full Day (8+ hours)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_guests">Min Guests</Label>
                      <Input
                        id="min_guests"
                        type="number"
                        min="1"
                        value={formData.min_guests}
                        onChange={(e) => setFormData({ ...formData, min_guests: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_guests">Max Guests</Label>
                      <Input
                        id="max_guests"
                        type="number"
                        min="1"
                        value={formData.max_guests}
                        onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) || 10 })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Highlights, Includes, Excludes */}
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <Tabs defaultValue="highlights" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="highlights" className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Highlights
                      </TabsTrigger>
                      <TabsTrigger value="includes" className="flex items-center gap-1">
                        <ListChecks className="h-4 w-4" />
                        Includes
                      </TabsTrigger>
                      <TabsTrigger value="excludes" className="flex items-center gap-1">
                        <X className="h-4 w-4" />
                        Excludes
                      </TabsTrigger>
                    </TabsList>

                    {/* Highlights Tab */}
                    <TabsContent value="highlights" className="space-y-4 mt-4">
                      <div className="flex gap-2">
                        <Input
                          value={highlightInput}
                          onChange={(e) => setHighlightInput(e.target.value)}
                          placeholder="Add a highlight (e.g., Mount Meru views)"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                        />
                        <Button type="button" variant="outline" onClick={addHighlight}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                            {highlight}
                            <button type="button" onClick={() => removeHighlight(index)} className="ml-2 hover:text-red-500">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {formData.highlights.length === 0 && (
                          <p className="text-sm text-gray-400">No highlights added yet</p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Includes Tab */}
                    <TabsContent value="includes" className="space-y-4 mt-4">
                      <div className="flex gap-2">
                        <Input
                          value={includeInput}
                          onChange={(e) => setIncludeInput(e.target.value)}
                          placeholder="Add an inclusion (e.g., Park fees, Guide, Lunch)"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
                        />
                        <Button type="button" variant="outline" onClick={addInclude}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.included.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeInclude(index)} className="hover:text-red-500">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.included.length === 0 && (
                          <p className="text-sm text-gray-400 col-span-2">No inclusions added yet</p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Excludes Tab */}
                    <TabsContent value="excludes" className="space-y-4 mt-4">
                      <div className="flex gap-2">
                        <Input
                          value={excludeInput}
                          onChange={(e) => setExcludeInput(e.target.value)}
                          placeholder="Add an exclusion (e.g., Tips, Personal items)"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclude())}
                        />
                        <Button type="button" variant="outline" onClick={addExclude}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.excluded.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeExclude(index)} className="hover:text-red-700">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.excluded.length === 0 && (
                          <p className="text-sm text-gray-400 col-span-2">No exclusions added yet</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-purple-600" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {formData.image && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gallery */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    Gallery Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      placeholder="Add image URL"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryImage())}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addGalleryImage}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.gallery.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gray-600" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Featured Trip</Label>
                      <p className="text-xs text-gray-500">Show on homepage</p>
                    </div>
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active</Label>
                      <p className="text-xs text-gray-500">Available for booking</p>
                    </div>
                    <Switch
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-teal-600" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="SEO title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="SEO description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Preview */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-teal-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TreePalm className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{formData.name || "Trip Name"}</h3>
                      <p className="text-sm text-gray-500 truncate">{formData.location || "Location"}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        {formData.duration}
                      </div>
                      <div className="font-bold text-teal-600">
                        ${formData.price > 0 ? formData.price.toLocaleString() : "0"}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge className={getCategoryColor(formData.category)}>
                        {formData.category}
                      </Badge>
                      {formData.featured && (
                        <Badge className="bg-orange-100 text-orange-700 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
