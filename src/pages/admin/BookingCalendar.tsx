import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Eye,
  Mail,
  FileText,
  Users,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axios from "@/lib/axios";

interface Booking {
  id: number;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_guests: number;
  total_amount: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "pending" | "paid" | "partial" | "refunded";
  booking_type: string;
  bookable?: {
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusDotColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  cancelled: "bg-red-500",
  completed: "bg-blue-500",
};

export default function BookingCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/user");
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/admin/bookings");
      // Handle paginated response
      const data = response.data.data || response.data;
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date): Booking[] => {
    return bookings.filter((booking) => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const dayBookings = getBookingsForDate(date);
    setSelectedDate(date);
    setSelectedBookings(dayBookings);
  };

  // Navigate months
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
    setSelectedBookings(getBookingsForDate(new Date()));
  };

  // Get status badge
  const getStatusBadge = (status: string) => (
    <Badge variant="outline" className={cn("text-xs", statusColors[status] || statusColors.pending)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  if (loading) {
    return (
      <AdminLayout user={userData}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={userData}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-orange-600" />
              Booking Calendar
            </h1>
            <p className="text-gray-500">View and manage bookings by date</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" asChild>
              <Link to="/admin/bookings">All Bookings</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <CardTitle className="text-lg">
                    {format(currentDate, "MMMM yyyy")}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="text-gray-500">Confirmed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-500">Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span className="text-gray-500">Cancelled</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month start */}
                {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-24 bg-gray-50/50 rounded-lg"></div>
                ))}

                {/* Month days */}
                {monthDays.map((day) => {
                  const dayBookings = getBookingsForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        "h-24 p-1.5 rounded-lg border transition-all hover:border-orange-300 hover:shadow-sm text-left",
                        isCurrentDay && "border-orange-400 bg-orange-50/50",
                        isSelected && "border-orange-500 bg-orange-50 ring-2 ring-orange-200",
                        !isCurrentDay && !isSelected && "border-gray-100 bg-white"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        isCurrentDay ? "text-orange-600" : "text-gray-700"
                      )}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        {dayBookings.slice(0, 3).map((booking) => (
                          <div
                            key={booking.id}
                            className={cn(
                              "text-[10px] px-1 py-0.5 rounded truncate font-medium",
                              statusColors[booking.status]
                            )}
                          >
                            {booking.customer_name.split(" ")[0]}
                          </div>
                        ))}
                        {dayBookings.length > 3 && (
                          <div className="text-[10px] text-gray-500 px-1">
                            +{dayBookings.length - 3} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Bookings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a Date"}
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? `${selectedBookings.length} booking${selectedBookings.length !== 1 ? "s" : ""} on this date`
                  : "Click on a calendar date to view bookings"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {selectedDate ? (
                selectedBookings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              statusDotColors[booking.status]
                            )}></div>
                            <span className="font-medium text-sm text-gray-900">
                              {booking.customer_name}
                            </span>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span>{booking.bookable?.name || booking.booking_type}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3" />
                            <span>{booking.total_guests} guests</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" />
                            <span>${parseFloat(booking.total_amount).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 mt-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/bookings/${booking.id}`);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/bookings/${booking.id}/email`);
                            }}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/bookings/${booking.id}/invoice`);
                            }}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No bookings on this date</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      asChild
                    >
                      <Link to="/admin/bookings">View All Bookings</Link>
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Click on a date to view bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
