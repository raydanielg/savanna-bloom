import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/ProtectedRoute";
import { Compass, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get CSRF cookie first - this sets the XSRF-TOKEN cookie
      await axios.get("/sanctum/csrf-cookie");
      
      // Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then login
      const response = await axios.post("/api/login", { email, password });
      
      // Set user in auth context
      setUser(response.data.user);
      
      toast({
        title: "Success",
        description: response.data.message || "Login successful. Welcome back!",
      });
      
      // Navigate to the page they tried to visit or dashboard
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
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Compass className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Savanna Bloom</h1>
          <p className="text-xl text-white/80 mb-8">Admin Dashboard</p>
          <div className="max-w-md text-center">
            <p className="text-white/70 leading-relaxed">
              Manage your safari adventures, bookings, and customer inquiries all in one place.
            </p>
          </div>
          <div className="mt-12 flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-white/60">Safaris</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1.2K</p>
              <p className="text-sm text-white/60">Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-white/60">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Savanna Bloom</h1>
            <p className="text-gray-500">Admin Dashboard</p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@savannabloom.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      className="pl-10 h-11"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="pl-10 h-11"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Demo Credentials Hint */}
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                  <p className="text-xs text-orange-700 font-medium mb-1">Demo Credentials:</p>
                  <p className="text-xs text-orange-600">Email: admin@savannabloom.com</p>
                  <p className="text-xs text-orange-600">Password: admin123</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button 
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-medium" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  This admin panel is restricted to authorized personnel only.
                </p>
              </CardFooter>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500">
            Want to visit our website?{" "}
            <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">
              Go to Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
