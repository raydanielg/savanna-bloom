import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Printer, Compass } from "lucide-react";

interface Booking {
  id: number;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  bookable?: { name: string };
  start_date: string;
  end_date: string;
  total_guests: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function BookingInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);

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

  const invoiceTotals = useMemo(() => {
    const total = booking?.total_amount || 0;
    const paid = booking?.paid_amount || 0;
    const balance = total - paid;
    return { total, paid, balance };
  }, [booking]);

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
          <Button variant="outline" asChild>
            <Link to="/admin/bookings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Card className="border-0 shadow-sm mt-4">
            <CardContent className="p-6">
              <p className="text-gray-600">Invoice not available (booking not found).</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={userData}>
      <div className="max-w-5xl mx-auto space-y-6 print:max-w-none print:space-y-0 print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to={`/admin/bookings/${booking.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-orange-600" />
                Invoice
              </h1>
              <p className="text-gray-500">Booking: {booking.booking_reference}</p>
            </div>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>

        <Card className="border-0 shadow-sm print:shadow-none print:border print:border-gray-200">
          <CardHeader className="print:border-b print:border-gray-200">
            {/* Invoice Header with Logo */}
            <div className="flex items-center justify-between print:pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 print:shadow-none">
                  <Compass size={26} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Savanna Bloom</CardTitle>
                  <CardDescription className="text-xs">African Safari Adventures</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">INVOICE</p>
                <p className="text-xs text-gray-500">#{booking.booking_reference}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 print:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
              <div>
                <p className="text-sm text-gray-500">Billed To</p>
                <p className="font-semibold text-gray-900">{booking.customer_name}</p>
                <p className="text-sm text-gray-600">{booking.customer_email}</p>
                <p className="text-sm text-gray-600">{booking.customer_phone}</p>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-gray-500">Invoice Details</p>
                <p className="text-sm text-gray-700">Invoice #: {booking.booking_reference}</p>
                <p className="text-sm text-gray-700">Date: {formatDate(booking.created_at)}</p>
                <p className="text-sm text-gray-700">Status: {booking.status}</p>
                <p className="text-sm text-gray-700">Payment: {booking.payment_status}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Item</p>
                <p className="text-sm font-medium text-gray-700">Amount</p>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="font-semibold">{booking.bookable?.name || "Safari / Package"}</p>
                  <p className="text-sm text-gray-500">Dates: {formatDate(booking.start_date)} - {formatDate(booking.end_date)}</p>
                  <p className="text-sm text-gray-500">Guests: {booking.total_guests}</p>
                </div>
                <p className="font-bold text-green-700">${invoiceTotals.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full sm:w-96 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold">${invoiceTotals.total.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="font-semibold">${invoiceTotals.paid.toLocaleString()}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900 font-semibold">Balance Due</p>
                  <p className="text-lg font-bold text-orange-700">${invoiceTotals.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Footer for print */}
            <div className="hidden print:block pt-6 mt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Thank you for choosing Savanna Bloom for your African adventure.</p>
              <p className="mt-1">Contact: info@savannabloom.com | +255 123 456 789</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
