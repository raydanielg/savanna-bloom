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
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Star,
  Plus,
  X,
  Mountain,
  TreePalm,
  Compass,
  Camera,
  Utensils,
  Car,
  BedDouble,
  Shield,
  HelpCircle,
  ListChecks,
} from "lucide-react";

interface Destination {
  id: number;
  name: string;
}

export default function PackageCreate() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    short_description: "",
    description: "",
    image: "",
    gallery: [] as string[],
    category: "Wildlife Safari",
    destination_id: "",
    duration_days: 5,
    duration_nights: 4,
    price: 0,
    discount_price: "",
    currency: "USD",
    difficulty: "Moderate",
    min_guests: 1,
    max_guests: 10,
    accommodation_type: "Lodge",
    highlights: [] as string[],
    includes: [] as string[],
    excludes: [] as string[],
    itinerary: [] as { day: number; title: string; description: string; meals: string[]; accommodation: string }[],
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

      const destinationsResponse = await axios.get("/api/destinations");
      setDestinations(destinationsResponse.data || []);
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
        destination_id: formData.destination_id ? parseInt(formData.destination_id) : null,
      };

      const response = await axios.post("/api/admin/packages", submitData);
      navigate("/admin/packages");
    } catch (error) {
      console.error("Failed to create package:", error);
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
      setFormData({ ...formData, includes: [...formData.includes, includeInput.trim()] });
      setIncludeInput("");
    }
  };

  const removeInclude = (index: number) => {
    setFormData({ ...formData, includes: formData.includes.filter((_, i) => i !== index) });
  };

  const addExclude = () => {
    if (excludeInput.trim()) {
      setFormData({ ...formData, excludes: [...formData.excludes, excludeInput.trim()] });
      setExcludeInput("");
    }
  };

  const removeExclude = (index: number) => {
    setFormData({ ...formData, excludes: formData.excludes.filter((_, i) => i !== index) });
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

  const addItineraryDay = () => {
    const newDay = formData.itinerary.length + 1;
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: newDay, title: "", description: "", meals: [], accommodation: "" }],
    });
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const updated = [...formData.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, itinerary: updated });
  };

  const removeItineraryDay = (index: number) => {
    const updated = formData.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
    setFormData({ ...formData, itinerary: updated });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ElementType> = {
      "Wildlife Safari": Compass,
      "Mountain Climbing": Mountain,
      "Beach Holiday": TreePalm,
      "Multi-Park Safari": MapPin,
      "Wilderness Safari": Camera,
    };
    return icons[category] || Package;
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
              <Link to="/admin/packages">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Package</h1>
              <p className="text-gray-500">Add a new safari or tour package</p>
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
              {saving ? "Creating..." : "Create Package"}
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
                    <Package className="h-5 w-5 text-orange-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="name">Package Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Serengeti Great Migration Safari"
                        className="text-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="subtitle">Subtitle / Tagline</Label>
                      <Input
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="e.g., Witness the Greatest Wildlife Show on Earth"
                      />
                    </div>
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
                      placeholder="Detailed description of the package..."
                      rows={6}
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
                          <SelectItem value="Wildlife Safari">
                            <div className="flex items-center gap-2">
                              <Compass className="h-4 w-4" />
                              Wildlife Safari
                            </div>
                          </SelectItem>
                          <SelectItem value="Mountain Climbing">
                            <div className="flex items-center gap-2">
                              <Mountain className="h-4 w-4" />
                              Mountain Climbing
                            </div>
                          </SelectItem>
                          <SelectItem value="Beach Holiday">
                            <div className="flex items-center gap-2">
                              <TreePalm className="h-4 w-4" />
                              Beach Holiday
                            </div>
                          </SelectItem>
                          <SelectItem value="Multi-Park Safari">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Multi-Park Safari
                            </div>
                          </SelectItem>
                          <SelectItem value="Wilderness Safari">
                            <div className="flex items-center gap-2">
                              <Camera className="h-4 w-4" />
                              Wilderness Safari
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Select value={formData.destination_id} onValueChange={(value) => setFormData({ ...formData, destination_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((d) => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <div className="grid grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration_days">Days</Label>
                      <Input
                        id="duration_days"
                        type="number"
                        min="1"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_nights">Nights</Label>
                      <Input
                        id="duration_nights"
                        type="number"
                        min="0"
                        value={formData.duration_nights}
                        onChange={(e) => setFormData({ ...formData, duration_nights: parseInt(e.target.value) || 0 })}
                      />
                    </div>
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
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Challenging">Challenging</SelectItem>
                          <SelectItem value="Difficult">Difficult</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="accommodation_type">Accommodation Type</Label>
                    <Select value={formData.accommodation_type} onValueChange={(value) => setFormData({ ...formData, accommodation_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lodge">Lodge</SelectItem>
                        <SelectItem value="Tented Camp">Tented Camp</SelectItem>
                        <SelectItem value="Luxury Camp">Luxury Camp</SelectItem>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Budget Camping">Budget Camping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Highlights, Includes, Excludes, Itinerary */}
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <Tabs defaultValue="highlights" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
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
                      <TabsTrigger value="itinerary" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Itinerary
                      </TabsTrigger>
                    </TabsList>

                    {/* Highlights Tab */}
                    <TabsContent value="highlights" className="space-y-4 mt-4">
                      <div className="flex gap-2">
                        <Input
                          value={highlightInput}
                          onChange={(e) => setHighlightInput(e.target.value)}
                          placeholder="Add a highlight (e.g., Witness the Great Migration)"
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
                          placeholder="Add an inclusion (e.g., All park fees)"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
                        />
                        <Button type="button" variant="outline" onClick={addInclude}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.includes.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeInclude(index)} className="hover:text-red-500">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.includes.length === 0 && (
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
                          placeholder="Add an exclusion (e.g., International flights)"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclude())}
                        />
                        <Button type="button" variant="outline" onClick={addExclude}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.excludes.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeExclude(index)} className="hover:text-red-700">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.excludes.length === 0 && (
                          <p className="text-sm text-gray-400 col-span-2">No exclusions added yet</p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Itinerary Tab */}
                    <TabsContent value="itinerary" className="space-y-4 mt-4">
                      <Button type="button" variant="outline" onClick={addItineraryDay} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day
                      </Button>
                      <div className="space-y-4">
                        {formData.itinerary.map((day, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                                    {day.day}
                                  </div>
                                  Day {day.day}
                                </CardTitle>
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeItineraryDay(index)} className="text-red-500">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                  value={day.title}
                                  onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                                  placeholder="e.g., Arrival at Kilimanjaro Airport"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={day.description}
                                  onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
                                  placeholder="Describe the activities for this day..."
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label>Accommodation</Label>
                                  <Input
                                    value={day.accommodation}
                                    onChange={(e) => updateItineraryDay(index, "accommodation", e.target.value)}
                                    placeholder="e.g., Serengeti Serena Lodge"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Meals</Label>
                                  <Input
                                    value={day.meals.join(", ")}
                                    onChange={(e) => updateItineraryDay(index, "meals", e.target.value.split(",").map(m => m.trim()))}
                                    placeholder="e.g., Breakfast, Lunch, Dinner"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {formData.itinerary.length === 0 && (
                          <p className="text-sm text-gray-400 text-center py-4">No itinerary days added yet</p>
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
                      <Label>Featured Package</Label>
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
              <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-purple-50">
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
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{formData.name || "Package Name"}</h3>
                      <p className="text-sm text-gray-500 truncate">{formData.subtitle || "Subtitle"}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        {formData.duration_days}D / {formData.duration_nights}N
                      </div>
                      <div className="font-bold text-orange-600">
                        ${formData.price > 0 ? formData.price.toLocaleString() : "0"}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {formData.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {formData.difficulty}
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
