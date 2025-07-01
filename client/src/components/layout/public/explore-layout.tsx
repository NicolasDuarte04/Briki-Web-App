import { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Linkedin, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigation } from "../../../lib/navigation";

interface ExploreLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
}

/**
 * Public-facing layout for SEO-friendly explore pages
 * Used for non-authenticated visitors to view insurance offerings
 */
export function ExploreLayout({
  children,
  title = "Briki Insurance",
  description = "Compare insurance options for travel, auto, pet, and health coverage in Colombia and Mexico.",
  ogType = "website",
  ogImage,
  ogUrl,
}: ExploreLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigateToInsuranceCategory } = useNavigation();

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
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">briki</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Home
            </Link>
            <Link href="/explore/travel" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Travel Insurance
            </Link>
            <Link href="/explore/auto" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Auto Insurance
            </Link>
            <Link href="/explore/pet" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Pet Insurance
            </Link>
            <Link href="/explore/health" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Health Insurance
            </Link>
          </nav>

          {/* Login Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-sm hover:shadow-md transition-all">
                Log in / Sign up
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute top-0 right-0 h-screen w-64 bg-white shadow-lg overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  briki
                </span>
                <button
                  className="text-gray-600 focus:outline-none"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 py-2">
                  Home
                </Link>
                <Link href="/explore/travel" className="text-gray-600 hover:text-gray-900 py-2">
                  Travel Insurance
                </Link>
                <Link href="/explore/auto" className="text-gray-600 hover:text-gray-900 py-2">
                  Auto Insurance
                </Link>
                <Link href="/explore/pet" className="text-gray-600 hover:text-gray-900 py-2">
                  Pet Insurance
                </Link>
                <Link href="/explore/health" className="text-gray-600 hover:text-gray-900 py-2">
                  Health Insurance
                </Link>
              </nav>

              <div className="mt-8">
                <Link href="/auth">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-sm hover:shadow-md transition-all">
                    Log in / Sign up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-bold mb-4">Insurance</h3>
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
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/company" className="text-gray-400 hover:text-white transition-colors">
                    For Companies
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Briki Insurance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}