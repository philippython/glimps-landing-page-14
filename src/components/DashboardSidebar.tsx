
import { NavLink } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  Calendar, 
  Images, 
  Settings, 
  Users, 
  HelpCircle,
  LogOut,
  BarChart3,
  MessageSquare,
  FileText,
  CircleDollarSign,
  Store,
  User
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
}

const DashboardSidebar = ({ isAdmin = false }: SidebarProps) => {
  const commonLinks = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: isAdmin ? "/admin-dashboard" : "/venue-dashboard" },
    { name: "Analytics", icon: <BarChart3 className="w-5 h-5" />, href: "#analytics" },
    { name: "Bookings", icon: <Calendar className="w-5 h-5" />, href: "#bookings" },
    { name: "Photos", icon: <Images className="w-5 h-5" />, href: "#photos" },
  ];

  const adminLinks = [
    { name: "Venues", icon: <Home className="w-5 h-5" />, href: "#venues" },
    { name: "Users", icon: <Users className="w-5 h-5" />, href: "#users" },
    { name: "Billing", icon: <CircleDollarSign className="w-5 h-5" />, href: "#billing" },
  ];

  const venueLinks = [
    { name: "Venue Settings", icon: <Store className="w-5 h-5" />, href: "#venue-settings" },
    { name: "Account Settings", icon: <User className="w-5 h-5" />, href: "#account-settings" },
    { name: "Support", icon: <MessageSquare className="w-5 h-5" />, href: "#support" },
    { name: "Invoices", icon: <FileText className="w-5 h-5" />, href: "#invoices" },
    { name: "Settings", icon: <Settings className="w-5 h-5" />, href: "#settings" },
  ];

  const links = isAdmin ? [...commonLinks, ...adminLinks] : [...commonLinks, ...venueLinks];

  return (
    <div className="flex h-screen flex-col border-r bg-white">
      <div className="flex h-16 items-center px-6 border-b">
        <NavLink to="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight text-glimps-900">
            Glimps
          </span>
          {isAdmin && <span className="ml-2 text-xs bg-glimps-900 text-white px-2 py-0.5 rounded-full">Admin</span>}
        </NavLink>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.href}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-lg px-3 py-2 transition-all
                ${isActive ? 'bg-glimps-50 text-glimps-900' : 'text-glimps-600 hover:bg-glimps-50 hover:text-glimps-900'}
              `}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <img
              src="/placeholder.svg"
              alt="User"
              className="h-8 w-8 rounded-full"
            />
            <div>
              <div className="text-sm font-medium">{isAdmin ? "Admin User" : "John Smith"}</div>
              <div className="text-xs text-glimps-600">{isAdmin ? "admin@glimps.com" : "john@thevenueclub.com"}</div>
            </div>
          </div>
        </div>
        <NavLink
          to="/"
          className="flex w-full items-center gap-3 rounded-lg bg-glimps-50 px-3 py-2 text-sm font-medium text-glimps-900 hover:bg-glimps-100 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </NavLink>
        <div className="mt-4 flex items-center justify-center">
          <a
            href="#help"
            className="text-xs text-glimps-600 hover:text-glimps-900 flex items-center gap-1"
          >
            <HelpCircle className="h-3 w-3" /> Help & Resources
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
