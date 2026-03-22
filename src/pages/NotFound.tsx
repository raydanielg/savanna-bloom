import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-24 -right-24 w-[500px] h-[96px] bg-teal-100 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-2xl w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Illustration Container */}
          <div className="relative mb-12 flex justify-center">
            <motion.div
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="w-64 h-64 bg-white rounded-full shadow-2xl shadow-orange-200 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Compass className="w-32 h-32 text-orange-500" />
              </div>
            </motion.div>
            
            {/* Animated 404 Text */}
            <motion.h1 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute -top-6 -right-4 text-9xl font-black text-slate-900/5 select-none"
            >
              404
            </motion.h1>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Lost in the Savanna?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
            The trail you're following doesn't seem to exist. Let's get you back to the main expedition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8 h-14 text-base font-bold shadow-lg shadow-orange-200 gap-2 group transition-all hover:scale-105">
              <Link to="/">
                <Home className="w-5 h-5" />
                Return to Base
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl px-8 h-14 text-base font-bold gap-2 transition-all hover:scale-105">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="w-5 h-5" />
                Previous Trail
              </button>
            </Button>
          </div>

          {/* Quick Links / Search Suggestion */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Popular Expeditions</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Tanzania Safaris', 'Kilimanjaro', 'Zanzibar', 'Day Trips'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-full text-sm font-medium text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:shadow-md transition-all"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%" 
            }}
            animate={{ 
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;
