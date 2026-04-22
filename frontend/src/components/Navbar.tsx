'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Bell, ChevronDown, LogOut, Settings, BookOpen, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore Domains', href: '/domains' },
  { label: 'Find Consultants', href: '/consultants' },
  { label: 'AI Guide', href: '/ai-guide' },
  { label: 'About Us', href: '/about' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Mock auth state — replace with real auth context
  const user = null as any;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-2xl shadow-black/50' : 'bg-transparent'
      }`}
      style={{ borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Career<span className="gradient-text">Pathway</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button className="relative p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-sm font-bold">
                      {user.name?.[0] || 'U'}
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-52 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-white/08">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <div className="py-2">
                        {[
                          { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/seeker' },
                          { icon: BookOpen, label: 'My Bookings', href: '/bookings' },
                          { icon: Settings, label: 'Settings', href: '/settings/profile' },
                        ].map((item) => (
                          <Link key={item.href} href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                            <item.icon size={15} />
                            {item.label}
                          </Link>
                        ))}
                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline text-sm px-5 py-2.5">Login</Link>
                <Link href="/signup" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-300"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/08 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/login" className="btn-outline text-sm text-center" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/signup" className="btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
