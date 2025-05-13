import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Bell, Menu, X, User, Settings, LogOut, Bot, SparklesIcon } from "lucide-react";
import { useLanguage, LanguageSelector } from "@/components/language-selector";
import { AIAssistantButton } from "@/components/layout";
import { useAIAssistantUI } from "@/components/layout";

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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toggleAssistant } = useAIAssistantUI();
  
  // Check if current page should show AI Assistant
  const excludedPaths = ['/', '/auth', '/countdown', '/login', '/register', '/terms', '/learn-more'];
  const showAIAssistant = user && !excludedPaths.some(path => location === path || location.startsWith(`${path}/`));
  
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
    return currentPath === path ? "text-primary" : "text-gray-500";
  };

  return (
    <nav className="bg-white/80 dark:bg-black/20 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400">
                briki
              </h1>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
            <Link href="/" className={`hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-colors ${currentPath === "/" ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-foreground/70"}`}>
              {t('home')}
            </Link>
            <Link href="/insurance-plans" className={`hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-colors ${currentPath === "/insurance-plans" ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-foreground/70"}`}>
              {t('travelInsurance')}
            </Link>
            <Link href="/auto-insurance" className={`hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-colors ${currentPath === "/auto-insurance" ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-foreground/70"}`}>
              {t('autoInsurance')}
            </Link>
            <Link href="/pet-insurance" className={`hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-colors ${currentPath === "/pet-insurance" ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-foreground/70"}`}>
              {t('petInsurance')}
            </Link>
            <Link href="/health-insurance" className={`hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-colors ${currentPath === "/health-insurance" ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-foreground/70"}`}>
              {t('healthInsurance')}
            </Link>
            <Link href="/support" className={`hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-colors ${currentPath === "/support" ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-foreground/70"}`}>
              {t('support')}
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : user ? (
            <div className="flex items-center">
              {showAIAssistant && (
                <div className="flex-shrink-0 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative p-2 rounded-full text-gray-400 hover:text-gray-500"
                    onClick={toggleAssistant}
                  >
                    <span className="sr-only">Open AI Assistant</span>
                    <Bot className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
                  </Button>
                </div>
              )}
              
              <div className="flex-shrink-0 ml-2">
                <Button variant="ghost" size="icon" className="relative p-2 rounded-full text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </Button>
              </div>
              
              <div className="ml-3 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex text-sm rounded-full focus:outline-none">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`}
                          alt={user.username}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                    <DropdownMenuItem 
                      className="cursor-pointer" 
                      onClick={() => navigate("/ai-assistant")}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      <span>AI Assistant</span>
                    </DropdownMenuItem>
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
            </div>
          ) : (
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="text-foreground/70 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {t('signIn')}
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="ml-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-0"
              >
                {t('signUp')}
              </Button>
            </div>
          )}
          
          <div className="flex items-center sm:hidden">
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
                    <h1 className="briki-logo">
                      briki
                    </h1>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-1">
                    <Link 
                      href="/" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('home')}
                    </Link>
                    <Link 
                      href="/insurance-plans" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/insurance-plans") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('travelInsurance')}
                    </Link>
                    <Link 
                      href="/auto-insurance" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/auto-insurance") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('autoInsurance')}
                    </Link>
                    <Link 
                      href="/pet-insurance" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/pet-insurance") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('petInsurance')}
                    </Link>
                    <Link 
                      href="/health-insurance" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/health-insurance") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('healthInsurance')}
                    </Link>
                    <Link 
                      href="/support" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/support") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('support')}
                    </Link>
                  </div>
                  
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
                        {showAIAssistant && (
                          <div className="flex items-center px-4 pb-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={() => {
                                toggleAssistant();
                                setIsOpen(false);
                              }}
                            >
                              <SparklesIcon className="h-4 w-4" />
                              Chat with AI Assistant
                            </Button>
                          </div>
                        )}
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
                            onClick={handleLogout}
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
                  
                  {!user && !isLoading && (
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800 mt-4">
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate("/auth");
                            setIsOpen(false);
                          }}
                          className="w-full mb-2 border-violet-200 dark:border-violet-900 text-violet-700 dark:text-violet-300"
                        >
                          {t('signIn')}
                        </Button>
                        <Button
                          onClick={() => {
                            navigate("/auth");
                            setIsOpen(false);
                          }}
                          className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-0"
                        >
                          {t('signUp')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
