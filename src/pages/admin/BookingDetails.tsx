import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "@/lib/axios";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { Calendar, Mail, Phone, User, Users, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

interface Booking {
  id: number;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  bookable?: { name: string; type?: string };
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

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);

  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"confirm" | "cancel" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/api/user");
        setUserData(userResponse.data);

        const bookingResponse = await axios.get(`/api/admin/bookings/${id}`);
        setBooking(bookingResponse.data);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const openActionDialog = (type: "confirm" | "cancel") => {
    setActionType(type);
    setIsActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!booking || !actionType) return;
    try {
      const status = actionType === "confirm" ? "confirmed" : "cancelled";
      await axios.put(`/api/admin/bookings/${booking.id}`, { status });
      setBooking({ ...booking, status });
    } catch (error) {
      console.error("Failed to update booking:", error);
    } finally {
      setIsActionDialogOpen(false);
      setActionType(null);
    }
  };

  const actionDialogCopy = () => {
    if (!actionType) return { title: "", description: "", button: "" };
    if (actionType === "confirm") {
      return {
        title: "Confirm Booking",
        description: `Are you sure you want to confirm booking \"${booking?.booking_reference}\"?`,
        button: "Confirm Booking",
      };
    }
    return {
      title: "Cancel Booking",
      description: `Are you sure you want to cancel booking \"${booking?.booking_reference}\"?`,
      button: "Cancel Booking",
    };
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      partial: "bg-orange-100 text-orange-700",
      unpaid: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
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

  if (!booking) {
    return (
      <AdminLayout user={userData}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" onClick={() => navigate("/admin/bookings")}> 
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-gray-600">Booking not found.</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={userData}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/admin/bookings")}> 
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-500">Reference: {booking.booking_reference}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/admin/bookings/${booking.id}/email`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Link>
            </Button>
            {booking.status !== "confirmed" && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => openActionDialog("confirm")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            )}
            {booking.status !== "cancelled" && (
              <Button variant="outline" className="text-orange-700" onClick={() => openActionDialog("cancel")}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Customer</CardTitle>
                <CardDescription>Contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{booking.customer_name}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {booking.customer_email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {booking.customer_phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Booking Info</CardTitle>
                <CardDescription>Trip and dates</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Safari / Package</Label>
                  <p className="font-medium">{booking.bookable?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Guests</Label>
                  <p className="font-medium flex items-center gap-2"><Users className="h-4 w-4 text-gray-400" /> {booking.total_guests}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Start Date</Label>
                  <p className="font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /> {formatDate(booking.start_date)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">End Date</Label>
                  <p className="font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /> {formatDate(booking.end_date)}</p>
                </div>
              </CardContent>
            </Card>

            {booking.special_requests && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Special Requests</CardTitle>
                  <CardDescription>Notes from the customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{booking.special_requests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>Booking and payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-500">Booking</Label>
                  <Badge className={getStatusBadge(booking.status)}>{booking.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-500">Payment</Label>
                  <Badge className={getPaymentBadge(booking.payment_status)}>{booking.payment_status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Amounts</CardTitle>
                <CardDescription>Totals and balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-500">Total</Label>
                  <p className="font-semibold">${booking.total_amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-500">Paid</Label>
                  <p className="font-semibold">${booking.paid_amount.toLocaleString()}</p>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-500">Balance</Label>
                    <p className="font-bold text-orange-700">${(booking.total_amount - booking.paid_amount).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-right">Booked on {formatDateTime(booking.created_at)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
              className={actionType === "cancel" ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
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
