import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Kilimanjaro from "./pages/Kilimanjaro.tsx";
import KilimanjaroRoute from "./pages/KilimanjaroRoute.tsx";
import TanzaniaSafaris from "./pages/TanzaniaSafaris.tsx";
import Destinations from "./pages/Destinations.tsx";
import DayTrips from "./pages/DayTrips.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/kilimanjaro" element={<Kilimanjaro />} />
          <Route path="/kilimanjaro-routes" element={<Kilimanjaro />} />
          <Route path="/lemosho-route" element={<KilimanjaroRoute />} />
          <Route path="/machame-route" element={<KilimanjaroRoute />} />
          <Route path="/marangu-route" element={<KilimanjaroRoute />} />
          <Route path="/rongai-route" element={<KilimanjaroRoute />} />
          <Route path="/northern-circuit" element={<KilimanjaroRoute />} />
          <Route path="/tanzania-safaris" element={<TanzaniaSafaris />} />
          <Route path="/serengeti-safari" element={<TanzaniaSafaris />} />
          <Route path="/ngorongoro-safari" element={<TanzaniaSafaris />} />
          <Route path="/tarangire-safari" element={<TanzaniaSafaris />} />
          <Route path="/lake-manyara-safari" element={<TanzaniaSafaris />} />
          <Route path="/zanzibar-tour" element={<TanzaniaSafaris />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/day-trips" element={<DayTrips />} />
          <Route path="/materuni-waterfall" element={<DayTrips />} />
          <Route path="/chemka-hot-springs" element={<DayTrips />} />
          <Route path="/coffee-tour" element={<DayTrips />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
