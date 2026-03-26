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
  GripVertical,
  Eye,
  FileText,
  Search,
  Sparkles
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getStorageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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
    itinerary: [],
    seo_title: "",
    seo_description: "",
    seo_keywords: ""
  });

  useEffect(() => {
    fetchDestinations();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/admin/safari-categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/safaris")}
              className="rounded-full h-10 w-10 border-slate-200 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900">
                {id === "create" ? "Add Safari" : "Edit Safari"}
              </h1>
              <p className="text-slate-500 text-sm">Design a world-class safari expedition</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={cn(
                "rounded-xl h-11 px-6 font-bold transition-all shadow-sm",
                isPreviewMode ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {isPreviewMode ? <FileText className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isPreviewMode ? "Back to Editor" : "Live Preview"}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-11 px-8 font-black shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
              Publish Safari
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={cn("lg:col-span-8 space-y-8", isPreviewMode && "lg:col-span-12 max-w-5xl mx-auto")}>
            {!isPreviewMode ? (
              <div className="space-y-8">
                {/* Basic Info */}
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                    <CardTitle className="text-xl font-serif flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-orange-500" /> Core Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Safari Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., 7-Day Luxury Serengeti Safari"
                          className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-orange-500/20 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Category</Label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-orange-500/20 outline-none text-sm font-medium"
                        >
                          <option value="">Select Category</option>
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))
                          ) : (
                            <>
                              <option value="Wildlife Safari">Wildlife Safari</option>
                              <option value="Mountain Climbing">Mountain Climbing</option>
                              <option value="Beach Holiday">Beach Holiday</option>
                              <option value="Luxury Safari">Luxury Safari</option>
                              <option value="Family Safari">Family Safari</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Safari Story (Rich Text)</Label>
                      <RichTextEditor 
                        value={formData.description} 
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        className="min-h-[300px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Highlights */}
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-serif flex items-center gap-3">
                        <Plus className="h-5 w-5 text-orange-500" /> Safari Highlights
                      </CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="rounded-full bg-white shadow-sm border-slate-200 font-bold px-6">
                        <Plus className="h-4 w-4 mr-2" /> Add Highlight
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    {formData.highlights.map((h: string, idx: number) => (
                      <div key={idx} className="flex gap-3 animate-in slide-in-from-left-2">
                        <Input
                          value={h}
                          onChange={(e) => updateHighlight(idx, e.target.value)}
                          placeholder="e.g., Morning game drive in Central Serengeti"
                          className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-orange-500/20"
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(idx)} className="text-slate-300 hover:text-rose-600 rounded-full h-12 w-12">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                    {formData.highlights.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                        <p className="text-slate-400 font-medium italic">No highlights added yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Itinerary */}
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-serif flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-orange-500" /> Daily Itinerary
                      </CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addItineraryDay} className="rounded-full bg-white shadow-sm border-slate-200 font-bold px-6">
                        <Plus className="h-4 w-4 mr-2" /> Add Next Day
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="itinerary">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-8">
                            {formData.itinerary.map((item: any, index: number) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 shadow-sm group hover:shadow-md transition-all"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div {...provided.dragHandleProps} className="mt-3 text-slate-300 hover:text-orange-500 cursor-grab active:cursor-grabbing transition-colors">
                                        <GripVertical className="h-6 w-6" />
                                      </div>
                                      <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                          <Badge className="bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest">DAY {item.day}</Badge>
                                          <Input
                                            value={item.title}
                                            onChange={(e) => updateItinerary(item.id, "title", e.target.value)}
                                            placeholder="Title for this day..."
                                            className="h-12 bg-white border-slate-100 rounded-2xl font-bold text-lg"
                                          />
                                          <Button type="button" variant="ghost" size="icon" onClick={() => removeItineraryDay(item.id)} className="text-slate-300 hover:text-rose-600 rounded-full h-10 w-10">
                                            <Trash2 className="h-5 w-5" />
                                          </Button>
                                        </div>
                                        <RichTextEditor 
                                          value={item.content}
                                          onChange={(val) => updateItinerary(item.id, "content", val)}
                                          placeholder="What happens on this day?"
                                          className="min-h-[150px]"
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
                      <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                        <MapPin className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium italic">No days added. Let's start the journey!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Premium Live Preview */
              <div className="space-y-20 animate-in fade-in duration-500 pb-20">
                <section className="relative h-[60vh] min-h-[500px] flex items-end rounded-[4rem] overflow-hidden shadow-2xl">
                  <div className="absolute inset-0">
                    <img 
                      src={formData.image ? getStorageUrl(formData.image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=1600'} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                  </div>
                  <div className="relative p-16 w-full max-w-4xl">
                    <Badge className="bg-orange-600 text-white border-0 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-orange-600/30">
                      {formData.category} • {formData.days} Days
                    </Badge>
                    <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1] tracking-tight">
                      {formData.name || "Safari Name"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-8 text-white/90 font-serif italic text-xl">
                      {formData.short_description || "Experience the wild like never before..."}
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 px-8">
                  <div className="lg:col-span-8 space-y-12">
                    <div className="prose prose-slate prose-2xl max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: formData.description || "<p className='text-slate-300 italic'>Main description will appear here...</p>" }} />
                    </div>

                    <div className="pt-20 space-y-16">
                      <h2 className="text-4xl font-serif text-slate-900 border-l-4 border-orange-600 pl-8">The Journey</h2>
                      {formData.itinerary.map((d: any, idx: number) => (
                        <div key={idx} className="relative pl-12 pb-16 border-l-2 border-slate-100 last:border-0">
                          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-orange-600 shadow-lg shadow-orange-600/30" />
                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-slate-900 text-white">Day {d.day}</Badge>
                              <h3 className="text-2xl font-serif text-slate-900">{d.title}</h3>
                            </div>
                            <div className="prose prose-slate max-w-none text-base" dangerouslySetInnerHTML={{ __html: d.content }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <aside className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-center">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <h4 className="font-serif text-2xl mb-2">Safari Cost</h4>
                      <div className="flex flex-col items-center gap-1 mb-8">
                        <span className="text-5xl font-black text-orange-500">{formData.currency} {formData.price}</span>
                        <span className="text-slate-400 text-sm">starting from / person</span>
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20">Inquire Now</Button>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>

          {!isPreviewMode && (
            <aside className="lg:col-span-4 space-y-6">
              {/* Media & Specs */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-orange-500" /> Main Specs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">HERO IMAGE</Label>
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">PRICE ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <Input 
                          type="number"
                          value={formData.price} 
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          className="pl-8 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">DAYS</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <Input 
                          type="number"
                          value={formData.days} 
                          onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                          className="pl-8 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">DESTINATION</Label>
                    <select
                      value={formData.destination_id}
                      onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6 space-y-4 border-t border-slate-100">
                    <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Featured</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Home Page</p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Public Visible</p>
                      </div>
                      <Switch
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Details */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 flex items-center gap-2">
                    <Search className="h-4 w-4" /> SEO Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">META TITLE</Label>
                    <Input
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder="Best Safari Expedition..."
                      className="h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">META DESCRIPTION</Label>
                    <Textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder="Join our luxury safari..."
                      className="min-h-[100px] bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">KEYWORDS</Label>
                    <Input
                      value={formData.seo_keywords}
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                      placeholder="safari, serengeti, wild..."
                      className="h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-orange-500/40"
                    />
                  </div>
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
