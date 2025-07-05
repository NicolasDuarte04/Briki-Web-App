import React, { useState } from "react";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileUp,
  Eye, 
  MessageSquareQuote,
  Code, 
  CreditCard, 
  HelpCircle,
  BarChart,
  LogOut,
  Menu
} from "lucide-react";
import { useSupabaseAuth } from "../../contexts/SupabaseAuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { AuthenticatedLayout } from "./";
import { Link } from "wouter";

type CompanyLayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
  activeNav?: string;
};

const navItems = [
  { 
    name: "Dashboard", 
    path: "/company-dashboard", 
    id: "dashboard",
    icon: <LayoutDashboard className="w-5 h-5" /> 
  },
  { 
    name: "Upload Quote", 
    path: "/company-dashboard/upload", 
    id: "upload",
    icon: <FileUp className="w-5 h-5" /> 
  },
  { 
    name: "Plan Management", 
    path: "/company-plans", 
    id: "plans",
    icon: <BarChart className="w-5 h-5" /> 
  },
  { 
    name: "Preview Placement", 
    path: "/company-dashboard/preview", 
    id: "preview",
    icon: <Eye className="w-5 h-5" /> 
  },
  { 
    name: "Request Pilot", 
    path: "/company-dashboard/request-pilot", 
    id: "request-pilot",
    icon: <MessageSquareQuote className="w-5 h-5" /> 
  },
  {
    name: "Settings",
    path: "/company-dashboard/settings",
    id: "settings",
    icon: <HelpCircle className="w-5 h-5" />
  },
  { 
    name: "API Integration", 
    path: "/company-dashboard/api", 
    id: "api",
    icon: <Code className="w-5 h-5" />,
    comingSoon: true
  },
  { 
    name: "Billing & Invoicing", 
    path: "/company-dashboard/billing", 
    id: "billing",
    icon: <CreditCard className="w-5 h-5" />,
    comingSoon: true
  }
];

/**
 * Company layout with the futuristic navy-based color palette for the B2B portal
 * Wrapped in AuthenticatedLayout to maintain consistent layout hierarchy
 */
export default function CompanyLayout({ children, pageTitle = "Dashboard", activeNav = "dashboard" }: CompanyLayoutProps) {
  const [location] = useLocation();
  const { user, signOut } = useSupabaseAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active nav helper
  const isActiveNav = (id: string) => id === activeNav;

  // Get company name or fallback to username
  const getCompanyName = () => {
    if (!user) return "Company";

    // Access company profile as a property if available
    const company = (user as any).companyProfile?.name;
    if (company) {
      return company;
    }

    return user.name || user.email.split('@')[0];
  };

  // Get user initials for avatar
  const getInitials = () => {
    const name = getCompanyName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#001A40] via-[#00142E] to-black text-white">
        {/* Mobile menu sheet for B2B-specific navigation */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed bottom-4 right-4 z-50 bg-[#002C7A] text-white shadow-[0_0_15px_rgba(51,191,255,0.3)] hover:bg-[#003087]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-md bg-[#001A40] border-r border-[#002C7A] text-white">
            <SheetHeader className="border-b border-[#002C7A] pb-6 mb-6">
              <SheetTitle className="text-left">
                <div className="flex items-center">
                  <span className="text-xl font-bold">
                    Briki Pilot
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Partner Portal</p>
              </SheetTitle>
            </SheetHeader>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.comingSoon ? "#" : item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors relative
                    ${isActiveNav(item.id) 
                      ? "bg-[#002C7A] text-white" 
                      : "text-gray-300 hover:bg-[#001E47] hover:text-white"}
                  `}
                  onClick={(e) => {
                    if (item.comingSoon) {
                      e.preventDefault();
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <span className="mr-3 text-[#33BFFF]">{item.icon}</span>
                  {item.name}
                  {item.comingSoon && (
                    <span className="absolute right-4 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#002C7A] text-[#33BFFF] border border-[#0074FF]/30">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-[#002C7A]">
              <div className="flex items-center mb-6">
                <Avatar className="h-8 w-8 border border-[#0074FF]/30 bg-[#002C7A]">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
                    alt={getCompanyName()}
                  />
                  <AvatarFallback className="text-xs font-medium text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{getCompanyName()}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#002C7A]"
                onClick={async () => {
                  await signOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}