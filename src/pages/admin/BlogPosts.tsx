import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, 
  Plus, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  Star,
  Calendar,
  User,
  Eye as EyeIcon,
  Globe
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getStorageUrl } from "@/lib/storage";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string;
  author: { name: string };
  views: number;
  featured: boolean;
  published: boolean;
  created_at: string;
  published_at: string;
}

export default function BlogPosts() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get("/api/user");
      setUser(userResponse.data);

      const postsResponse = await axios.get("/api/blog-posts");
      setPosts(postsResponse.data || []);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "Safari Stories",
      tags: "",
      featured: false,
      published: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      featured_image: post.featured_image || "",
      category: post.category || "Safari Stories",
      tags: post.tags || "",
      featured: post.featured || false,
      published: post.published ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        const response = await axios.put(`/api/admin/blog-posts/${editingPost.id}`, formData);
        setPosts(posts.map(p => p.id === editingPost.id ? response.data : p));
      } else {
        const response = await axios.post("/api/admin/blog-posts", formData);
        setPosts([...posts, response.data]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save blog post:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await axios.delete(`/api/admin/blog-posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete blog post:", error);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await axios.post(`/api/admin/blog-posts/${id}/publish`);
      setPosts(posts.map(p => p.id === id ? { ...p, published: true, published_at: new Date().toISOString() } : p));
    } catch (error) {
      console.error("Failed to publish blog post:", error);
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await axios.post(`/api/admin/blog-posts/${id}/unpublish`);
      setPosts(posts.map(p => p.id === id ? { ...p, published: false } : p));
    } catch (error) {
      console.error("Failed to unpublish blog post:", error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Safari Stories": "bg-green-100 text-green-700",
      "Travel Tips": "bg-blue-100 text-blue-700",
      "Wildlife": "bg-orange-100 text-orange-700",
      "Culture": "bg-purple-100 text-purple-700",
      "Adventure": "bg-red-100 text-red-700",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500">Manage blog articles and stories</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => navigate("/admin/blog/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Write Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-xs text-gray-500">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{posts.filter(p => p.published).length}</p>
                <p className="text-xs text-gray-500">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Star className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{posts.filter(p => p.featured).length}</p>
                <p className="text-xs text-gray-500">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <EyeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No blog posts found. Click "Write Article" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center overflow-hidden">
                          {post.featured_image ? (
                            <img src={getStorageUrl(post.featured_image)} alt={post.title} className="h-10 w-10 object-cover" />
                          ) : (
                            <FileText className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium max-w-[200px] truncate">{post.title}</p>
                          {post.featured && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author?.name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{post.views || 0}</TableCell>
                    <TableCell className="text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/blog/${post.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/blog/${post.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {!post.published && (
                            <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                              <Globe className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {post.published && (
                            <DropdownMenuItem onClick={() => handleUnpublish(post.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Unpublish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Article' : 'Write New Article'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the article details below.' : 'Fill in the details to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., The Great Migration Experience"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Safari Stories">Safari Stories</option>
                    <option value="Travel Tips">Travel Tips</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Culture">Culture</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="safari, wildlife, tanzania"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for cards and SEO..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article content here..."
                  rows={8}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                {editingPost ? 'Update' : 'Create'} Article
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
