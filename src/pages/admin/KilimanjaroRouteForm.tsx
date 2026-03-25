import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/lib/axios";
import { useAuth } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  ImageIcon, 
  Eye, 
  Globe, 
  Tag, 
  MapPin,
  Mountain,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Search,
  TrendingUp,
  DollarSign
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { getStorageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface RouteDay {
  id: string;
  day: number;
  title: string;
  content: string;
  image: string;
  altitude_gain?: string;
  distance?: string;
  hiking_time?: string;
}

export default function KilimanjaroRouteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    short_description: "",
    description: "",
    days: 7,
    difficulty: "Moderate",
    price: 0,
    currency: "USD",
    image: "",
    success_rate: 95,
    featured: false,
    active: true,
    itinerary: [],
    seo_title: "",
    seo_description: "",
    seo_keywords: ""
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
        ...data,
        itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
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

  const addDay = () => {
    const nextDay = formData.itinerary.length + 1;
    const newDay: RouteDay = {
      id: Math.random().toString(36).substr(2, 9),
      day: nextDay,
      title: `Day ${nextDay}: `,
      content: "",
      image: ""
    };
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, newDay]
    });
  };

  const removeDay = (did: string) => {
    const filtered = formData.itinerary.filter((d: any) => d.id !== did);
    // Re-index days
    const reindexed = filtered.map((d: any, idx: number) => ({ ...d, day: idx + 1 }));
    setFormData({
      ...formData,
      itinerary: reindexed
    });
  };

  const updateDay = (did: string, field: string, value: any) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.map((d: any) => 
        d.id === did ? { ...d, [field]: value } : d
      )
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(formData.itinerary);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Re-index days after drop
    const reindexed = items.map((d: any, idx: number) => ({ ...d, day: idx + 1 }));
    setFormData({ ...formData, itinerary: reindexed });
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/kilimanjaro-routes")}
              className="rounded-full h-10 w-10 border-slate-200 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900">
                {id === "create" ? "Add Kili Route" : "Edit Kili Route"}
              </h1>
              <p className="text-slate-500 text-sm">Design a world-class climbing expedition</p>
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
              Publish Expedition
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editor/Preview Area */}
          <div className={cn("lg:col-span-8 space-y-8", isPreviewMode && "lg:col-span-12 max-w-5xl mx-auto")}>
            {!isPreviewMode ? (
              <div className="space-y-8">
                {/* Basic Specs */}
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                    <CardTitle className="text-xl font-serif flex items-center gap-3">
                      <Mountain className="h-5 w-5 text-orange-500" /> Route Specs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Route Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Lemosho Route"
                          className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-orange-500/20 font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Days</Label>
                          <Input
                            type="number"
                            value={formData.days}
                            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                            className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-orange-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Difficulty</Label>
                          <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-orange-500/20 outline-none text-sm font-medium"
                          >
                            <option value="Moderate">Moderate</option>
                            <option value="Challenging">Challenging</option>
                            <option value="Difficult">Difficult</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Overview Story</Label>
                      <RichTextEditor 
                        value={formData.description} 
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        className="min-h-[250px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Itinerary with Drag and Drop */}
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-serif flex items-center gap-3">
                        <Clock className="h-5 w-5 text-orange-500" /> Daily Itinerary
                      </CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addDay} className="rounded-full bg-white shadow-sm border-slate-200 font-bold px-6">
                        <Plus className="h-4 w-4 mr-2" /> Add Next Day
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="itinerary">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-8">
                            {formData.itinerary.map((d: any, index: number) => (
                              <Draggable key={d.id} draggableId={d.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 shadow-sm group hover:shadow-md transition-all"
                                  >
                                    <div className="flex flex-col md:flex-row gap-8">
                                      <div className="w-full md:w-1/3 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <Badge className="bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest">DAY {d.day}</Badge>
                                          <div {...provided.dragHandleProps} className="text-slate-300 hover:text-orange-500 cursor-grab active:cursor-grabbing transition-colors">
                                            <GripVertical className="h-5 w-5" />
                                          </div>
                                        </div>
                                        <ImageUpload
                                          value={d.image}
                                          onChange={(url) => updateDay(d.id, "image", url)}
                                          className="aspect-square rounded-3xl"
                                        />
                                      </div>
                                      <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                          <Input
                                            value={d.title}
                                            onChange={(e) => updateDay(d.id, "title", e.target.value)}
                                            placeholder="Daily Title (e.g. Barranco Camp)"
                                            className="h-12 bg-white border-slate-100 rounded-2xl font-bold text-lg"
                                          />
                                          <Button type="button" variant="ghost" size="icon" onClick={() => removeDay(d.id)} className="text-slate-300 hover:text-rose-600 rounded-full h-10 w-10">
                                            <Trash2 className="h-5 w-5" />
                                          </Button>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4">
                                          <div className="space-y-1">
                                            <Label className="text-[9px] font-black text-slate-400 uppercase">Altitude</Label>
                                            <Input 
                                              value={d.altitude_gain} 
                                              onChange={(e) => updateDay(d.id, "altitude_gain", e.target.value)}
                                              placeholder="3,976m"
                                              className="h-9 bg-white border-slate-100 rounded-xl text-xs"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[9px] font-black text-slate-400 uppercase">Distance</Label>
                                            <Input 
                                              value={d.distance} 
                                              onChange={(e) => updateDay(d.id, "distance", e.target.value)}
                                              placeholder="5km"
                                              className="h-9 bg-white border-slate-100 rounded-xl text-xs"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[9px] font-black text-slate-400 uppercase">Hiking Time</Label>
                                            <Input 
                                              value={d.hiking_time} 
                                              onChange={(e) => updateDay(d.id, "hiking_time", e.target.value)}
                                              placeholder="4-5 hrs"
                                              className="h-9 bg-white border-slate-100 rounded-xl text-xs"
                                            />
                                          </div>
                                        </div>

                                        <RichTextEditor 
                                          value={d.content}
                                          onChange={(val) => updateDay(d.id, "content", val)}
                                          placeholder="Daily highlights and terrain details..."
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
                        <Mountain className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium italic">No days added. Let's start the climb!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Premium Live Preview (Matches KilimanjaroRoute Detail) */
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
                      Mt. Kilimanjaro • {formData.days} Days
                    </Badge>
                    <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1] tracking-tight">
                      {formData.name || "Route Name"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-8 text-white/90">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <span className="font-bold">{formData.success_rate}% Success</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mountain className="h-5 w-5 text-orange-500" />
                        <span className="font-bold">{formData.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 px-8">
                  <div className="lg:col-span-8 space-y-12">
                    <div className="prose prose-slate prose-2xl max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: formData.description || "<p className='text-slate-300 italic'>Main route description will appear here...</p>" }} />
                    </div>

                    <div className="pt-20 space-y-16">
                      <h2 className="text-4xl font-serif text-slate-900 border-l-4 border-orange-600 pl-8">The Journey</h2>
                      {formData.itinerary.map((d: any, idx: number) => (
                        <div key={idx} className="relative pl-12 pb-16 border-l-2 border-slate-100 last:border-0">
                          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-orange-600 shadow-lg shadow-orange-600/30" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-slate-900 text-white">Day {d.day}</Badge>
                                <h3 className="text-2xl font-serif text-slate-900">{d.title}</h3>
                              </div>
                              <div className="flex gap-4 mb-4">
                                {d.altitude_gain && <span className="text-[10px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-600">Alt: {d.altitude_gain}</span>}
                                {d.distance && <span className="text-[10px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-600">Dist: {d.distance}</span>}
                              </div>
                              <div className="prose prose-slate max-w-none text-base" dangerouslySetInnerHTML={{ __html: d.content }} />
                            </div>
                            <div className="rounded-[3rem] overflow-hidden shadow-xl aspect-[4/3]">
                              <img src={d.image ? getStorageUrl(d.image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=800'} className="w-full h-full object-cover" alt="Day Preview" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <aside className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <h4 className="font-serif text-2xl mb-2 flex items-center gap-3">
                         Expedition Cost
                      </h4>
                      <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-4xl font-black text-orange-500">{formData.currency} {formData.price}</span>
                        <span className="text-slate-400 text-sm">/ person</span>
                      </div>
                      <p className="text-slate-400 text-base leading-relaxed mb-10 font-medium italic">Join our expert mountain crews for the ultimate Kilimanjaro experience.</p>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20">Book Climb</Button>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          {!isPreviewMode && (
            <aside className="lg:col-span-4 space-y-6">
              {/* Media & Stats */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-orange-500" /> Main Specs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">HERO / MAP IMAGE</Label>
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
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SUCCESS %</Label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <Input 
                          type="number"
                          value={formData.success_rate} 
                          onChange={(e) => setFormData({ ...formData, success_rate: parseInt(e.target.value) })}
                          className="pl-8 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4 border-t border-slate-100">
                    <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Featured</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Top Recommend</p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Active</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Visible to Public</p>
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
                      placeholder="Best Kili Route..."
                      className="h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">META DESCRIPTION</Label>
                    <Textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder="Join our expert-led climb..."
                      className="min-h-[100px] bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">KEYWORDS</Label>
                    <Input
                      value={formData.seo_keywords}
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                      placeholder="climb, machame, kili..."
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
