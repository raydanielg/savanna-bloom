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
  FileText,
  Clock,
  User,
  Sparkles
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { getStorageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function BlogPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category: "Safari Stories",
    tags: "",
    featured: false,
    published: false,
  });

  useEffect(() => {
    if (id && id !== "create") {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blog-posts/${id}`);
      const data = response.data.data || response.data;
      setFormData({
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || "")
      });
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load blog post details",
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
        await axios.put(`/api/admin/blog-posts/${id}`, formData);
        toast({ title: "Success", description: "Article updated successfully" });
      } else {
        await axios.post("/api/admin/blog-posts", formData);
        toast({ title: "Success", description: "Article created successfully" });
      }
      navigate("/admin/blog");
    } catch (error: any) {
      console.error("Failed to save blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to save article",
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

  const tagsList = formData.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "");

  return (
    <AdminLayout user={user}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/blog")}
              className="rounded-full h-10 w-10 border-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900">
                {id === "create" ? "Write Story" : "Edit Story"}
              </h1>
              <p className="text-slate-500 text-sm">Share your Tanzanian adventures with the world</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={cn(
                "rounded-xl h-11 px-6 font-bold transition-all",
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
              Publish Story
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editor/Preview Area */}
          <div className={cn("lg:col-span-8 space-y-8", isPreviewMode && "lg:col-span-12 max-w-4xl mx-auto")}>
            {!isPreviewMode ? (
              <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Headline</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Add an impressive title to your story..."
                      className="text-3xl md:text-4xl font-serif font-bold border-0 border-b border-slate-100 rounded-none h-auto py-4 px-0 focus-visible:ring-0 focus-visible:border-orange-500 placeholder:text-slate-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Story Content</Label>
                    <RichTextEditor 
                      value={formData.content} 
                      onChange={(val) => setFormData({ ...formData, content: val })}
                      className="min-h-[500px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Premium Live Preview (Matches BlogDetail.tsx) */
              <div className="space-y-12 animate-in fade-in duration-500">
                <section className="relative h-[50vh] min-h-[400px] flex items-end rounded-[3rem] overflow-hidden shadow-2xl">
                  <div className="absolute inset-0">
                    <img 
                      src={formData.featured_image ? getStorageUrl(formData.featured_image) : 'https://images.unsplash.com/photo-1516426123300-d2e6f4a6e6d1?w=1600'} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                  </div>
                  <div className="relative p-12 w-full">
                    <Badge className="bg-orange-600 text-white border-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                      {formData.category}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-[1.1]">
                      {formData.title || "Untitled Story"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">G</div>
                        <span className="font-semibold">Go Deep Team</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        {Math.ceil((formData.content?.split(' ').length || 0) / 200)} min read
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
                  <div className="lg:col-span-8 prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600 prose-img:rounded-3xl">
                    <div dangerouslySetInnerHTML={{ __html: formData.content || "<p className='text-slate-300 italic'>Story content will appear here...</p>" }} />
                    
                    <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                      {tagsList.map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">
                          <Tag className="w-3 h-3 text-orange-500" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                      <h4 className="font-serif text-xl mb-4">About Go Deep Africa</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">Authentic safari stories from the heart of the savanna. Follow our expert guides through Tanzania's wilderness.</p>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl">Follow Us</Button>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          {!isPreviewMode && (
            <aside className="lg:col-span-4 space-y-6">
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-5">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-orange-500" /> Cover Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-slate-500">FEATURED IMAGE</Label>
                    <ImageUpload
                      value={formData.featured_image}
                      onChange={(url) => setFormData({ ...formData, featured_image: url })}
                    />
                    {formData.featured_image && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 shadow-inner group relative">
                        <img 
                          src={getStorageUrl(formData.featured_image)} 
                          className="w-full h-40 object-cover transition-transform group-hover:scale-105 duration-500" 
                          alt="Preview" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold uppercase tracking-widest">Live Preview Enabled</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-5">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-orange-500" /> Publishing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-slate-500">CATEGORY</Label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="Safari Stories">Safari Stories</option>
                      <option value="Travel Tips">Travel Tips</option>
                      <option value="Wildlife">Wildlife</option>
                      <option value="Culture">Culture</option>
                      <option value="Adventure">Adventure</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-slate-500">TAGS</Label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="safari, trek, wild..."
                        className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Featured</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Pin to highlights</p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-sm font-bold text-slate-900">Published</Label>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Visible to public</p>
                      </div>
                      <Switch
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-orange-50/50 border-orange-100/50">
                <CardContent className="p-6 space-y-4 text-center">
                  <Sparkles className="h-8 w-8 text-orange-500 mx-auto" />
                  <h4 className="font-serif font-bold text-slate-900">SEO Excerpt</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Write a short, engaging summary for social media and search engines.</p>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="In the heart of the Serengeti..."
                    className="min-h-[100px] bg-white border-orange-100 rounded-2xl text-sm placeholder:text-slate-200"
                  />
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
