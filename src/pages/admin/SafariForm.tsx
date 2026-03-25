import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { useAuth } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  MapPin,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  content: string;
}

export default function SafariForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    name: "",
    short_description: "",
    description: "",
    category: "Wildlife Safari",
    duration: "",
    days: 1,
    price: 0,
    currency: "USD",
    image: "",
    destination_id: "",
    difficulty: "Moderate",
    featured: false,
    active: true,
    highlights: [],
    itinerary: []
  });

  useEffect(() => {
    fetchDestinations();
    if (id && id !== "create") {
      fetchSafari();
    }
  }, [id]);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("/api/destinations");
      setDestinations(response.data.data || response.data || []);
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
    }
  };

  const fetchSafari = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/safaris/${id}`);
      const data = response.data.data || response.data;
      setFormData({
        ...data,
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        itinerary: Array.isArray(data.itinerary) ? data.itinerary : []
      });
    } catch (error) {
      console.error("Failed to fetch safari:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load safari details",
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
        await axios.put(`/api/admin/safaris/${id}`, formData);
        toast({ title: "Success", description: "Safari updated successfully" });
      } else {
        await axios.post("/api/admin/safaris", formData);
        toast({ title: "Success", description: "Safari created successfully" });
      }
      navigate("/admin/safaris");
    } catch (error: any) {
      console.error("Failed to save safari:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to save safari",
      });
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, ""]
    });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...formData.highlights];
    newHighlights.splice(index, 1);
    setFormData({ ...formData, highlights: newHighlights });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addItineraryDay = () => {
    const newDay: ItineraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      day: formData.itinerary.length + 1,
      title: `Day ${formData.itinerary.length + 1}`,
      content: ""
    };
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, newDay]
    });
  };

  const removeItineraryDay = (id: string) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((item: any) => item.id !== id).map((item: any, idx: number) => ({
        ...item,
        day: idx + 1
      }))
    });
  };

  const updateItinerary = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.map((item: any) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(formData.itinerary);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFormData({
      ...formData,
      itinerary: items.map((item: any, idx: number) => ({
        ...item,
        day: idx + 1
      }))
    });
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/admin/safaris")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {id === "create" ? "Create Safari Expedition" : "Edit Safari"}
            </h1>
            <p className="text-slate-500">Design a premium safari experience for your clients</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <ImageIcon className="h-5 w-5 text-orange-500" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-semibold">Safari Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 7-Day Luxury Serengeti Safari"
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-700 font-semibold">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Wildlife Safari">Wildlife Safari</option>
                    <option value="Mountain Climbing">Mountain Climbing</option>
                    <option value="Beach Holiday">Beach Holiday</option>
                    <option value="Luxury Safari">Luxury Safari</option>
                    <option value="Family Safari">Family Safari</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-slate-700 font-semibold">Primary Destination</Label>
                  <select
                    id="destination"
                    value={formData.destination_id}
                    onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days" className="text-slate-700 font-semibold">Duration (Days)</Label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="days"
                      type="number"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                      className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-700 font-semibold">Starting Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Hero Image</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description" className="text-slate-700 font-semibold">Short Summary</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Catchy one-liner for listings..."
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Detailed Description (Rich Text)</Label>
                <RichTextEditor 
                  value={formData.description} 
                  onChange={(val) => setFormData({ ...formData, description: val })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Highlights Section */}
          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <Plus className="h-5 w-5 text-orange-500" />
                  Safari Highlights
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="rounded-full">
                  Add Highlight
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {formData.highlights.map((h: string, idx: number) => (
                <div key={idx} className="flex gap-3">
                  <Input
                    value={h}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                    placeholder="e.g., Morning game drive in Central Serengeti"
                    className="h-11 bg-slate-50 border-slate-200 rounded-xl"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(idx)} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.highlights.length === 0 && (
                <p className="text-center text-slate-400 py-4 italic text-sm">No highlights added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Itinerary Section with Drag and Drop */}
          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Daily Itinerary
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItineraryDay} className="rounded-full">
                  Add Day
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="itinerary">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                      {formData.itinerary.map((item: any, index: number) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm"
                            >
                              <div className="flex items-start gap-4">
                                <div {...provided.dragHandleProps} className="mt-2 text-slate-400 cursor-grab active:cursor-grabbing">
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-200">
                                      Day {item.day}
                                    </div>
                                    <Input
                                      value={item.title}
                                      onChange={(e) => updateItinerary(item.id, "title", e.target.value)}
                                      placeholder="Title for this day..."
                                      className="h-11 bg-white border-slate-200 rounded-xl font-bold"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItineraryDay(item.id)} className="text-slate-400 hover:text-red-600">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <RichTextEditor 
                                    value={item.content}
                                    onChange={(val) => updateItinerary(item.id, "content", val)}
                                    placeholder="What happens on this day?"
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {formData.itinerary.length === 0 && (
                <p className="text-center text-slate-400 py-12 italic">No itinerary days added. Start building your journey!</p>
              )}
            </CardContent>
          </Card>

          {/* Visibility Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100">
              <div className="flex flex-col gap-1">
                <Label htmlFor="featured" className="text-slate-900 font-bold">Featured Safari</Label>
                <p className="text-xs text-slate-500 uppercase tracking-tighter">Pin to homepage</p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex flex-col gap-1">
                <Label htmlFor="active" className="text-slate-900 font-bold">Active Status</Label>
                <p className="text-xs text-slate-500 uppercase tracking-tighter">Visible to public</p>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate("/admin/safaris")} className="h-14 px-10 rounded-2xl font-bold text-slate-500 hover:bg-slate-100">
              Discard
            </Button>
            <Button type="submit" className="h-14 px-14 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-xl shadow-orange-200 gap-3 text-lg" disabled={saving}>
              {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
              {id === "create" ? "Publish Safari" : "Update Safari"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
