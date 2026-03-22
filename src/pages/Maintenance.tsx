import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Wrench, Mail, Phone, MapPin, Clock, RefreshCw } from "lucide-react";
import axios from "@/lib/axios";

interface MaintenanceData {
  maintenance_mode: string;
  maintenance_message: string;
  site_name: string;
  site_email: string;
  site_phone: string;
  site_address: string;
}

export default function Maintenance() {
  const [settings, setSettings] = useState<MaintenanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings/public");
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Simulated countdown (you can set actual expected time in settings)
  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 2); // 2 hours from now

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-20 h-20 bg-orange-200/30 rounded-full"
        ></motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-20 w-32 h-32 bg-amber-200/30 rounded-full"
        ></motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-16 h-16 bg-yellow-200/30 rounded-full"
        ></motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-200">
              <Compass className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4"
          >
            {settings?.site_name || "Savanna Bloom"}
          </motion.h1>

          {/* Maintenance Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
              <Wrench className="w-10 h-10 text-orange-600 animate-pulse" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              We're Currently Under Maintenance
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
              {settings?.maintenance_message || 
                "We're making some exciting improvements to serve you better. Our website will be back online shortly with new features and enhanced experiences."}
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <p className="text-sm text-gray-500 mb-3 uppercase tracking-wider">Estimated Time Remaining</p>
            <div className="flex justify-center gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-orange-600">{countdown.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase">Hours</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-orange-600">{countdown.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase">Minutes</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-orange-600">{countdown.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase">Seconds</div>
              </div>
            </div>
          </motion.div>

          {/* Refresh Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={handleRefresh}
            className="mb-10 inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium transition-all hover:shadow-lg hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Check if We're Back
          </motion.button>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Need Immediate Assistance?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings?.site_email && (
                <a
                  href={`mailto:${settings.site_email}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-orange-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600">Email Us</span>
                  <span className="text-sm font-medium text-gray-800">{settings.site_email}</span>
                </a>
              )}
              {settings?.site_phone && (
                <a
                  href={`tel:${settings.site_phone}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-orange-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600">Call Us</span>
                  <span className="text-sm font-medium text-gray-800">{settings.site_phone}</span>
                </a>
              )}
              {settings?.site_address && (
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600">Visit Us</span>
                  <span className="text-sm font-medium text-gray-800 text-center">{settings.site_address}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-sm text-gray-500"
          >
            Thank you for your patience and understanding.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
