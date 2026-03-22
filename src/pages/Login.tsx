import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/ProtectedRoute";
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, ChevronRight } from "lucide-react";
import { getStorageUrl } from "@/lib/storage";

const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(249, 115, 22, 0.15)";
      ctx.strokeStyle = "rgba(249, 115, 22, 0.08)";

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const [bgImageIndex, setBgImageIndex] = useState(0);
  const bgImages = [
    getStorageUrl('/storage/hero/hero-safari.jpg'),
    getStorageUrl('/storage/hero/migration.jpg'),
    getStorageUrl('/storage/hero/kili-summit.jpg')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.get("/sanctum/csrf-cookie");
      await new Promise(resolve => setTimeout(resolve, 100));
      const response = await axios.post("/api/login", { email, password });
      setUser(response.data.user);
      
      toast({
        title: "Access Granted",
        description: "Welcome to Go Deep Africa Admin Panel",
      });
      
      const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid credentials. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-white">
      {/* Left Side - Visual Content */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {bgImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === bgImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "opacity 1s ease-in-out, transform 10s linear"
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Go Deep Africa</h2>
              <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Admin Control</p>
            </div>
          </div>

          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Gateway to <span className="text-orange-500">Unforgettable</span> Adventures.
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Manage your safari expeditions, track bookings, and provide world-class service to your travelers across the African savanna.
            </p>
            <div className="flex gap-10 border-t border-white/20 pt-8">
              <div>
                <p className="text-3xl font-bold text-orange-500">50+</p>
                <p className="text-sm text-white/60">Destinations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">1.2K</p>
                <p className="text-sm text-white/60">Travelers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">24/7</p>
                <p className="text-sm text-white/60">Global Support</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Go Deep Africa Safari. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form Area */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16 bg-slate-50 relative">
        <BackgroundAnimation />
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Go Deep Africa</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your admin credentials</p>
          </div>

          <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-6 pt-8">
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@godeepafricasafari.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      className="pl-12 h-12 bg-slate-100/50 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="pl-12 h-12 bg-slate-100/50 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-6 pb-8 pt-2">
                <Button 
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 group" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In to Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
                
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200"></span>
                  </div>
                  <span className="relative px-4 text-xs font-semibold text-slate-400 bg-white uppercase tracking-widest">Security Policy</span>
                </div>
                
                <p className="text-xs text-center text-slate-400 px-4 leading-relaxed">
                  Authorized access only. All activities are monitored and logged for security purposes.
                </p>
              </CardFooter>
            </form>
          </Card>

          <p className="mt-8 text-center text-sm">
            <Link to="/" className="text-slate-500 hover:text-orange-600 font-medium flex items-center justify-center gap-2 transition-colors">
              &larr; Return to Public Website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
