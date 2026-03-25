import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, Trash2, Mountain, Clock, TrendingUp, DollarSign } from "lucide-react";
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
import { getStorageUrl } from "@/lib/storage";

interface KilimanjaroRoute {
  id: number;
  name: string;
  days: number;
  difficulty: string;
  price: number;
  success_rate: number;
  image: string;
  featured: boolean;
  active: boolean;
}

export default function KilimanjaroRoutes() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [routes, setRoutes] = useState<KilimanjaroRoute[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get("/api/user");
      setUser(userResponse.data);

      const routesResponse = await axios.get("/api/kilimanjaro-routes");
      setRoutes(routesResponse.data.data || routesResponse.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await axios.delete(`/api/admin/kilimanjaro-routes/${id}`);
      setRoutes(routes.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete route:", error);
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kilimanjaro Routes</h1>
          <p className="text-gray-500">Manage climbing routes and itineraries</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => navigate("/admin/kilimanjaro-routes/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </div>

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
                <TableHead>Route</TableHead>
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
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center overflow-hidden">
                          {route.image ? (
                            <img src={getStorageUrl(route.image)} alt={route.name} className="h-10 w-10 object-cover" />
                          ) : (
                            <Mountain className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{route.name}</p>
                          {route.featured && (
                            <Badge className="bg-orange-100 text-orange-700 text-[10px] h-4">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {route.days} Days
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {route.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      ${route.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="h-4 w-4" />
                        {route.success_rate}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={route.active ? "default" : "secondary"} className={route.active ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
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
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(route.id)}>
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
