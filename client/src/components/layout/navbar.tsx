import { Link, useLocation } from "wouter";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage, LanguageSelector } from "../language-selector";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    if (user) {
      navigate("/trip-info");
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    
    // Skip firstName/lastName check as they may not exist on User type
    
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    
    return user.email ? user.email[0].toUpperCase() : "U";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow transition border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="briki-logo text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                briki
              </h1>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-1 md:space-x-2">
            <Link href="/features" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/ask-briki" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
              Ask Briki
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
              Blog
            </Link>
            <Link href="/forum" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
              Forum
            </Link>
            <Link href="/careers" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
              Careers
            </Link>
          </div>

          {/* Auth buttons and language selector */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            {user ? (
              // Authenticated user menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={(user.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`)} 
                        alt={(user.name || user.username) || ''} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name || user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Non-authenticated buttons
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                  onClick={() => navigate("/auth")}
                className="text-gray-600 hover:text-primary px-4 py-2.5"
              >
                  {t('signIn') || 'Iniciar sesión'}
              </Button>
              <Button 
                  onClick={() => navigate("/auth")}
                className="px-5 py-2.5 font-medium shadow-sm"
              >
                  {t('signUp') || 'Crear cuenta'}
              </Button>
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 