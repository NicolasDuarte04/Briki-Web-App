import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Bell, Menu, User, Settings, LogOut, Bot, SparklesIcon, ChevronDown } from "lucide-react";
import { useLanguage, LanguageSelector } from "@/components/language-selector";
import { AIAssistantButton } from "@/components/layout";
import { useAIAssistantUI } from "@/components/layout";
import GlassCard from "@/components/glass-card";
import GradientButton from "@/components/gradient-button";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NavbarNew() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toggleAssistant } = useAIAssistantUI();
  
  // Check if current page should show AI Assistant
  const excludedPaths = ['/', '/auth', '/countdown', '/login', '/register', '/terms', '/learn-more'];
  const showAIAssistant = user && !excludedPaths.some(path => location === path || location.startsWith(`${path}/`));
  
  // Handle scroll effect for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
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
  const [currentPath] = useLocation();
  const isActivePath = (path: string) => {
    return currentPath === path || 
      (path !== '/' && currentPath.startsWith(path));
  };

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md border-b border-blue-100/50 dark:border-blue-500/20" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.h1
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="text-2xl md:text-3xl font-bold tracking-tighter bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent drop-shadow-md"
              >
                briki
              </motion.h1>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center space-x-1">
            {['home', 'travelInsurance', 'autoInsurance', 'petInsurance', 'healthInsurance'].map((item, index) => {
              const paths = ['/', '/explore/travel', '/explore/auto', '/explore/pet', '/explore/health'];
              const active = isActivePath(paths[index]);
              
              return (
                <Link 
                  key={item} 
                  href={paths[index]}
                  className="relative group"
                >
                  <motion.div
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      active 
                        ? "text-primary" 
                        : "text-foreground/70 hover:text-primary"
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {t(item)}
                    {active && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
            
            {/* For company dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2 text-sm font-medium flex items-center gap-1 text-foreground/70 hover:text-primary rounded-lg">
                  {t('forCompanies')}
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-lg">
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate("/company")}
                >
                  <span>Overview</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate("/company-dashboard")}
                >
                  <span>Partner Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate("/briki-pilot")}
                >
                  <span>Briki Pilot Portal</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate("/contact-sales")}
                >
                  <span>Contact Sales</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* User actions area */}
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-1 md:gap-2">
              {showAIAssistant && (
                <motion.div 
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative p-2 rounded-full text-primary hover:bg-primary/10 active:bg-primary/15"
                    onClick={toggleAssistant}
                  >
                    <span className="sr-only">Open AI Assistant</span>
                    <Bot className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-gray-900"></span>
                  </Button>
                </motion.div>
              )}
              
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative p-2 rounded-full text-foreground/50 hover:text-foreground/70 hover:bg-gray-100/50 dark:hover:bg-gray-800/20"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                </Button>
              </motion.div>
              
              <div className="ml-1 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className="flex items-center gap-2 rounded-full focus:outline-none"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar className="h-8 w-8 border-2 border-white/50 shadow-md">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`}
                          alt={user.username}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 mt-1 bg-white/90 backdrop-blur-lg border border-primary/10 rounded-xl shadow-lg"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4 text-primary/70" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5" 
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4 text-primary/70" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5" 
                      onClick={() => navigate("/ai-assistant")}
                    >
                      <SparklesIcon className="mr-2 h-4 w-4 text-primary/70" />
                      <span>AI Assistant</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-destructive/70" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4 text-destructive/70" />
                      )}
                      <span className="text-destructive/80">Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/company")}
                className="hidden lg:flex items-center justify-center px-4 py-2 text-sm font-medium text-primary/90 border border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm rounded-lg"
              >
                <span>{t('forCompanies')}</span>
                <span className="ml-2 text-xs opacity-70">→</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/auth")}
                    className="text-foreground/60 hover:text-primary"
                  >
                    {t('signIn')}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <GradientButton 
                    onClick={() => navigate("/auth")}
                    className="ml-2 shadow-md"
                    size="sm"
                  >
                    {t('signUp')}
                  </GradientButton>
                </motion.div>
              </div>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white/95 backdrop-blur-xl border-l border-primary/10 pt-8">
                <SheetHeader className="mb-6">
                  <SheetTitle>
                    <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent drop-shadow-md">
                      briki
                    </h1>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    {[
                      { name: 'home', path: '/' },
                      { name: 'travelInsurance', path: '/explore/travel' },
                      { name: 'autoInsurance', path: '/explore/auto' },
                      { name: 'petInsurance', path: '/explore/pet' },
                      { name: 'healthInsurance', path: '/explore/health' },
                    ].map((item) => (
                      <motion.div
                        key={item.name}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Link 
                          href={item.path} 
                          className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                            isActivePath(item.path) 
                              ? "bg-primary/10 text-primary" 
                              : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {t(item.name)}
                        </Link>
                      </motion.div>
                    ))}
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Link 
                        href="/company" 
                        className="block px-3 py-2.5 rounded-md text-base font-medium text-foreground/70 hover:bg-primary/5 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('forCompanies')}
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Link 
                        href="/briki-pilot" 
                        className="block px-3 py-2.5 ml-3 rounded-md text-base font-medium text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100/80"
                        onClick={() => setIsOpen(false)}
                      >
                        Briki Pilot Portal
                      </Link>
                    </motion.div>
                  </div>
                  
                  {user ? (
                    <>
                      <div className="pt-6 pb-3 border-t border-primary/10 mt-6">
                        <div className="flex items-center px-4">
                          <div className="flex-shrink-0">
                            <Avatar className="border-2 border-white/50 shadow-md">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`}
                                alt={user.username}
                              />
                              <AvatarFallback>{getUserInitials()}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium text-foreground">{user.username}</div>
                            <div className="text-sm font-medium text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        
                        {showAIAssistant && (
                          <div className="mt-5 px-4">
                            <GradientButton
                              variant="primary"
                              size="sm"
                              className="w-full gap-2 shadow-md"
                              onClick={() => {
                                toggleAssistant();
                                setIsOpen(false);
                              }}
                              icon={<SparklesIcon className="h-4 w-4" />}
                            >
                              Chat with AI Assistant
                            </GradientButton>
                          </div>
                        )}
                        
                        <div className="mt-5 space-y-2">
                          {[
                            { name: 'Your Profile', icon: User, path: '/profile' },
                            { name: 'Settings', icon: Settings, path: '/settings' },
                            ...(showAIAssistant ? [{ name: 'AI Assistant', icon: Bot, path: '/ai-assistant' }] : []),
                          ].map((item) => (
                            <motion.div
                              key={item.name}
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-foreground/70 hover:text-primary hover:bg-primary/5"
                                onClick={() => {
                                  navigate(item.path);
                                  setIsOpen(false);
                                }}
                              >
                                <item.icon className="mr-2 h-4 w-4 text-primary/70" />
                                {item.name}
                              </Button>
                            </motion.div>
                          ))}
                          
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-destructive/80 hover:text-destructive hover:bg-destructive/10"
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
                          </motion.div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 pt-6 border-t border-primary/10">
                      <GradientButton
                        onClick={() => {
                          navigate("/auth");
                          setIsOpen(false);
                        }}
                        className="w-full mb-3"
                      >
                        {t('signUp')}
                      </GradientButton>
                      <Button 
                        variant="outline"
                        className="w-full border-primary/20 text-foreground/70" 
                        onClick={() => {
                          navigate("/auth");
                          setIsOpen(false);
                        }}
                      >
                        {t('signIn')}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}