import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Search, 
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  DollarSign,
  Mail,
  Trash2,
  User,
  Users,
  X,
  Download,
  FileText
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: number;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  bookable?: { name: string; type: string };
  start_date: string;
  end_date: string;
  total_guests: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  special_requests?: string;
  created_at: string;
}

export default function Bookings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Confirm action dialog
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionBooking, setActionBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<"confirm" | "cancel" | "delete" | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const bookingsResponse = await axios.get("/api/admin/bookings");
        if (isMounted) {
          const data = bookingsResponse.data?.data || bookingsResponse.data || [];
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (error: any) {
        console.error("Failed to fetch bookings:", error);
        if (isMounted) setBookings([]);
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

  const openActionDialog = (booking: Booking, type: "confirm" | "cancel" | "delete") => {
    setActionBooking(booking);
    setActionType(type);
    setIsActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionBooking || !actionType) return;
    try {
      if (actionType === "delete") {
        await axios.delete(`/api/admin/bookings/${actionBooking.id}`);
        setBookings(bookings.filter(b => b.id !== actionBooking.id));
      } else {
        const status = actionType === "confirm" ? "confirmed" : "cancelled";
        await axios.put(`/api/admin/bookings/${actionBooking.id}`, { status });
        setBookings(bookings.map(b => b.id === actionBooking.id ? { ...b, status } : b));
      }
      setIsActionDialogOpen(false);
      setActionBooking(null);
      setActionType(null);
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.bookable?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booking_reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + (parseFloat(String(b.paid_amount)) || 0), 0);
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const cancelledBookings = bookings.filter(b => b.status === "cancelled").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { 
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      partial: "bg-orange-100 text-orange-700",
      unpaid: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const getBookingTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      safari: "bg-green-100 text-green-700",
      kilimanjaro: "bg-purple-100 text-purple-700",
      day_trip: "bg-blue-100 text-blue-700",
      package: "bg-orange-100 text-orange-700",
    };
    return styles[type] || "bg-gray-100 text-gray-600";
  };

  const actionDialogCopy = () => {
    if (!actionType) return { title: "", description: "", button: "" };
    if (actionType === "confirm") {
      return {
        title: "Confirm Booking",
        description: `Are you sure you want to confirm booking \"${actionBooking?.booking_reference}\"?`,
        button: "Confirm Booking",
      };
    }
    if (actionType === "cancel") {
      return {
        title: "Cancel Booking",
        description: `Are you sure you want to cancel booking \"${actionBooking?.booking_reference}\"?`,
        button: "Cancel Booking",
      };
    }
    return {
      title: "Delete Booking",
      description: `Are you sure you want to delete booking \"${actionBooking?.booking_reference}\"? This action cannot be undone.`,
      button: "Delete Booking",
    };
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
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage all safari bookings and reservations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("confirmed")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedBookings}</p>
                <p className="text-xs text-gray-500">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("pending")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingBookings}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("cancelled")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cancelledBookings}</p>
                <p className="text-xs text-gray-500">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-xs text-gray-500">Total Bookings</p>
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
                placeholder="Search by name, email, reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {statusFilter !== "all" && (
                <Button variant="ghost" size="sm" onClick={() => setStatusFilter("all")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Safari</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className={`hover:bg-gray-50 ${booking.status === 'pending' ? 'bg-yellow-50/30' : ''}`}>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{booking.booking_reference}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-xs text-gray-500">{booking.customer_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.bookable?.name || 'N/A'}</p>
                        {booking.bookable?.type && (
                          <Badge className={getBookingTypeBadge(booking.bookable.type)}>
                            {booking.bookable.type}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(booking.start_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        {booking.total_guests}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-green-600">${(parseFloat(String(booking.total_amount)) || 0).toLocaleString()}</p>
                        {(parseFloat(String(booking.paid_amount)) || 0) < (parseFloat(String(booking.total_amount)) || 0) && (
                          <p className="text-xs text-gray-500">${(parseFloat(String(booking.paid_amount)) || 0).toLocaleString()} paid</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentBadge(booking.payment_status)}>
                        {booking.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/bookings/${booking.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/bookings/${booking.id}/email`)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/bookings/${booking.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/bookings/${booking.id}/email`)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Confirmation Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/bookings/${booking.id}/invoice`)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Invoice
                            </DropdownMenuItem>
                            {booking.status !== 'confirmed' && (
                              <DropdownMenuItem onClick={() => openActionDialog(booking, "confirm")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Booking
                              </DropdownMenuItem>
                            )}
                            {booking.status !== 'cancelled' && (
                              <DropdownMenuItem className="text-orange-600" onClick={() => openActionDialog(booking, "cancel")}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600" onClick={() => openActionDialog(booking, "delete")}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Confirmation */}
      <AlertDialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionDialogCopy().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialogCopy().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={actionType === "delete" ? "bg-red-600 hover:bg-red-700" : actionType === "cancel" ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
              onClick={handleConfirmAction}
            >
              {actionDialogCopy().button}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
