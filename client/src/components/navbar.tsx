import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/language-selector";

export default function Navbar() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    if (user) {
      navigate("/trip-info");
    } else {
      navigate("/auth");
    }
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

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={handleGetStarted}
                className="text-gray-600 hover:text-primary px-4 py-2.5"
              >
                {t('signIn')}
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="px-5 py-2.5 font-medium shadow-sm"
              >
                {t('signUp')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}