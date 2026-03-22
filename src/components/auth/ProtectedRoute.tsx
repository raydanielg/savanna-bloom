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
  const [user, setUser] = useState<any>(() => {
    // Initial check from localStorage to prevent flickering
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const isLoginPage = location.pathname === '/login';
      const isRegisterPage = location.pathname === '/register';
      const isMaintenancePage = location.pathname === '/maintenance';
      const isAdminRoute = location.pathname.startsWith('/admin');
      
      // If we are on public pages and not trying to access admin, we can be more relaxed
      if (!isAdminRoute && !isLoginPage && !isRegisterPage && !isMaintenancePage) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const settingsRes = await axios.get("/api/settings/public");
        if (isMounted) {
          const isMaintenance = settingsRes.data?.maintenance_mode === 'true';
          setMaintenanceMode(isMaintenance);
          
          if (isMaintenance && !isMaintenancePage && !isAdminRoute) {
            navigate("/maintenance", { replace: true });
            if (isMounted) setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log("Settings check failed", error);
      }

      try {
        // Essential: Check auth state from server
        // Add a retry mechanism or check for existing session before redirecting
        const response = await axios.get("/api/user");
        if (isMounted) {
          const userData = response.data;
          setUser(userData);
          
          // If on login and already authenticated, go to dashboard
          if (isLoginPage && userData.role === 'admin') {
            navigate("/admin/dashboard", { replace: true });
          }
        }
      } catch (error: any) {
        console.log("Auth check failed:", error?.response?.status);
        
        // If the request fails with 401, only redirect if we are on an admin route
        // and we are NOT currently trying to log in.
        if (error?.response?.status === 401) {
          if (isMounted) {
            setUser(null);
            localStorage.removeItem("auth_user");
            if (isAdminRoute) {
              // Standardized redirect to login
              navigate("/login", { replace: true, state: { from: location } });
            }
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Use a small delay to allow cookies to be settled, especially after a fresh login or redirect
    const timer = setTimeout(() => {
      checkAuth();
    }, 200); // Increased delay slightly for production stability

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [location.pathname]); // Stay focused on path changes only

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
