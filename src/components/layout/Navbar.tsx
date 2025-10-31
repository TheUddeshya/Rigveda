import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Track scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
    { to: '/discover', label: 'Discover' },
    { to: '/learn', label: 'Learn' },
    { to: '/about', label: 'About' },
    { to: '/settings', label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "w-full sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-vedic-charcoal/95 backdrop-blur-lg border-b border-vedic-sage/20 shadow-xl"
          : "bg-vedic-charcoal border-b border-vedic-sage/10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "font-bold text-xl tracking-wide font-ui transition-colors",
              "text-vedic-cream hover:text-vedic-sage"
            )}
          >
            <span className="bg-gradient-to-r from-vedic-cream via-vedic-sage to-vedic-cream bg-clip-text text-transparent">
              RigVeda Explorer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-vedic-sage/20",
                  isActive(link.to)
                    ? "bg-vedic-sage/30 text-vedic-cream"
                    : "text-vedic-cream/80 hover:text-vedic-cream"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-vedic-sage/20 text-vedic-cream",
                "min-w-[44px] min-h-[44px] flex items-center justify-center"
              )}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-vedic-sage/20 text-vedic-cream",
                "min-w-[44px] min-h-[44px] flex items-center justify-center"
              )}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-vedic-sage/20 text-vedic-cream",
                "min-w-[44px] min-h-[44px] flex items-center justify-center"
              )}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden border-t border-vedic-sage/20",
          "bg-vedic-slate/95 backdrop-blur-lg",
          "animate-slide-in-right"
        )}>
          <ul className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                    "hover:bg-vedic-sage/20",
                    isActive(link.to)
                      ? "bg-vedic-sage/30 text-vedic-cream"
                      : "text-vedic-cream/80 hover:text-vedic-cream"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
