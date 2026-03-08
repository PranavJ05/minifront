// components/layout/Footer.tsx
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-gold-500 p-1.5 rounded-lg">
                <GraduationCap className="h-5 w-5 text-navy-950" />
              </div>
              <span className="font-serif font-bold text-lg text-white">ALUMNI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              The official platform for university alumni to network, mentor, and find career opportunities.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-navy-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors group">
                  <Icon className="h-4 w-4 group-hover:text-navy-950 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 font-serif">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/alumni', label: 'Alumni Directory' },
                { href: '/events', label: 'Events & Reunions' },
                { href: '/news', label: 'News & Updates' },
                { href: '/auth/login', label: 'Member Login' },
                { href: '/auth/signup', label: 'Join Network' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full opacity-60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-5 font-serif">Programs</h3>
            <ul className="space-y-3">
              {[
                'Mentorship Hub',
                'Job Board',
                'Scholarships',
                'Annual Fund',
                'Speaker Series',
                'Alumni Awards',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full opacity-60" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 font-serif">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span>Office of Alumni Relations<br />University Campus, Building A<br />Main Street, City 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-gold-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-gold-400 transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-gold-500 flex-shrink-0" />
                <a href="mailto:alumni@university.edu" className="hover:text-gold-400 transition-colors">alumni@university.edu</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2024 Alumni Network. All rights reserved. Access restricted to verified students, alumni, and faculty.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-gold-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
