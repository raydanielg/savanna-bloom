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
import { toast } from "sonner";
import { 
  TreePalm, 
  Plus, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  MapPin,
  Users,
  Save,
  List,
  Grid,
  ArrowLeft,
  Camera,
  Shield,
  DollarSign,
  ListChecks,
  X
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

interface DayTrip {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  duration: string;
  image: string;
  gallery?: string[];
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  location: string;
  min_guests: number;
  max_guests: number;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export default function DayTrips() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [trips, setTrips] = useState<DayTrip[]>([]);
  
  // Dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<DayTrip | null>(null);
  const [viewingTrip, setViewingTrip] = useState<DayTrip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<DayTrip | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    category: "Wildlife",
    price: 0,
    currency: "USD",
    duration: "Full Day",
    image: "",
    location: "",
    min_guests: 1,
    max_guests: 10,
    featured: false,
    active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get("/api/user");
      setUser(userResponse.data);

      const tripsResponse = await axios.get("/api/admin/day-trips");
      setTrips(tripsResponse.data?.data || tripsResponse.data || []);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setFormData({
      name: "",
      short_description: "",
      description: "",
      category: "Wildlife",
      price: 0,
      currency: "USD",
      duration: "Full Day",
      image: "",
      location: "",
      min_guests: 1,
      max_guests: 10,
      featured: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (trip: DayTrip) => {
    setEditingTrip(trip);
    setFormData({
      name: trip.name,
      short_description: trip.short_description || "",
      description: trip.description || "",
      category: trip.category || "Wildlife",
      price: trip.price || 0,
      currency: trip.currency || "USD",
      duration: trip.duration || "Full Day",
      image: trip.image || "",
      location: trip.location || "",
      min_guests: trip.min_guests || 1,
      max_guests: trip.max_guests || 10,
      featured: trip.featured || false,
      active: trip.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTrip) {
        const response = await axios.put(`/api/admin/day-trips/${editingTrip.id}`, formData);
        setTrips(trips.map(t => t.id === editingTrip.id ? response.data : t));
      } else {
        const response = await axios.post("/api/admin/day-trips", formData);
        setTrips([...trips, response.data]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save day trip:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleView = (trip: DayTrip) => {
    setViewingTrip(trip);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (trip: DayTrip) => {
    setDeletingTrip(trip);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTrip) return;
    try {
      await axios.delete(`/api/admin/day-trips/${deletingTrip.id}`);
      setTrips(trips.filter(t => t.id !== deletingTrip.id));
      setIsDeleteDialogOpen(false);
      setDeletingTrip(null);
    } catch (error) {
      console.error("Failed to delete day trip:", error);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || trip.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleFeature = async (id: number) => {
    try {
      const response = await axios.post(`/api/admin/day-trips/${id}/feature`);
      const newFeatured = response.data.featured;
      setTrips(trips.map(t => t.id === id ? { ...t, featured: newFeatured } : t));
      toast.success(newFeatured ? "Day trip marked as featured" : "Day trip removed from featured");
    } catch (error) {
      console.error("Failed to toggle feature:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await axios.put(`/api/admin/day-trips/${id}`, { active: !currentActive });
      setTrips(trips.map(t => t.id === id ? { ...t, active: !currentActive } : t));
      toast.success(!currentActive ? "Day trip activated" : "Day trip deactivated");
    } catch (error) {
      console.error("Failed to toggle active status:", error);
      toast.error("Failed to update status");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Wildlife: "bg-green-100 text-green-700",
      Cultural: "bg-purple-100 text-purple-700",
      Adventure: "bg-orange-100 text-orange-700",
      Beach: "bg-blue-100 text-blue-700",
      "Water Sports": "bg-cyan-100 text-cyan-700",
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
          <h1 className="text-2xl font-bold text-gray-900">Day Trips</h1>
          <p className="text-gray-500">Manage day trip experiences and excursions</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Day Trip
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <TreePalm className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trips.length}</p>
                <p className="text-xs text-gray-500">Total Day Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <TreePalm className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trips.filter(t => t.active).length}</p>
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
                <p className="text-2xl font-bold">{trips.filter(t => t.featured).length}</p>
                <p className="text-xs text-gray-500">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{[...new Set(trips.map(t => t.location))].filter(Boolean).length}</p>
                <p className="text-xs text-gray-500">Locations</p>
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
                  placeholder="Search day trips..."
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
                  <SelectItem value="Wildlife">Wildlife</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Beach">Beach</SelectItem>
                  <SelectItem value="Water Sports">Water Sports</SelectItem>
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
                  <TableHead>Trip Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No day trips found. Click "Add Day Trip" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip) => (
                    <TableRow key={trip.id} className={`hover:bg-gray-50 ${!trip.active ? 'bg-gray-50 opacity-75' : ''}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {trip.image ? (
                              <img src={trip.image} alt={trip.name} className="h-12 w-12 object-cover" />
                            ) : (
                              <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-teal-100 to-orange-100">
                                <TreePalm className="h-6 w-6 text-teal-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 truncate">{trip.name}</p>
                              {trip.featured && (
                                <Badge className="bg-orange-100 text-orange-700 text-xs shrink-0">
                                  <Star className="h-3 w-3 mr-1 fill-orange-500" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            {trip.short_description && (
                              <p className="text-xs text-gray-500 truncate max-w-xs">{trip.short_description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(trip.category)}>
                          {trip.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {trip.location || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {trip.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">${trip.price?.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={trip.active}
                            onCheckedChange={() => handleToggleActive(trip.id, trip.active)}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                          />
                          <Badge 
                            variant="outline" 
                            className={trip.active 
                              ? "border-green-200 text-green-700 bg-green-50" 
                              : "border-gray-200 text-gray-500 bg-gray-50"
                            }
                          >
                            {trip.active ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem onClick={() => handleView(trip)} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2 text-blue-500" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(trip)} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2 text-green-500" />
                              Edit Trip
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleFeature(trip.id)} className="cursor-pointer">
                              <Star className={`h-4 w-4 mr-2 ${trip.featured ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
                              {trip.featured ? 'Remove Featured' : 'Mark as Featured'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" 
                              onClick={() => handleDeleteClick(trip)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Trip
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
              {filteredTrips.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No day trips found. Click "Add Day Trip" to create one.
                </div>
              ) : (
                filteredTrips.map((trip) => (
                  <Card 
                    key={trip.id} 
                    className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer border ${!trip.active ? 'opacity-60 grayscale-[30%]' : 'hover:border-teal-200'}`} 
                    onClick={() => handleView(trip)}
                  >
                    <div className="h-44 bg-gray-100 relative">
                      {trip.image ? (
                        <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 via-orange-50 to-purple-100">
                          <TreePalm className="h-16 w-16 text-teal-400" />
                        </div>
                      )}
                      {trip.featured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-orange-500 text-white shadow-md">
                            <Star className="h-3 w-3 mr-1 fill-white" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <Badge className={`${getCategoryColor(trip.category)} shadow-sm`}>
                          {trip.category}
                        </Badge>
                      </div>
                      {!trip.active && (
                        <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                          <Badge className="bg-gray-800 text-white">Inactive</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{trip.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{trip.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {trip.duration}
                        </div>
                        <div className="font-bold text-teal-600 text-lg">
                          ${trip.price?.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge 
                          variant="outline" 
                          className={trip.active 
                            ? "border-green-200 text-green-700 bg-green-50" 
                            : "border-gray-200 text-gray-500 bg-gray-50"
                          }
                        >
                          {trip.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(trip);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTrip ? 'Edit Day Trip' : 'Add New Day Trip'}</DialogTitle>
            <DialogDescription>
              {editingTrip ? 'Update the day trip details below.' : 'Fill in the details to create a new day trip.'}
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
                    placeholder="e.g., Zanzibar Snorkeling Adventure"
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
                    <option value="Wildlife">Wildlife</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Beach">Beach</option>
                    <option value="Water Sports">Water Sports</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., Full Day"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Zanzibar"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                {saving ? 'Saving...' : (editingTrip ? 'Update' : 'Create')} Day Trip
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl">{viewingTrip?.name}</DialogTitle>
                <DialogDescription className="mt-1">{viewingTrip?.short_description}</DialogDescription>
              </div>
              {viewingTrip?.featured && (
                <Badge className="bg-orange-500 text-white shrink-0">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Featured
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          {viewingTrip && (
            <div className="space-y-4">
              {viewingTrip.image && (
                <div className="w-full h-56 rounded-lg overflow-hidden bg-gray-100">
                  <img src={viewingTrip.image} alt={viewingTrip.name} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center border border-green-200">
                  <p className="text-xl font-bold text-green-600">${viewingTrip.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">per person</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center border border-blue-200">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-700">{viewingTrip.duration}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Duration</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center border border-purple-200">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-700">{viewingTrip.min_guests}-{viewingTrip.max_guests}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Guests</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center border border-orange-200">
                  <Badge className={getCategoryColor(viewingTrip.category)}>{viewingTrip.category}</Badge>
                  <p className="text-xs text-gray-500 mt-1">Category</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <MapPin className="h-3 w-3 mr-1" />
                  {viewingTrip.location}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={viewingTrip.active 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-gray-50 text-gray-600 border-gray-200"
                  }
                >
                  {viewingTrip.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {viewingTrip.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{viewingTrip.description}</p>
                </div>
              )}

              {viewingTrip.highlights && viewingTrip.highlights.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingTrip.highlights.map((h: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-700">
                        <Star className="h-3 w-3 mr-1" />
                        {h}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingTrip.included && viewingTrip.included.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Included</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingTrip.included.map((item: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-green-50 text-green-700">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingTrip.excluded && viewingTrip.excluded.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Excluded</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingTrip.excluded.map((item: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-red-50 text-red-700">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button 
              variant="outline"
              onClick={() => handleFeature(viewingTrip!.id)}
            >
              <Star className={`h-4 w-4 mr-2 ${viewingTrip?.featured ? 'text-orange-500 fill-orange-500' : ''}`} />
              {viewingTrip?.featured ? 'Unfeature' : 'Feature'}
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => {
              setIsViewDialogOpen(false);
              handleOpenEdit(viewingTrip!);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Day Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingTrip?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Delete Day Trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
