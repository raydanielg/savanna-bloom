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
  Clock,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Search
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { getStorageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface HighlightItem {
  id: string;
  title: string;
  content: string;
  image: string;
}

export default function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    subtitle: "",
    short_description: "",
    description: "",
    image: "",
    region: "",
    country: "Tanzania",
    featured: false,
    active: true,
    highlights: [],
    seo_title: "",
    seo_description: "",
    seo_keywords: ""
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
        ...data,
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
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

  const addHighlight = () => {
    const newHighlight: HighlightItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      content: "",
      image: ""
    };
    setFormData({
      ...formData,
      highlights: [...formData.highlights, newHighlight]
    });
  };

  const removeHighlight = (hid: string) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((h: any) => h.id !== hid)
    });
  };

  const updateHighlight = (hid: string, field: string, value: any) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.map((h: any) => 
        h.id === hid ? { ...h, [field]: value } : h
      )
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(formData.highlights);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData({ ...formData, highlights: items });
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
              onClick={() => navigate("/admin/destinations")}
              className="rounded-full h-10 w-10 border-slate-200 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900">
                {id === "create" ? "Add Destination" : "Edit Destination"}
              </h1>
              <p className="text-slate-500 text-sm">Design a world-class destination page</p>
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
              Publish Location
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editor/Preview Area */}
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
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Destination Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Serengeti National Park"
                          className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-orange-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Subtitle</Label>
                        <Input
                          value={formData.subtitle}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          placeholder="The Land of Infinite Plains"
                          className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-orange-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Hero Story (Rich Text)</Label>
                      <RichTextEditor 
                        value={formData.description} 
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        className="min-h-[300px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Highlights with Drag and Drop */}
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-serif flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-orange-500" /> Destination Highlights
                      </CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="rounded-full bg-white shadow-sm border-slate-200 font-bold px-6">
                        <Plus className="h-4 w-4 mr-2" /> Add Highlight
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="highlights">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-8">
                            {formData.highlights.map((h: any, index: number) => (
                              <Draggable key={h.id} draggableId={h.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 shadow-sm group hover:shadow-md transition-all"
                                  >
                                    <div className="flex flex-col md:flex-row gap-8">
                                      <div className="w-full md:w-1/3 space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visual</Label>
                                        <ImageUpload
                                          value={h.image}
                                          onChange={(url) => updateHighlight(h.id, "image", url)}
                                          className="aspect-square rounded-3xl"
                                        />
                                      </div>
                                      <div className="flex-1 space-y-6">
                                        <div className="flex items-start gap-4">
                                          <div {...provided.dragHandleProps} className="mt-3 text-slate-300 hover:text-orange-500 cursor-grab active:cursor-grabbing transition-colors">
                                            <GripVertical className="h-6 w-6" />
                                          </div>
                                          <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4">
                                              <Input
                                                value={h.title}
                                                onChange={(e) => updateHighlight(h.id, "title", e.target.value)}
                                                placeholder="Highlight Title (e.g. Great Migration)"
                                                className="h-12 bg-white border-slate-100 rounded-2xl font-bold text-lg"
                                              />
                                              <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(h.id)} className="text-slate-300 hover:text-rose-600 rounded-full h-10 w-10">
                                                <Trash2 className="h-5 w-5" />
                                              </Button>
                                            </div>
                                            <RichTextEditor 
                                              value={h.content}
                                              onChange={(val) => updateHighlight(h.id, "content", val)}
                                              placeholder="Tell the story of this highlight..."
                                              className="min-h-[150px]"
                                            />
                                          </div>
                                        </div>
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
                    {formData.highlights.length === 0 && (
                      <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                        <MapPin className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium italic">No highlights added. Start building the journey!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Premium Live Preview (Matches Destination Detail style) */
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
                      {formData.region || "Explore Tanzania"}
                    </Badge>
                    <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1] tracking-tight">
                      {formData.name || "Destination Name"}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl font-serif italic">
                      "{formData.subtitle || "The journey begins here..."}"
                    </p>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 px-8">
                  <div className="lg:col-span-8 space-y-12">
                    <div className="prose prose-slate prose-2xl max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: formData.description || "<p className='text-slate-300 italic'>Main description will appear here...</p>" }} />
                    </div>

                    <div className="pt-20 space-y-16">
                      <h2 className="text-4xl font-serif text-slate-900 border-l-4 border-orange-600 pl-8">What to Expect</h2>
                      {formData.highlights.map((h: any, idx: number) => (
                        <div key={idx} className={cn("grid grid-cols-1 md:grid-cols-2 gap-12 items-center", idx % 2 === 1 && "md:flex-row-reverse")}>
                          <div className={cn("space-y-6", idx % 2 === 1 && "md:order-2")}>
                            <h3 className="text-3xl font-serif text-slate-900">{h.title || "Highlight Title"}</h3>
                            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: h.content }} />
                          </div>
                          <div className={cn("rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3]", idx % 2 === 1 && "md:order-1")}>
                            <img src={h.image ? getStorageUrl(h.image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=800'} className="w-full h-full object-cover" alt="Highlight" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <aside className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <h4 className="font-serif text-2xl mb-6 flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-orange-500" /> Safari Planning
                      </h4>
                      <p className="text-slate-400 text-base leading-relaxed mb-10 font-medium">Ready to explore {formData.name || 'this paradise'}? Our expert guides are ready to craft your custom adventure.</p>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20">Book Expedition</Button>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          {!isPreviewMode && (
            <aside className="lg:col-span-4 space-y-6">
              {/* Media & Visibility */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-orange-500" /> Global Media
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

                  <div className="pt-6 space-y-4 border-t border-slate-100">
                    <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Featured</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Home Page Pin</p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Active</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Live on Site</p>
                      </div>
                      <Switch
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Geo Info */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-orange-500" /> Location Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">REGION</Label>
                    <Input
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="e.g. Northern Tanzania"
                      className="h-11 bg-slate-50 border-slate-100 rounded-xl"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">COUNTRY</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Tanzania"
                      className="h-11 bg-slate-50 border-slate-100 rounded-xl"
                    />
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
                      placeholder="Google Search Title..."
                      className="h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">META DESCRIPTION</Label>
                    <Textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder="Google Search Description..."
                      className="min-h-[100px] bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">KEYWORDS</Label>
                    <Input
                      value={formData.seo_keywords}
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                      placeholder="safari, serengeti, travel..."
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
