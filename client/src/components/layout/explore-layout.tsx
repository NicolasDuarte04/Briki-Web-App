import { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Linkedin, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";

interface ExploreLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
}

export function ExploreLayout({
  children,
  title = "Briki Insurance",
  description = "Compare insurance options for travel, auto, pet, and health coverage in Colombia and Mexico.",
  ogImage = "/og-image.jpg",
  ogType = "website",
  ogUrl,
}: ExploreLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* SEO and OpenGraph tags using React Helmet */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {ogUrl && <meta property="og:url" content={ogUrl} />}
        <meta property="og:site_name" content="Briki" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.h1
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-2xl md:text-3xl font-bold tracking-tighter bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent drop-shadow-md cursor-pointer"
            >
              briki
            </motion.h1>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore/travel" className="text-gray-600 hover:text-primary transition-colors">
              Travel Insurance
            </Link>
            <Link href="/explore/auto" className="text-gray-600 hover:text-primary transition-colors">
              Auto Insurance
            </Link>
            <Link href="/explore/pet" className="text-gray-600 hover:text-primary transition-colors">
              Pet Insurance
            </Link>
            <Link href="/explore/health" className="text-gray-600 hover:text-primary transition-colors">
              Health Insurance
            </Link>
            <Link href="/company" className="text-gray-600 hover:text-primary transition-colors">
              For Companies
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Sign In / Sign Up Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <button className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/auth">
              <button className="px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-gray-100 shadow-md"
          >
            <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
              <Link href="/explore/travel" className="py-2 text-gray-600 hover:text-primary transition-colors">
                Travel Insurance
              </Link>
              <Link href="/explore/auto" className="py-2 text-gray-600 hover:text-primary transition-colors">
                Auto Insurance
              </Link>
              <Link href="/explore/pet" className="py-2 text-gray-600 hover:text-primary transition-colors">
                Pet Insurance
              </Link>
              <Link href="/explore/health" className="py-2 text-gray-600 hover:text-primary transition-colors">
                Health Insurance
              </Link>
              <Link href="/company" className="py-2 text-gray-600 hover:text-primary transition-colors">
                For Companies
              </Link>
              <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
                <Link href="/auth">
                  <button className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Briki</h3>
              <p className="text-gray-400 mb-4">
                Smart insurance solutions for modern life.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/briki_app?igsh=MW1mcmExM3UxcThrag==&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/company/brikiapp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Insurance</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/explore/travel" className="text-gray-400 hover:text-white transition-colors">
                    Travel Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/explore/auto" className="text-gray-400 hover:text-white transition-colors">
                    Auto Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/explore/pet" className="text-gray-400 hover:text-white transition-colors">
                    Pet Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/explore/health" className="text-gray-400 hover:text-white transition-colors">
                    Health Insurance
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/company" className="text-gray-400 hover:text-white transition-colors">
                    For Companies
                  </Link>
                </li>
                <li>
                  <Link href="/contact-sales" className="text-gray-400 hover:text-white transition-colors">
                    Contact Sales
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Briki. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}