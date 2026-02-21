import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  Home,
  Trophy,
  Users,
  Compass,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Correct scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Tribes', href: '/tribes' },
    { label: 'Challenges', href: '/challenges' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
  ];

  const mobileMenuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
    { icon: <Compass className="w-5 h-5" />, label: 'Explore', href: '/explore' },
    { icon: <Trophy className="w-5 h-5" />, label: 'Challenges', href: '/challenges' },
    { icon: <Users className="w-5 h-5" />, label: 'Tribes', href: '/tribes' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', href: '/messages' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
    { icon: <LogOut className="w-5 h-5" />, label: 'Logout', href: '/logout' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-lg border-b border-charcoal-800/50'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-sm font-bold text-white">HT</span>
                </div>
                <span className="text-xl font-bold text-white font-display tracking-tight">
                  HashTribe
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">

              {/* Nav Links */}
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm font-medium text-grey-300 hover:text-white transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-charcoal-900 border border-charcoal-800 text-white placeholder-grey-600 text-sm focus:outline-none focus:border-primary-500 w-48"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Bell className="w-5 h-5 text-grey-400" />
                </button>

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-grey-300 hover:text-white transition-colors"
                >
                  Login
                </Link>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="px-6 py-2 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-charcoal-900 border-l border-charcoal-800 overflow-y-auto">
              
              {/* Menu Items */}
              <div className="p-6 space-y-2">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 text-grey-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
