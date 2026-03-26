import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Trash2, 
  Tag, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SafariCategories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/safari-categories");
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load safari categories",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category already exists",
      });
      return;
    }
    
    setSaving(true);
    try {
      const response = await axios.post("/api/admin/safari-categories", {
        name: newCategory.trim()
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
      toast({
        title: "Success",
        description: "Category saved successfully",
      });
    } catch (error) {
      console.error("Failed to save category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category to database",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`/api/admin/safari-categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast({ title: "Removed", description: "Category deleted successfully" });
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      });
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Safari Categories</h1>
            <p className="text-slate-500">Manage grouping for your safari packages</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchCategories} 
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Add Category */}
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-500" />
                Add New Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name (e.g., Luxury Safari, Budget, Family)"
                  className="h-12 bg-white border-slate-200 rounded-xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button 
                  onClick={handleAddCategory}
                  disabled={saving || !newCategory.trim()}
                  className="h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5 text-orange-500" />
                  Existing Categories
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-white border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Tag className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    {searchQuery ? "No categories match your search" : "No categories found"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
