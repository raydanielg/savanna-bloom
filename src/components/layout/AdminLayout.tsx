import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Map,
  Mountain,
  Compass,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  TreePalm,
  FileText,
  Globe,
  MessageSquare,
  Image,
  Layers,
} from "lucide-react";
import { useAuth } from "@/components/auth/ProtectedRoute";

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: any;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: Map,
    label: "Safaris",
    subItems: [
      { label: "All Safaris", href: "/admin/safaris" },
      { label: "Add Safari", href: "/admin/safaris/create" },
      { label: "Categories", href: "/admin/safaris/categories" },
    ],
  },
  {
    icon: Globe,
    label: "Destinations",
    subItems: [
      { label: "All Destinations", href: "/admin/destinations" },
      { label: "Add Destination", href: "/admin/destinations/create" },
    ],
  },
  {
    icon: Mountain,
    label: "Kilimanjaro Routes",
    subItems: [
      { label: "All Routes", href: "/admin/kilimanjaro-routes" },
      { label: "Add Route", href: "/admin/kilimanjaro-routes/create" },
    ],
  },
  {
    icon: TreePalm,
    label: "Day Trips",
    subItems: [
      { label: "All Day Trips", href: "/admin/day-trips" },
      { label: "Add Day Trip", href: "/admin/day-trips/create" },
    ],
  },
  {
    icon: Layers,
    label: "Packages",
    subItems: [
      { label: "All Packages", href: "/admin/packages" },
      { label: "Add Package", href: "/admin/packages/create" },
    ],
  },
  {
    icon: CalendarDays,
    label: "Bookings",
    subItems: [
      { label: "All Bookings", href: "/admin/bookings" },
      { label: "Calendar", href: "/admin/bookings/calendar" },
    ],
  },
  {
    icon: MessageSquare,
    label: "Inquiries",
    href: "/admin/inquiries",
  },
  {
    icon: FileText,
    label: "Blog",
    subItems: [
      { label: "All Posts", href: "/admin/blog" },
      { label: "Add Post", href: "/admin/blog/create" },
    ],
  },
  {
    icon: Image,
    label: "Gallery",
    href: "/admin/gallery",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: Settings,
    label: "Content",
    subItems: [
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "FAQs", href: "/admin/faqs" },
    ],
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
  },
];

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user: authUser, logout } = useAuth();

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (subItems?: { href: string }[]) =>
    subItems?.some((item) => location.pathname.startsWith(item.href));

  const MenuItemComponent = ({ item }: { item: MenuItem }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    const active = item.href ? isActive(item.href) : isParentActive(item.subItems);

    return (
      <div className="relative group">
        {hasSubItems ? (
          <>
            <button
              onClick={() => toggleMenu(item.label)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                !sidebarOpen && "justify-center px-0",
                active
                  ? "bg-orange-50 text-orange-700 ring-1 ring-orange-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}
              >
                <item.icon size={20} className={active ? "text-orange-600" : "text-gray-400"} />
                {sidebarOpen && <span>{item.label}</span>}
              </div>
              {sidebarOpen && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>
            {sidebarOpen && isExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                {item.subItems!.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm transition-colors",
                      isActive(subItem.href)
                        ? "bg-orange-50 text-orange-700 font-medium"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}

            {!sidebarOpen && (
              <div className="pointer-events-none absolute left-full top-0 z-50 ml-3 hidden w-60 rounded-xl border border-gray-200 bg-white p-2 shadow-xl group-hover:block">
                <div className="pointer-events-auto">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">Quick navigation</p>
                  </div>
                  <div className="space-y-1">
                    {item.subItems!.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive(subItem.href)
                            ? "bg-orange-50 text-orange-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.href!}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              !sidebarOpen && "justify-center px-0",
              active
                ? "bg-orange-50 text-orange-700 ring-1 ring-orange-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon size={20} className={active ? "text-orange-600" : "text-gray-400"} />
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        )}

        {!sidebarOpen && !hasSubItems && (
          <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-xl group-hover:block">
            {item.label}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <Compass size={18} className="text-white" />
          </div>
          <span className="font-bold text-orange-600">Savanna Bloom</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b border-gray-100 px-4",
          sidebarOpen ? "justify-between" : "justify-center"
        )}>
          {sidebarOpen ? (
            <>
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                  <Compass size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-800">Savanna Bloom</h1>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 hidden lg:flex"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => (
            <MenuItemComponent key={item.label} item={item} />
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-100 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                {authUser?.name?.charAt(0) || user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{authUser?.name || user?.name || "Admin"}</p>
                <p className="text-xs text-gray-400 truncate">{authUser?.email || user?.email || "admin@savannabloom.com"}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                {authUser?.name?.charAt(0) || user?.name?.charAt(0) || "A"}
              </div>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "w-full text-red-500 hover:text-red-600 hover:bg-red-50",
              !sidebarOpen && "justify-center px-0"
            )}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-16 lg:pt-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {location.pathname.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Dashboard"}
                </h2>
                <p className="text-sm text-gray-400">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-orange-600">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
