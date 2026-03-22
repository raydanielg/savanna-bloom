import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { getStorageUrl } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Mountain, 
  Plus, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  Star,
  Clock,
  TrendingUp,
  Save
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ImageUpload from "@/components/ui/ImageUpload";

interface KilimanjaroRoute {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  days: number;
  difficulty: string;
  price: number;
  currency: string;
  image: string;
  success_rate: number;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export default function KilimanjaroRoutes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [routes, setRoutes] = useState<KilimanjaroRoute[]>([]);
  
  // Dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<KilimanjaroRoute | null>(null);
  const [viewingRoute, setViewingRoute] = useState<KilimanjaroRoute | null>(null);
  const [deletingRoute, setDeletingRoute] = useState<KilimanjaroRoute | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    days: 5,
    difficulty: "Moderate",
    price: 0,
    currency: "USD",
    image: "",
    success_rate: 90,
    featured: false,
    active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const routesResponse = await axios.get("/api/kilimanjaro-routes");
        if (isMounted) {
          setRoutes(routesResponse.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleOpenCreate = () => {
    setEditingRoute(null);
    setFormData({
      name: "",
      short_description: "",
      description: "",
      days: 5,
      difficulty: "Moderate",
      price: 0,
      currency: "USD",
      image: "",
      success_rate: 90,
      featured: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (route: KilimanjaroRoute) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      short_description: route.short_description || "",
      description: route.description || "",
      days: route.days || 5,
      difficulty: route.difficulty || "Moderate",
      price: route.price || 0,
      currency: route.currency || "USD",
      image: route.image || "",
      success_rate: route.success_rate || 90,
      featured: route.featured || false,
      active: route.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingRoute) {
        const response = await axios.put(`/api/admin/kilimanjaro-routes/${editingRoute.id}`, formData);
        setRoutes(routes.map(r => r.id === editingRoute.id ? response.data : r));
      } else {
        const response = await axios.post("/api/admin/kilimanjaro-routes", formData);
        setRoutes([...routes, response.data]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save route:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleView = (route: KilimanjaroRoute) => {
    setViewingRoute(route);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (route: KilimanjaroRoute) => {
    setDeletingRoute(route);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoute) return;
    try {
      await axios.delete(`/api/admin/kilimanjaro-routes/${deletingRoute.id}`);
      setRoutes(routes.filter(r => r.id !== deletingRoute.id));
      setIsDeleteDialogOpen(false);
      setDeletingRoute(null);
    } catch (error) {
      console.error("Failed to delete route:", error);
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-green-100 text-green-700",
      Moderate: "bg-yellow-100 text-yellow-700",
      Challenging: "bg-orange-100 text-orange-700",
      Difficult: "bg-red-100 text-red-700",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-600";
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
          <h1 className="text-2xl font-bold text-gray-900">Kilimanjaro Routes</h1>
          <p className="text-gray-500">Manage mountain climbing routes and packages</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mountain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{routes.length}</p>
                <p className="text-xs text-gray-500">Total Routes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Mountain className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{routes.filter(r => r.active).length}</p>
                <p className="text-xs text-gray-500">Active</p>
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
                <p className="text-2xl font-bold">{routes.filter(r => r.featured).length}</p>
                <p className="text-xs text-gray-500">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{routes.length > 0 ? Math.round(routes.reduce((sum, r) => sum + (r.success_rate || 0), 0) / routes.length) : 0}%</p>
                <p className="text-xs text-gray-500">Avg Success Rate</p>
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
                placeholder="Search routes..."
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
                <TableHead>Route Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No routes found. Click "Add Route" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoutes.map((route) => (
                  <TableRow key={route.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
                          {route.image ? (
                            <img src={getStorageUrl(route.image)} alt={route.name} className="h-10 w-10 object-cover" />
                          ) : (
                            <Mountain className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{route.name}</p>
                          {route.featured && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {route.days} Days
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(route.difficulty)}>
                        {route.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${route.price?.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        {route.success_rate}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={route.active ? "default" : "secondary"} className={route.active ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                        {route.active ? 'Active' : 'Inactive'}
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
                          <DropdownMenuItem onClick={() => navigate(`/admin/kilimanjaro-routes/${route.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEdit(route)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(route)}>
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
            <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
            <DialogDescription>
              {editingRoute ? 'Update the route details below.' : 'Fill in the details to create a new climbing route.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Machame Route"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days">Duration (Days)</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Difficult">Difficult</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success_rate">Success Rate (%)</Label>
                  <Input
                    id="success_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.success_rate}
                    onChange={(e) => setFormData({ ...formData, success_rate: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief description for cards..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description..."
                  rows={4}
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
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : (editingRoute ? 'Update' : 'Create')} Route
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{viewingRoute?.name}</DialogTitle>
            <DialogDescription>{viewingRoute?.short_description}</DialogDescription>
          </DialogHeader>
          
          {viewingRoute && (
            <div className="space-y-4">
              {viewingRoute.image && (
                <img src={getStorageUrl(viewingRoute.image)} alt={viewingRoute.name} className="w-full h-48 object-cover rounded-lg" />
              )}
              
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-orange-600">${viewingRoute.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-semibold">{viewingRoute.days} Days</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-semibold">{viewingRoute.success_rate}%</p>
                  <p className="text-xs text-gray-500">Success Rate</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Badge className={getDifficultyColor(viewingRoute.difficulty)}>{viewingRoute.difficulty}</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge className={viewingRoute.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                  {viewingRoute.active ? 'Active' : 'Inactive'}
                </Badge>
                {viewingRoute.featured && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" /> Featured
                  </Badge>
                )}
              </div>
              
              {viewingRoute.description && (
                <p className="text-gray-600 text-sm">{viewingRoute.description}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => {
              setIsViewDialogOpen(false);
              handleOpenEdit(viewingRoute!);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Route</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingRoute?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Delete Route
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
