import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "@/lib/axios";

interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  maintenanceMode: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const checkAuth = async () => {
      const isLoginPage = location.pathname === '/login';
      const isRegisterPage = location.pathname === '/register';
      const isMaintenancePage = location.pathname === '/maintenance';
      
      // Check maintenance mode first
      try {
        const settingsRes = await axios.get("/api/settings/public");
        const isMaintenance = settingsRes.data?.maintenance_mode === 'true';
        setMaintenanceMode(isMaintenance);
        
        // If maintenance mode is on, check if user is admin
        if (isMaintenance && !isMaintenancePage) {
          try {
            const userRes = await axios.get("/api/user");
            const currentUser = userRes.data;
            setUser(currentUser);
            
            // Non-admin users should see maintenance page
            if (currentUser?.role !== 'admin') {
              navigate("/maintenance", { replace: true });
              setLoading(false);
              return;
            }
          } catch (authError) {
            // Not logged in - redirect to maintenance
            setUser(null);
            navigate("/maintenance", { replace: true });
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log("Failed to check maintenance mode:", error);
      }

      // Skip auth check for login, register, and maintenance pages
      if (isLoginPage || isRegisterPage || isMaintenancePage) {
        setLoading(false);
        return;
      }

      // Only check auth for admin routes
      const isAdminRoute = location.pathname.startsWith('/admin');
      if (!isAdminRoute) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/user");
        setUser(response.data);
      } catch (error: any) {
        console.log("Auth check failed:", error?.response?.status);
        // Only redirect if it's a 401 (unauthorized)
        if (error?.response?.status === 401) {
          setUser(null);
          navigate("/login", { replace: true, state: { from: location } });
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate, location]);

  const logout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, maintenanceMode, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
