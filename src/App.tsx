import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Kilimanjaro from "./pages/Kilimanjaro.tsx";
import KilimanjaroRoute from "./pages/KilimanjaroRoute.tsx";
import TanzaniaSafaris from "./pages/TanzaniaSafaris.tsx";
import SafariDetail from "./pages/SafariDetail.tsx";
import Destinations from "./pages/Destinations.tsx";
import DayTrips from "./pages/DayTrips.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Packages from "./pages/Packages.tsx";
import PackageDetail from "./pages/PackageDetail.tsx";
// Admin Pages
import BlogDetail from "./pages/BlogDetail.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import AdminSafaris from "./pages/admin/Safaris.tsx";
import AdminBookings from "./pages/admin/Bookings.tsx";
import AdminBookingDetails from "./pages/admin/BookingDetails.tsx";
import AdminBookingEmail from "./pages/admin/BookingEmail.tsx";
import AdminBookingInvoice from "./pages/admin/BookingInvoice.tsx";
import AdminBookingCalendar from "./pages/admin/BookingCalendar.tsx";
import AdminUsers from "./pages/admin/Users.tsx";
import AdminInquiries from "./pages/admin/Inquiries.tsx";
import AdminDestinations from "./pages/admin/Destinations.tsx";
import AdminKilimanjaroRoutes from "./pages/admin/KilimanjaroRoutes.tsx";
import AdminDayTrips from "./pages/admin/DayTrips.tsx";
import AdminDayTripCreate from "./pages/admin/DayTripCreate.tsx";
import AdminTestimonials from "./pages/admin/Testimonials.tsx";
import AdminBlogPosts from "./pages/admin/BlogPosts.tsx";
import AdminPackages from "./pages/admin/Packages.tsx";
import AdminPackageCreate from "./pages/admin/PackageCreate.tsx";
import AdminGallery from "./pages/admin/Gallery.tsx";
import AdminFaqs from "./pages/admin/Faqs.tsx";
import AdminSettings from "./pages/admin/Settings.tsx";
import AdminSafariDetails from "./pages/admin/SafariDetails.tsx";
import AdminSafariForm from "./pages/admin/SafariForm.tsx";
import AdminSafariCategories from "./pages/admin/SafariCategories.tsx";
import AdminUserDetails from "./pages/admin/UserDetails.tsx";
import AdminKilimanjaroRouteDetails from "./pages/admin/KilimanjaroRouteDetails.tsx";
import AdminDestinationForm from "./pages/admin/DestinationForm.tsx";
import AdminKilimanjaroRouteForm from "./pages/admin/KilimanjaroRouteForm.tsx";
import AdminBlogPostForm from "./pages/admin/BlogPostForm.tsx";
import NotFound from "./pages/NotFound.tsx";
import Maintenance from "./pages/Maintenance.tsx";
// Auth
import { AuthProvider } from "./components/auth/ProtectedRoute.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/kilimanjaro" element={<Kilimanjaro />} />
            <Route path="/kilimanjaro/:slug" element={<KilimanjaroRoute />} />
            <Route path="/kilimanjaro-routes" element={<Kilimanjaro />} />
            <Route path="/tanzania-safaris" element={<TanzaniaSafaris />} />
            <Route path="/safari/:slug" element={<SafariDetail />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:slug" element={<Destinations />} />
            <Route path="/day-trips" element={<DayTrips />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/maintenance" element={<Maintenance />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/safaris" element={<ProtectedRoute><AdminSafaris /></ProtectedRoute>} />
            <Route path="/admin/safaris/:id" element={<ProtectedRoute><AdminSafariForm /></ProtectedRoute>} />
            <Route path="/admin/safaris/create" element={<ProtectedRoute><AdminSafariForm /></ProtectedRoute>} />
            <Route path="/admin/safaris/categories" element={<ProtectedRoute><AdminSafariCategories /></ProtectedRoute>} />
            <Route path="/admin/safaris/view/:id" element={<ProtectedRoute><AdminSafariDetails /></ProtectedRoute>} />
            <Route path="/admin/destinations/:id" element={<ProtectedRoute><AdminDestinationForm /></ProtectedRoute>} />
            <Route path="/admin/destinations/create" element={<ProtectedRoute><AdminDestinationForm /></ProtectedRoute>} />
            <Route path="/admin/kilimanjaro-routes" element={<ProtectedRoute><AdminKilimanjaroRoutes /></ProtectedRoute>} />
            <Route path="/admin/kilimanjaro-routes/:id" element={<ProtectedRoute><AdminKilimanjaroRouteDetails /></ProtectedRoute>} />
            <Route path="/admin/kilimanjaro-routes/create" element={<ProtectedRoute><AdminKilimanjaroRouteForm /></ProtectedRoute>} />
            <Route path="/admin/day-trips" element={<ProtectedRoute><AdminDayTrips /></ProtectedRoute>} />
            <Route path="/admin/day-trips/create" element={<ProtectedRoute><AdminDayTripCreate /></ProtectedRoute>} />
            <Route path="/admin/packages" element={<ProtectedRoute><AdminPackages /></ProtectedRoute>} />
            <Route path="/admin/packages/create" element={<ProtectedRoute><AdminPackageCreate /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/bookings/calendar" element={<ProtectedRoute><AdminBookingCalendar /></ProtectedRoute>} />
            <Route path="/admin/bookings/:id" element={<ProtectedRoute><AdminBookingDetails /></ProtectedRoute>} />
            <Route path="/admin/bookings/:id/email" element={<ProtectedRoute><AdminBookingEmail /></ProtectedRoute>} />
            <Route path="/admin/bookings/:id/invoice" element={<ProtectedRoute><AdminBookingInvoice /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogPosts /></ProtectedRoute>} />
            <Route path="/admin/blog/:id" element={<ProtectedRoute><AdminBlogPostForm /></ProtectedRoute>} />
            <Route path="/admin/blog/create" element={<ProtectedRoute><AdminBlogPostForm /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
            <Route path="/admin/faqs" element={<ProtectedRoute><AdminFaqs /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/users/:id" element={<ProtectedRoute><AdminUserDetails /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
