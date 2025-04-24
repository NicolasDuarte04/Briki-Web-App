import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Bell, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useLanguage, LanguageSelector } from "@/components/language-selector";

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
  const [, navigate] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  
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
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="briki-logo">
                briki
                <span className="checkmark">✓</span>
              </h1>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link href="/" className={`hover:text-primary px-3 py-2 text-sm font-medium ${isActivePath("/")}`}>
              {t('home')}
            </Link>
            <Link href="/trip-info" className={`hover:text-primary px-3 py-2 text-sm font-medium ${isActivePath("/trip-info")}`}>
              {t('myTrips')}
            </Link>
            <Link href="/insurance-plans" className={`hover:text-primary px-3 py-2 text-sm font-medium ${isActivePath("/insurance-plans")}`}>
              {t('insurancePlans')}
            </Link>
            <Link href="/" className={`hover:text-primary px-3 py-2 text-sm font-medium ${isActivePath("/support")}`}>
              {t('support')}
            </Link>
            <LanguageSelector />
          </div>
          
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : user ? (
            <div className="flex items-center">
              <div className="flex-shrink-0 ml-4">
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
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
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
                className="text-gray-500 hover:text-primary"
              >
                {t('signIn')}
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="ml-2"
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
                      <span className="checkmark">✓</span>
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
                      href="/trip-info" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/trip-info") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('myTrips')}
                    </Link>
                    <Link 
                      href="/insurance-plans" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/insurance-plans") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('insurancePlans')}
                    </Link>
                    <Link 
                      href="/" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${isActivePath("/support") ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t('support')}
                    </Link>
                    <div className="mt-2 px-3 py-2">
                      <LanguageSelector />
                    </div>
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
                        <div className="mt-3 space-y-1">
                          <Button variant="ghost" className="w-full justify-start text-gray-500">
                            <User className="mr-2 h-4 w-4" />
                            Your Profile
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-gray-500">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
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
                    <div className="pt-4 pb-3 border-t border-gray-200 mt-4">
                      <div className="space-y-1">
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate("/auth");
                            setIsOpen(false);
                          }}
                          className="w-full mb-2"
                        >
                          {t('signIn')}
                        </Button>
                        <Button
                          onClick={() => {
                            navigate("/auth");
                            setIsOpen(false);
                          }}
                          className="w-full"
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
