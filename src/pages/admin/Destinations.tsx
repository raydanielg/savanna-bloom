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
  Globe, 
  Plus, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  MapPin,
  Star,
  Image,
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

interface Destination {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  short_description: string;
  description: string;
  image: string;
  region: string;
  country: string;
  featured: boolean;
  active: boolean;
  tours_count: number;
  created_at: string;
}

export default function Destinations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  
  // Dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [viewingDestination, setViewingDestination] = useState<Destination | null>(null);
  const [deletingDestination, setDeletingDestination] = useState<Destination | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    short_description: "",
    description: "",
    image: "",
    region: "",
    country: "",
    featured: false,
    active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const destinationsResponse = await axios.get("/api/destinations");
        if (isMounted) {
          setDestinations(destinationsResponse.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
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
    setEditingDestination(null);
    setFormData({
      name: "",
      subtitle: "",
      short_description: "",
      description: "",
      image: "",
      region: "",
      country: "",
      featured: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      subtitle: destination.subtitle || "",
      short_description: destination.short_description || "",
      description: destination.description || "",
      image: destination.image || "",
      region: destination.region || "",
      country: destination.country || "",
      featured: destination.featured || false,
      active: destination.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingDestination) {
        const response = await axios.put(`/api/admin/destinations/${editingDestination.id}`, formData);
        setDestinations(destinations.map(d => d.id === editingDestination.id ? response.data : d));
      } else {
        const response = await axios.post("/api/admin/destinations", formData);
        setDestinations([...destinations, response.data]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save destination:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleView = (destination: Destination) => {
    setViewingDestination(destination);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (destination: Destination) => {
    setDeletingDestination(destination);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDestination) return;
    try {
      await axios.delete(`/api/admin/destinations/${deletingDestination.id}`);
      setDestinations(destinations.filter(d => d.id !== deletingDestination.id));
      setIsDeleteDialogOpen(false);
      setDeletingDestination(null);
    } catch (error) {
      console.error("Failed to delete destination:", error);
    }
  };

  const filteredDestinations = destinations.filter(destination =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-500">Manage safari destinations and locations</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Destination
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{destinations.length}</p>
                <p className="text-xs text-gray-500">Total Destinations</p>
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
                <p className="text-2xl font-bold">{destinations.filter(d => d.active).length}</p>
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
                <p className="text-2xl font-bold">{destinations.filter(d => d.featured).length}</p>
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
                <p className="text-2xl font-bold">{[...new Set(destinations.map(d => d.region))].filter(Boolean).length}</p>
                <p className="text-xs text-gray-500">Regions</p>
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
                placeholder="Search destinations..."
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
                <TableHead>Destination</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Tours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDestinations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No destinations found. Click "Add Destination" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDestinations.map((destination) => (
                  <TableRow key={destination.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
                          {destination.image ? (
                            <img src={getStorageUrl(destination.image)} alt={destination.name} className="h-10 w-10 object-cover" />
                          ) : (
                            <Globe className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{destination.name}</p>
                          {destination.featured && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{destination.region || 'N/A'}</TableCell>
                    <TableCell className="text-gray-500">{destination.country || 'N/A'}</TableCell>
                    <TableCell className="text-gray-700">{destination.tours_count || 0}</TableCell>
                    <TableCell>
                      <Badge variant={destination.active ? "default" : "secondary"} className={destination.active ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                        {destination.active ? 'Active' : 'Inactive'}
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
                          <DropdownMenuItem onClick={() => navigate(`/admin/destinations/${destination.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEdit(destination)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(destination)}>
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
            <DialogTitle>{editingDestination ? 'Edit Destination' : 'Add New Destination'}</DialogTitle>
            <DialogDescription>
              {editingDestination ? 'Update the destination details below.' : 'Fill in the details to create a new destination.'}
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
                    placeholder="e.g., Serengeti National Park"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g., Home of the Great Migration"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g., Northern Tanzania"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g., Tanzania"
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
                  placeholder="Brief description for cards and listings..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description for the destination page..."
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
                {saving ? 'Saving...' : (editingDestination ? 'Update' : 'Create')} Destination
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{viewingDestination?.name}</DialogTitle>
            <DialogDescription>{viewingDestination?.subtitle}</DialogDescription>
          </DialogHeader>
          
          {viewingDestination && (
            <div className="space-y-4">
              {viewingDestination.image && (
                <img src={getStorageUrl(viewingDestination.image)} alt={viewingDestination.name} className="w-full h-48 object-cover rounded-lg" />
              )}
              
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-700">{viewingDestination.region}</Badge>
                <Badge className="bg-gray-100 text-gray-700">{viewingDestination.country}</Badge>
                <Badge className={viewingDestination.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                  {viewingDestination.active ? 'Active' : 'Inactive'}
                </Badge>
                {viewingDestination.featured && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" /> Featured
                  </Badge>
                )}
              </div>
              
              {viewingDestination.short_description && (
                <p className="text-gray-600">{viewingDestination.short_description}</p>
              )}
              
              {viewingDestination.description && (
                <p className="text-gray-600 text-sm">{viewingDestination.description}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => {
              setIsViewDialogOpen(false);
              handleOpenEdit(viewingDestination!);
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
            <AlertDialogTitle>Delete Destination</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingDestination?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Delete Destination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
