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
  FileText,
  Image as ImageIcon,
  Tag,
  BookOpen
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function BlogPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
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
        title: data.title || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        featured_image: data.featured_image || "",
        category: data.category || "Safari Stories",
        tags: data.tags || "",
        featured: data.featured || false,
        published: data.published ?? false,
      });
    } catch (error) {
      console.error("Failed to fetch post:", error);
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
      console.error("Failed to save post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to save blog post",
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/admin/blog")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {id === "create" ? "Write New Article" : "Edit Article"}
            </h1>
            <p className="text-slate-500">Share stories and tips with your audience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 rounded-t-2xl">
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    Story Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700 font-semibold">Article Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Hidden Gems of the Serengeti"
                      className="h-12 text-xl font-bold bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-slate-700 font-semibold">Short Summary (Excerpt)</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="A catchy intro to hook your readers..."
                      rows={3}
                      className="bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-700 font-semibold">Main Body Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Tell your story here..."
                      rows={15}
                      className="bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 min-h-[400px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Settings Area */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 rounded-t-2xl">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Publishing Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-700 font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4 text-orange-500" /> Category
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    >
                      <option value="Safari Stories">Safari Stories</option>
                      <option value="Travel Tips">Travel Tips</option>
                      <option value="Wildlife">Wildlife</option>
                      <option value="Culture">Culture</option>
                      <option value="Adventure">Adventure</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-slate-700 font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4 text-orange-500" /> Tags
                    </Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="safari, wildlife, tanzania"
                      className="bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-orange-500" /> Featured Image
                    </Label>
                    <ImageUpload
                      value={formData.featured_image}
                      onChange={(url) => setFormData({ ...formData, featured_image: url })}
                      className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-orange-500/50 transition-all"
                    />
                  </div>

                  <hr className="border-slate-100" />

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="featured" className="text-sm font-bold text-slate-800">Featured Post</Label>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Pin to top of blog</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="published" className="text-sm font-bold text-slate-800">Published Status</Label>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Visible to public</p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 gap-2 w-full text-lg"
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                  {id === "create" ? "Publish Story" : "Update Story"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/blog")}
                  className="h-12 border-slate-200 text-slate-500 font-semibold rounded-2xl hover:bg-slate-50 w-full"
                >
                  Discard Changes
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
