import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import '@/styles/design-system.css';

type NavLinkProps = {
  href: string;
  label: string;
  current: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
};

const NavLink = ({ href, label, current, hasDropdown, dropdownItems }: NavLinkProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const isActive = current === href;

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Link href={href}>
        <a 
          className={`nav-link ${isActive ? 'active' : ''} flex items-center gap-1`}
        >
          {label}
          {hasDropdown && <ChevronDown size={16} />}
        </a>
      </Link>

      {hasDropdown && showDropdown && dropdownItems && (
        <div className="absolute top-full left-0 mt-2 w-48 glass-card p-2 z-50">
          {dropdownItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <a className="block px-4 py-2 hover:bg-neutral-200 rounded-md transition-colors">
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const NavigationBar = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Update scroll state for transparent nav effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Company dropdown items
  const companyItems = [
    { label: 'Join as Partner', href: '/partner' },
    { label: 'Dashboard Login', href: '/company-login' }
  ];

  return (
    <nav className={`nav-container ${scrolled ? 'bg-opacity-90' : 'bg-opacity-70'}`}>
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <a className="nav-logo">Briki</a>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="nav-links">
          <NavLink href="/" label="Home" current={location} />
          <NavLink href="/travel" label="Travel Insurance" current={location} />
          <NavLink href="/auto" label="Auto Insurance" current={location} />
          <NavLink href="/pet" label="Pet Insurance" current={location} />
          <NavLink href="/health" label="Health Insurance" current={location} />
          <NavLink 
            href="/for-companies" 
            label="For Companies" 
            current={location} 
            hasDropdown={true}
            dropdownItems={companyItems}
          />
        </div>
        
        {/* Authentication Buttons */}
        <div className="nav-buttons">
          {isAuthenticated ? (
            <Link href="/profile">
              <a className="button button-secondary">
                <User size={18} />
                <span>Profile</span>
              </a>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <a className="button button-secondary">Sign In</a>
              </Link>
              <Link href="/auth?tab=register">
                <a className="button button-primary">Sign Up</a>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="nav-mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 py-4 shadow-lg lg:hidden">
          <div className="container flex flex-col space-y-4">
            <Link href="/">
              <a className="nav-link mobile py-2">Home</a>
            </Link>
            <Link href="/travel">
              <a className="nav-link mobile py-2">Travel Insurance</a>
            </Link>
            <Link href="/auto">
              <a className="nav-link mobile py-2">Auto Insurance</a>
            </Link>
            <Link href="/pet">
              <a className="nav-link mobile py-2">Pet Insurance</a>
            </Link>
            <Link href="/health">
              <a className="nav-link mobile py-2">Health Insurance</a>
            </Link>
            <Link href="/for-companies">
              <a className="nav-link mobile py-2">For Companies</a>
            </Link>
            
            {isAuthenticated ? (
              <Link href="/profile">
                <a className="button button-primary py-2 w-full text-center">Profile</a>
              </Link>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/auth">
                  <a className="button button-secondary py-2 w-full text-center">Sign In</a>
                </Link>
                <Link href="/auth?tab=register">
                  <a className="button button-primary py-2 w-full text-center">Sign Up</a>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;