import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Send, User } from "lucide-react";

interface Booking {
  id: number;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  bookable?: { name: string };
  start_date: string;
  end_date: string;
  total_guests: number;
  total_amount: number;
  paid_amount: number;
  status: string;
}

export default function BookingEmail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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

  const defaultTemplate = useMemo(() => {
    if (!booking) return { subject: "", message: "" };

    const subj = `Booking Confirmation - ${booking.booking_reference}`;
    const msg = `Dear ${booking.customer_name},\n\n` +
      `Thank you for your booking with Savanna Bloom.\n\n` +
      `Booking Reference: ${booking.booking_reference}\n` +
      `Safari: ${booking.bookable?.name || "N/A"}\n` +
      `Date: ${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}\n` +
      `Guests: ${booking.total_guests}\n` +
      `Total Amount: $${booking.total_amount.toLocaleString()}\n` +
      `Paid Amount: $${booking.paid_amount.toLocaleString()}\n\n` +
      `We will contact you with more details shortly.\n\n` +
      `Best regards,\n` +
      `Savanna Bloom Team`;

    return { subject: subj, message: msg };
  }, [booking]);

  useEffect(() => {
    if (!booking) return;
    setSubject(defaultTemplate.subject);
    setMessage(defaultTemplate.message);
  }, [booking, defaultTemplate.subject, defaultTemplate.message]);

  const handleSend = async () => {
    if (!booking) return;
    if (!subject.trim() || !message.trim()) return;

    setSaving(true);
    try {
      await axios.post(`/api/admin/bookings/${booking.id}/email`, { subject, message });
      navigate(`/admin/bookings/${booking.id}`);
    } catch (error) {
      console.error("Failed to send booking email:", error);
    } finally {
      setSaving(false);
    }
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
    <AdminLayout user={userData}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to={booking ? `/admin/bookings/${booking.id}` : "/admin/bookings"}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send Email</h1>
              <p className="text-gray-500">Booking confirmation & updates</p>
            </div>
          </div>
        </div>

        {booking && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                Recipient
              </CardTitle>
              <CardDescription>Customer details</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{booking.customer_name}</p>
                <p className="text-sm text-gray-500">{booking.customer_email}</p>
              </div>
              <Badge className={booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                {booking.status}
              </Badge>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Email Content</CardTitle>
            <CardDescription>Edit before sending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject..." />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={10} placeholder="Write message..." />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setSubject(defaultTemplate.subject);
                setMessage(defaultTemplate.message);
              }} disabled={!booking}>
                Reset Template
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSend} disabled={!booking || saving || !subject.trim() || !message.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {saving ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
