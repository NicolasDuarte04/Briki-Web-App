import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileUp,
  Eye, 
  MessageSquareQuote,
  Users, 
  BarChart, 
  Code, 
  CreditCard, 
  HelpCircle,
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronDown,
  BriefcaseBusiness,
  Search
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type CompanyLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { 
    name: "Dashboard", 
    path: "/company-dashboard-redesigned", 
    icon: <LayoutDashboard className="w-5 h-5" /> 
  },
  { 
    name: "Upload Quote", 
    path: "/company-dashboard/upload", 
    icon: <FileUp className="w-5 h-5" /> 
  },
  { 
    name: "Preview Placement", 
    path: "/company-dashboard/preview", 
    icon: <Eye className="w-5 h-5" /> 
  },
  { 
    name: "Request Pilot", 
    path: "/company-dashboard/request-pilot", 
    icon: <MessageSquareQuote className="w-5 h-5" /> 
  },
  { 
    name: "API Integration", 
    path: "/company-dashboard/api", 
    icon: <Code className="w-5 h-5" />,
    comingSoon: true
  },
  { 
    name: "Billing & Invoicing", 
    path: "/company-dashboard/billing", 
    icon: <CreditCard className="w-5 h-5" />,
    comingSoon: true
  },
  { 
    name: "Support & FAQ", 
    path: "/company-dashboard/support", 
    icon: <HelpCircle className="w-5 h-5" />,
    comingSoon: true
  },
];

/**
 * Company layout with the futuristic navy-based color palette for the B2B portal
 */
export default function CompanyLayout({ children }: CompanyLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active path helper
  const isActive = (path: string) => location === path || location.startsWith(path);

  // Get company name or fallback to username
  const getCompanyName = () => {
    if (!user) return "Company";
    
    // Access company profile as a property if available
    const company = (user as any).companyProfile?.name;
    if (company) {
      return company;
    }
    
    return user.username || user.email.split('@')[0];
  };

  // Get user initials for avatar
  const getInitials = () => {
    const name = getCompanyName();
    return name.charAt(0).toUpperCase();
  };

  // Component for the top NavBar - designed to match the one in briki-pilot-portal.tsx
  const NavBar = () => (
    <header className="w-full bg-[#001A40]/90 backdrop-blur-lg border-b border-[#002C7A] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-[#003087] to-[#0074FF] rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(51,191,255,0.3)]">
                  <BriefcaseBusiness className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-white via-[#33BFFF] to-white bg-clip-text text-transparent">
                  Briki Pilot
                </span>
              </div>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link href="/company-dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/company-dashboard') ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                  Dashboard
                </Link>
                <Link href="/company-dashboard/upload" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/company-dashboard/upload') ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                  Upload
                </Link>
                <Link href="/company-dashboard/preview" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/company-dashboard/preview') ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                  Preview
                </Link>
                <Link href="/company-dashboard/request-pilot" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/company-dashboard/request-pilot') ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                  Request
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-white transition-colors duration-200">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-1 rounded-full text-gray-400 hover:text-white transition-colors duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#33BFFF] ring-1 ring-[#001A40]"></span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Avatar className="h-8 w-8 border border-[#0074FF]/30 bg-[#002C7A]">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
                      alt={getCompanyName()}
                    />
                    <AvatarFallback className="text-xs font-medium text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium text-gray-300 hidden sm:block">
                    {getCompanyName()}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#001A40] border border-[#002C7A] text-white">
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="border-[#002C7A]" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-[#002C7A] text-gray-300 hover:text-white focus:bg-[#002C7A] focus:text-white"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001A40] via-[#00142E] to-black text-white">
      <NavBar />
      
      {/* Mobile menu sheet */}
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
                <div className="h-8 w-8 bg-gradient-to-r from-[#003087] to-[#0074FF] rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(51,191,255,0.3)]">
                  <BriefcaseBusiness className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-white via-[#33BFFF] to-white bg-clip-text text-transparent">
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
                  ${isActive(item.path) 
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
              onClick={() => {
                logoutMutation.mutate();
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
  );
}