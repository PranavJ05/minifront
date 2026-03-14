'use client';
// components/layout/Navbar.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, GraduationCap, Bell } from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: string;
  userName?: string;
}

export default function Navbar({ isAuthenticated = false, userRole, userName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDashboardLink = () => {
    switch (userRole) {
      case 'faculty': return '/dashboard/faculty';
      case 'student': return '/dashboard/student';
      case 'alumni': return '/dashboard/alumni';
      default: return '/';
    }
  };

  return (
    <nav className="bg-navy-950 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-gold-500 p-1.5 rounded-lg group-hover:bg-gold-400 transition-colors">
              <GraduationCap className="h-5 w-5 text-navy-950" />
            </div>
            <span className="font-serif font-bold text-lg tracking-wide">ALUMNI</span>
          </Link>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-400 hover:text-gold-400 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
                </button>

                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-xs font-bold text-navy-950">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium">{userName || 'Dashboard'}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Join Network
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 animate-slide-up">
          <div className="px-4 py-4 space-y-2">

            <div className="pt-2 border-t border-navy-800 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  href={getDashboardLink()}
                  className="btn-gold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="btn-outline text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="btn-gold text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Network
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}