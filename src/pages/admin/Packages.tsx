import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Package, 
  Plus, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  Save,
  X,
  List,
  Grid,
  Mountain
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Destination {
  id: number;
  name: string;
}

interface PackageItem {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  short_description: string;
  image: string;
  category: string;
  destination?: { name: string };
  duration_days: number;
  duration_nights: number;
  price: number;
  discount_price: number | null;
  difficulty: string;
  min_guests: number;
  max_guests: number;
  featured: boolean;
  active: boolean;
}

export default function Packages() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [viewingPackage, setViewingPackage] = useState<PackageItem | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<PackageItem | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    short_description: "",
    description: "",
    image: "",
    category: "Wildlife Safari",
    destination_id: "",
    duration_days: 5,
    duration_nights: 4,
    price: 0,
    discount_price: "",
    difficulty: "Moderate",
    min_guests: 1,
    max_guests: 10,
    accommodation_type: "",
    highlights: [] as string[],
    includes: [] as string[],
    excludes: [] as string[],
    featured: false,
    active: true,
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get("/api/user");
      setUser(userResponse.data);

      const packagesResponse = await axios.get("/api/admin/packages");
      setPackages(packagesResponse.data?.data || packagesResponse.data || []);

      const destinationsResponse = await axios.get("/api/destinations");
      setDestinations(destinationsResponse.data || []);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setFormData({
      name: "",
      subtitle: "",
      short_description: "",
      description: "",
      image: "",
      category: "Wildlife Safari",
      destination_id: "",
      duration_days: 5,
      duration_nights: 4,
      price: 0,
      discount_price: "",
      difficulty: "Moderate",
      min_guests: 1,
      max_guests: 10,
      accommodation_type: "",
      highlights: [],
      includes: [],
      excludes: [],
      featured: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      subtitle: pkg.subtitle || "",
      short_description: pkg.short_description || "",
      description: "",
      image: pkg.image || "",
      category: pkg.category || "Wildlife Safari",
      destination_id: "",
      duration_days: pkg.duration_days || 5,
      duration_nights: pkg.duration_nights || 4,
      price: pkg.price || 0,
      discount_price: pkg.discount_price?.toString() || "",
      difficulty: pkg.difficulty || "Moderate",
      min_guests: pkg.min_guests || 1,
      max_guests: pkg.max_guests || 10,
      accommodation_type: "",
      highlights: [],
      includes: [],
      excludes: [],
      featured: pkg.featured || false,
      active: pkg.active ?? true,
    });
    setIsDialogOpen(true);
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

      if (editingPackage) {
        const response = await axios.put(`/api/admin/packages/${editingPackage.id}`, submitData);
        setPackages(packages.map(p => p.id === editingPackage.id ? response.data : p));
      } else {
        const response = await axios.post("/api/admin/packages", submitData);
        setPackages([...packages, response.data]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save package:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleView = (pkg: PackageItem) => {
    setViewingPackage(pkg);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (pkg: PackageItem) => {
    setDeletingPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPackage) return;
    try {
      await axios.delete(`/api/admin/packages/${deletingPackage.id}`);
      setPackages(packages.filter(p => p.id !== deletingPackage.id));
      setIsDeleteDialogOpen(false);
      setDeletingPackage(null);
    } catch (error) {
      console.error("Failed to delete package:", error);
    }
  };

  const handleFeature = async (id: number) => {
    try {
      const response = await axios.post(`/api/admin/packages/${id}/feature`);
      const newFeatured = response.data.featured;
      setPackages(packages.map(p => p.id === id ? { ...p, featured: newFeatured } : p));
      toast.success(newFeatured ? "Package marked as featured" : "Package removed from featured");
    } catch (error) {
      console.error("Failed to toggle feature:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await axios.put(`/api/admin/packages/${id}`, { active: !currentActive });
      setPackages(packages.map(p => p.id === id ? { ...p, active: !currentActive } : p));
      toast.success(!currentActive ? "Package activated" : "Package deactivated");
    } catch (error) {
      console.error("Failed to toggle active status:", error);
      toast.error("Failed to update status");
    }
  };

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

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.destination?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || pkg.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Wildlife Safari": "bg-green-100 text-green-700",
      "Mountain Climbing": "bg-purple-100 text-purple-700",
      "Beach Holiday": "bg-blue-100 text-blue-700",
      "Multi-Park Safari": "bg-orange-100 text-orange-700",
      "Wilderness Safari": "bg-teal-100 text-teal-700",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="text-gray-500">Manage safari packages and tour offerings</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{packages.length}</p>
                <p className="text-xs text-gray-500">Total Packages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{packages.filter(p => p.active).length}</p>
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
                <p className="text-2xl font-bold">{packages.filter(p => p.featured).length}</p>
                <p className="text-xs text-gray-500">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toLocaleString() : 0}</p>
                <p className="text-xs text-gray-500">Avg Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Wildlife Safari">Wildlife Safari</SelectItem>
                  <SelectItem value="Mountain Climbing">Mountain Climbing</SelectItem>
                  <SelectItem value="Beach Holiday">Beach Holiday</SelectItem>
                  <SelectItem value="Multi-Park Safari">Multi-Park Safari</SelectItem>
                  <SelectItem value="Wilderness Safari">Wilderness Safari</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No packages found. Click "Add Package" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id} className={`hover:bg-gray-50 ${!pkg.active ? 'bg-gray-50 opacity-75' : ''}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {pkg.image ? (
                              <img src={pkg.image} alt={pkg.name} className="h-12 w-12 object-cover" />
                            ) : (
                              <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-purple-100 to-orange-100">
                                <Mountain className="h-6 w-6 text-purple-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 truncate max-w-[200px]">{pkg.name}</p>
                              {pkg.featured && (
                                <Badge className="bg-orange-100 text-orange-700 text-xs shrink-0">
                                  <Star className="h-3 w-3 mr-1 fill-orange-500" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{pkg.destination?.name || 'No destination'}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(pkg.category)}>
                          {pkg.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {pkg.duration_days}D / {pkg.duration_nights}N
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {pkg.discount_price ? (
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-green-600">${pkg.discount_price.toLocaleString()}</span>
                              <span className="text-xs text-gray-400 line-through">${pkg.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="font-semibold text-green-600">${pkg.price.toLocaleString()}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(pkg.difficulty)}>
                          {pkg.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={pkg.active}
                            onCheckedChange={() => handleToggleActive(pkg.id, pkg.active)}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                          />
                          <Badge 
                            variant="outline" 
                            className={pkg.active 
                              ? "border-green-200 text-green-700 bg-green-50" 
                              : "border-gray-200 text-gray-500 bg-gray-50"
                            }
                          >
                            {pkg.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleView(pkg)} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2 text-blue-500" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(pkg)} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2 text-green-500" />
                              Edit Package
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleFeature(pkg.id)} className="cursor-pointer">
                              <Star className={`h-4 w-4 mr-2 ${pkg.featured ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
                              {pkg.featured ? 'Remove Featured' : 'Mark as Featured'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" 
                              onClick={() => handleDeleteClick(pkg)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Package
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPackages.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No packages found. Click "Add Package" to create one.
                </div>
              ) : (
                filteredPackages.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleView(pkg)}>
                    <div className="h-40 bg-gray-100 relative">
                      {pkg.image ? (
                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-orange-100">
                          <Package className="h-12 w-12 text-purple-400" />
                        </div>
                      )}
                      {pkg.featured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-orange-500 text-white">
                            <Star className="h-3 w-3 mr-1 fill-white" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <Badge className={getCategoryColor(pkg.category)}>
                          {pkg.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{pkg.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{pkg.subtitle || pkg.destination?.name}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {pkg.duration_days}D / {pkg.duration_nights}N
                        </div>
                        <div className="text-right">
                          {pkg.discount_price ? (
                            <>
                              <span className="font-bold text-green-600">${pkg.discount_price.toLocaleString()}</span>
                              <span className="text-xs text-gray-400 line-through ml-1">${pkg.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="font-bold text-gray-900">${pkg.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <Badge className={getDifficultyColor(pkg.difficulty)}>
                          {pkg.difficulty}
                        </Badge>
                        <Badge variant={pkg.active ? "default" : "secondary"} className={pkg.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                          {pkg.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription>
              {editingPackage ? 'Update the package details below.' : 'Fill in the details to create a new package.'}
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
                    placeholder="e.g., Serengeti Great Migration Safari"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g., Witness the Greatest Wildlife Show"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wildlife Safari">Wildlife Safari</SelectItem>
                      <SelectItem value="Mountain Climbing">Mountain Climbing</SelectItem>
                      <SelectItem value="Beach Holiday">Beach Holiday</SelectItem>
                      <SelectItem value="Multi-Park Safari">Multi-Park Safari</SelectItem>
                      <SelectItem value="Wilderness Safari">Wilderness Safari</SelectItem>
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
                      {destinations.map(d => (
                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_days">Days</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    min="1"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_nights">Nights</Label>
                  <Input
                    id="duration_nights"
                    type="number"
                    min="0"
                    value={formData.duration_nights}
                    onChange={(e) => setFormData({ ...formData, duration_nights: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_guests">Min Guests</Label>
                  <Input
                    id="min_guests"
                    type="number"
                    min="1"
                    value={formData.min_guests}
                    onChange={(e) => setFormData({ ...formData, min_guests: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_guests">Max Guests</Label>
                  <Input
                    id="max_guests"
                    type="number"
                    min="1"
                    value={formData.max_guests}
                    onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_price">Discount Price ($)</Label>
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
                  <Label htmlFor="difficulty">Difficulty</Label>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
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
                <Label>Highlights</Label>
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="Add highlight..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  />
                  <Button type="button" variant="outline" onClick={addHighlight}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.highlights.map((h, i) => (
                    <Badge key={i} className="bg-purple-100 text-purple-700">{h}</Badge>
                  ))}
                </div>
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
                {saving ? 'Saving...' : (editingPackage ? 'Update' : 'Create')} Package
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{viewingPackage?.name}</DialogTitle>
            <DialogDescription>{viewingPackage?.subtitle}</DialogDescription>
          </DialogHeader>
          
          {viewingPackage && (
            <div className="space-y-4">
              {viewingPackage.image && (
                <img src={viewingPackage.image} alt={viewingPackage.name} className="w-full h-48 object-cover rounded-lg" />
              )}
              
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-orange-600">${viewingPackage.discount_price ? viewingPackage.discount_price.toLocaleString() : viewingPackage.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-semibold">{viewingPackage.duration_days}D / {viewingPackage.duration_nights}N</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-semibold">{viewingPackage.min_guests}-{viewingPackage.max_guests}</p>
                  <p className="text-xs text-gray-500">Guests</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Badge className={getDifficultyColor(viewingPackage.difficulty)}>{viewingPackage.difficulty}</Badge>
                </div>
              </div>

              <div>
                <p className="text-gray-600">{viewingPackage.short_description}</p>
              </div>

              <div className="flex gap-2">
                <Badge className={viewingPackage.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                  {viewingPackage.active ? 'Active' : 'Inactive'}
                </Badge>
                {viewingPackage.featured && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" /> Featured
                  </Badge>
                )}
                <Badge className={getCategoryColor(viewingPackage.category)}>{viewingPackage.category}</Badge>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => {
              setIsViewDialogOpen(false);
              handleOpenEdit(viewingPackage!);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingPackage?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Delete Package
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
