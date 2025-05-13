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
  ChevronDown
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
    path: "/company-dashboard", 
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

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active path helper
  const isActive = (path: string) => location === path || location.startsWith(path);

  // Get company name or fallback to username
  const getCompanyName = () => {
    if (!user) return "Company";
    
    if (user.companyProfile?.name) {
      return user.companyProfile.name;
    }
    
    return user.username;
  };

  // Get user initials for avatar
  const getInitials = () => {
    const name = getCompanyName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-sky-50/50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="briki-logo text-blue-600">briki</h1>
          <p className="text-sm text-gray-500 mt-1">Partner Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.comingSoon ? "#" : item.path}
              className={`
                flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors relative
                ${isActive(item.path) 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
              `}
              onClick={(e) => {
                if (item.comingSoon) {
                  e.preventDefault();
                }
              }}
            >
              <span className="mr-3 text-blue-600">{item.icon}</span>
              {item.name}
              {item.comingSoon && (
                <span className="absolute right-4 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
                alt={getCompanyName()}
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-800 truncate">{getCompanyName()}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar for mobile & desktop */}
        <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between lg:justify-end shadow-sm">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Mobile menu sheet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent side="left" className="sm:max-w-md bg-white">
              <SheetHeader className="border-b border-gray-200 pb-6 mb-6">
                <SheetTitle className="text-left">
                  <h1 className="briki-logo text-blue-600">briki</h1>
                  <p className="text-sm text-gray-500 mt-1">Partner Portal</p>
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
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                    `}
                    onClick={(e) => {
                      if (item.comingSoon) {
                        e.preventDefault();
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    <span className="mr-3 text-blue-600">{item.icon}</span>
                    {item.name}
                    {item.comingSoon && (
                      <span className="absolute right-4 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex items-center mb-6">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
                      alt={getCompanyName()}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-800 truncate">{getCompanyName()}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
          
          {/* Right side of navbar */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="ml-2 text-gray-500 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </Button>
            
            {/* Only show profile dropdown on desktop (sidebar already has it) */}
            <div className="hidden md:block ml-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex text-sm rounded-full">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
                        alt={getCompanyName()}
                      />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-700">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-sky-50/50 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}