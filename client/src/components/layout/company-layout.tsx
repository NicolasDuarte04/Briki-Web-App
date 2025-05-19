import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileUp,
  BarChart4, 
  LineChart,
  Shield,
  Users, 
  Zap, 
  Code, 
  CreditCard, 
  HelpCircle,
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronDown,
  Settings,
  Search,
  Filter,
  Download
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
    name: "Upload Plans", 
    path: "/company-dashboard/upload", 
    icon: <FileUp className="w-5 h-5" /> 
  },
  { 
    name: "Competitive Analysis", 
    path: "/company-dashboard/analysis", 
    icon: <BarChart4 className="w-5 h-5" /> 
  },
  { 
    name: "Marketplace", 
    path: "/company-dashboard/marketplace", 
    icon: <Zap className="w-5 h-5" /> 
  },
  { 
    name: "API Integration", 
    path: "/company-dashboard/api", 
    icon: <Code className="w-5 h-5" />,
    comingSoon: true
  },
  { 
    name: "Billing", 
    path: "/company-dashboard/billing", 
    icon: <CreditCard className="w-5 h-5" />,
    comingSoon: true
  },
  { 
    name: "Settings", 
    path: "/company-dashboard/settings", 
    icon: <Settings className="w-5 h-5" />,
  },
];

/**
 * Copilot layout with enterprise SaaS styling for the insurance company portal
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

  // Component for the sidebar - designed to match the mockup
  const Sidebar = () => (
    <div className="hidden md:flex fixed top-0 left-0 h-screen w-56 bg-[#01101F] border-r border-[#0A2540]/50 flex-col">
      {/* Logo area */}
      <div className="p-5 flex items-center space-x-2">
        <LineChart className="h-6 w-6 text-[#33BFFF]" />
        <span className="text-xl font-bold bg-gradient-to-r from-white to-[#33BFFF] bg-clip-text text-transparent">
          briki<span className="font-normal text-[#33BFFF]">COPILOT</span>
        </span>
      </div>
      
      {/* Nav items */}
      <nav className="mt-8 px-3 flex-1">
        <div className="space-y-1.5">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.comingSoon ? "#" : item.path}
              className={`
                flex items-center px-3 py-2.5 rounded text-sm font-medium transition-all relative
                ${isActive(item.path) 
                  ? "bg-[#0A2540] text-white" 
                  : "text-gray-400 hover:bg-[#0A2540]/50 hover:text-white"}
              `}
              onClick={(e) => {
                if (item.comingSoon) {
                  e.preventDefault();
                }
              }}
            >
              <span className={`mr-3 ${isActive(item.path) ? 'text-[#33BFFF]' : 'text-gray-500'}`}>{item.icon}</span>
              {item.name}
              {item.comingSoon && (
                <span className="absolute right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#0A2540] text-[#33BFFF] border border-[#0074FF]/30">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* User profile area */}
      <div className="p-4 border-t border-[#0A2540] mt-auto">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 border border-[#0074FF]/30 bg-[#0A2540]">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
              alt={getCompanyName()}
            />
            <AvatarFallback className="text-xs font-medium text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden flex-1">
            <p className="text-sm font-medium text-white truncate">{getCompanyName()}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-[#0A2540]"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Component for the top NavBar
  const NavBar = () => (
    <header className="w-full bg-[#01101F]/95 backdrop-blur-lg border-b border-[#0A2540] sticky top-0 z-50 pl-0 md:pl-56">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Mobile logo */}
        <div className="flex items-center md:hidden">
          <LineChart className="h-5 w-5 text-[#33BFFF]" />
          <span className="ml-2 text-lg font-bold bg-gradient-to-r from-white to-[#33BFFF] bg-clip-text text-transparent">
            briki<span className="font-normal text-[#33BFFF]">COPILOT</span>
          </span>
        </div>
        
        {/* Page title - hidden on mobile */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        </div>
        
        {/* Actions area */}
        <div className="flex items-center space-x-3">
          {/* Upload button - visible on all pages */}
          <Button
            className="bg-[#1570EF] hover:bg-[#0E63D6] text-white hidden md:flex items-center"
            onClick={() => window.location.href = '/company-dashboard/upload'}
          >
            <FileUp className="h-4 w-4 mr-2" />
            Upload
          </Button>
          
          {/* Notification bell */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#33BFFF] ring-1 ring-[#01101F]"></span>
          </Button>
          
          {/* User dropdown - mobile only */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Avatar className="h-8 w-8 border border-[#0074FF]/30 bg-[#0A2540]">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
                      alt={getCompanyName()}
                    />
                    <AvatarFallback className="text-xs font-medium text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#01101F] border border-[#0A2540] text-white w-56">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-white">{getCompanyName()}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="border-[#0A2540]" />
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    className="cursor-pointer hover:bg-[#0A2540] text-gray-300 hover:text-white"
                    onClick={() => {
                      if (!item.comingSoon) {
                        window.location.href = item.path;
                      }
                    }}
                    disabled={item.comingSoon}
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    {item.name}
                    {item.comingSoon && (
                      <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#0A2540] text-[#33BFFF] border border-[#0074FF]/30">
                        Soon
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="border-[#0A2540]" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-[#0A2540] text-gray-300 hover:text-white"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-[#01101F] text-white">
      {/* Desktop sidebar */}
      <Sidebar />
      
      {/* Main content wrapper */}
      <div className="md:pl-56">
        <NavBar />
        
        {/* Mobile menu sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-full max-w-xs p-0 bg-[#01101F] border-r border-[#0A2540] text-white">
            <div className="flex flex-col h-full">
              <div className="p-5 flex items-center space-x-2 border-b border-[#0A2540]">
                <LineChart className="h-6 w-6 text-[#33BFFF]" />
                <span className="text-xl font-bold bg-gradient-to-r from-white to-[#33BFFF] bg-clip-text text-transparent">
                  briki<span className="font-normal text-[#33BFFF]">COPILOT</span>
                </span>
              </div>
              
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.comingSoon ? "#" : item.path}
                      className={`
                        flex items-center px-3 py-2.5 rounded text-sm font-medium transition-all relative
                        ${isActive(item.path) 
                          ? "bg-[#0A2540] text-white" 
                          : "text-gray-400 hover:bg-[#0A2540]/50 hover:text-white"}
                      `}
                      onClick={(e) => {
                        if (item.comingSoon) {
                          e.preventDefault();
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <span className={`mr-3 ${isActive(item.path) ? 'text-[#33BFFF]' : 'text-gray-500'}`}>{item.icon}</span>
                      {item.name}
                      {item.comingSoon && (
                        <span className="absolute right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#0A2540] text-[#33BFFF] border border-[#0074FF]/30">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>
              
              <div className="p-4 border-t border-[#0A2540] mt-auto">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 border border-[#0074FF]/30 bg-[#0A2540]">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
                      alt={getCompanyName()}
                    />
                    <AvatarFallback className="text-xs font-medium text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 overflow-hidden flex-1">
                    <p className="text-sm font-medium text-white truncate">{getCompanyName()}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-[#0A2540]"
                    onClick={() => {
                      logoutMutation.mutate();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Main content area */}
        <main className="p-4 md:p-6 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}