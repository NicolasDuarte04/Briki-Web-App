import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLORS } from "@/config";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/language-selector";
import Footer from "@/components/footer";
import { 
  Menu, 
  X, 
  User,
  Settings,
  LogOut,
  Loader2,
  Bell,
  Bot,
  ChevronDown,
} from "lucide-react";
import { useAIAssistantUI } from "@/components/layout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

/**
 * Main layout component for B2C screens providing:
 * - Unified header with smooth scroll behavior
 * - Authentication state handling
 * - Navigation and user menu
 * - Footer (optional)
 */
export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toggleAssistant } = useAIAssistantUI();
  
  // Check if current page should show AI Assistant
  const excludedPaths = ['/', '/auth', '/countdown', '/login', '/register', '/terms', '/learn-more', '/landing'];
  const showAIAssistant = user && !excludedPaths.some(path => location === path || location.startsWith(`${path}/`));
  
  // Handle scroll effect for transparent-to-solid transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check initial position in case page is loaded scrolled
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name) {
      return user.name[0].toUpperCase();
    }
    
    return user.username[0].toUpperCase();
  };
  
  // Active path helper
  const isActivePath = (path: string) => {
    if (location === path) {
      return "text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600";
    }
    return "text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent hover:border-blue-600/50";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - transitions from transparent to solid on scroll */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 dark:bg-gray-900/90 shadow-sm backdrop-blur-md" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center mr-10">
                <h1 className="briki-logo text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  briki
                </h1>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <Link href="/insurance-plans" className={`px-4 py-2 text-sm font-medium transition-colors ${isActivePath("/insurance-plans")}`}>
                  {t('travelInsurance')}
                </Link>
                <Link href="/auto-insurance" className={`px-4 py-2 text-sm font-medium transition-colors ${isActivePath("/auto-insurance")}`}>
                  {t('autoInsurance')}
                </Link>
                <Link href="/pet-insurance" className={`px-4 py-2 text-sm font-medium transition-colors ${isActivePath("/pet-insurance")}`}>
                  {t('petInsurance')}
                </Link>
                <Link href="/health-insurance" className={`px-4 py-2 text-sm font-medium transition-colors ${isActivePath("/health-insurance")}`}>
                  {t('healthInsurance')}
                </Link>
              </nav>
            </div>
            
            {/* User Menu Section */}
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* B2B Link for logged-in users */}
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/company")}
                  className="hidden md:flex items-center px-3 py-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                  size="sm"
                >
                  For Companies
                </Button>
                
                {/* AI Assistant Button */}
                {showAIAssistant && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative p-2 rounded-full text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    onClick={toggleAssistant}
                  >
                    <span className="sr-only">Open AI Assistant</span>
                    <Bot className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900"></span>
                  </Button>
                )}
                
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative p-2 rounded-full text-foreground/50 hover:text-foreground/70 hover:bg-gray-100 dark:hover:bg-gray-800/20">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                </Button>
                
                {/* User Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex text-sm rounded-full focus:outline-none items-center gap-1 pl-1 pr-2 py-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`}
                          alt={user.username}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-4 py-3">
                      <p className="text-sm">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer" 
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    {showAIAssistant && (
                      <DropdownMenuItem 
                        className="cursor-pointer" 
                        onClick={() => navigate("/ai-assistant")}
                      >
                        <Bot className="mr-2 h-4 w-4" />
                        <span>AI Assistant</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* B2B Link for non-logged-in users */}
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/company")}
                  className="hidden md:flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 border border-blue-300 bg-white hover:bg-blue-50 hover:text-blue-800 transition-all shadow-sm rounded-md"
                >
                  <span>For Insurance Companies</span>
                  <span className="ml-2 text-xs opacity-70">→</span>
                </Button>
                
                {/* Auth Buttons */}
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/auth")}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm"
                >
                  {t('signIn')}
                </Button>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm px-4 py-2 text-sm font-medium hover:shadow"
                >
                  {t('signUp')}
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500">
                    <span className="sr-only">Open main menu</span>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>
                      <h1 className="briki-logo text-2xl">
                        briki
                      </h1>
                    </SheetTitle>
                  </SheetHeader>
                  
                  {/* Mobile navigation links */}
                  <div className="py-4">
                    <div className="space-y-1">
                      <Link 
                        href="/insurance-plans" 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/insurance-plans" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {t('travelInsurance')}
                      </Link>
                      <Link 
                        href="/auto-insurance" 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/auto-insurance" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {t('autoInsurance')}
                      </Link>
                      <Link 
                        href="/pet-insurance" 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/pet-insurance" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {t('petInsurance')}
                      </Link>
                      <Link 
                        href="/health-insurance" 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/health-insurance" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {t('healthInsurance')}
                      </Link>
                      
                      {/* No account yet? Links */}
                      {!user && (
                        <>
                          <div className="border-t border-gray-200 my-4"></div>
                          <Link 
                            href="/company-login" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsOpen(false)}
                          >
                            For Insurance Companies
                          </Link>
                          <Link 
                            href="/auth" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                          >
                            {t('signIn')} / {t('signUp')}
                          </Link>
                        </>
                      )}
                    </div>
                    
                    {/* User info in mobile menu */}
                    {user && (
                      <>
                        <div className="pt-4 pb-3 border-t border-gray-200 mt-4">
                          <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                              <Avatar>
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`}
                                  alt={user.username}
                                />
                                <AvatarFallback>{getUserInitials()}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3">
                              <div className="text-base font-medium text-gray-800">{user.username}</div>
                              <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          
                          {/* Mobile menu AI Assistant button */}
                          {showAIAssistant && (
                            <div className="flex items-center px-4 pb-2 mt-3">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-2"
                                onClick={() => {
                                  toggleAssistant();
                                  setIsOpen(false);
                                }}
                              >
                                <Bot className="h-4 w-4" />
                                Chat with AI Assistant
                              </Button>
                            </div>
                          )}
                          
                          {/* Mobile menu user actions */}
                          <div className="mt-3 space-y-1">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-gray-500"
                              onClick={() => {
                                navigate("/profile");
                                setIsOpen(false);
                              }}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Your Profile
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-gray-500"
                              onClick={() => {
                                navigate("/settings");
                                setIsOpen(false);
                              }}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Button>
                            
                            {showAIAssistant && (
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-gray-500"
                                onClick={() => {
                                  navigate("/ai-assistant");
                                  setIsOpen(false);
                                }}
                              >
                                <Bot className="mr-2 h-4 w-4" />
                                AI Assistant
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-gray-500"
                              onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                              }}
                              disabled={logoutMutation.isPending}
                            >
                              {logoutMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <LogOut className="mr-2 h-4 w-4" />
                              )}
                              Sign out
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with AnimatePresence for smooth page transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location}
          className="flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer (optional) */}
      {showFooter && <Footer />}
    </div>
  );
}