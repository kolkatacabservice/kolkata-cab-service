'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Services', href: '#',
    children: [
      { name: 'Local Taxi', href: '/services/local-taxi' },
      { name: 'Outstation Cab', href: '/services/outstation' },
      { name: 'One-Way Taxi', href: '/services/one-way' },
      { name: 'Round Trip', href: '/services/round-trip' },
      { name: 'Airport Transfer', href: '/services/airport-transfer' },
      { name: 'Wedding Car Rental', href: '/services/wedding-car-rental' },
      { name: 'Corporate Car Rental', href: '/services/corporate-car-rental' },
    ],
  },
  {
    name: 'Tours', href: '/tours',
    children: [
      { name: 'Darjeeling Tour', href: '/tours/darjeeling-tour' },
      { name: 'Puri & Konark Tour', href: '/tours/puri-konark-tour' },
      { name: 'Sundarbans Safari', href: '/tours/sundarbans-tour' },
      { name: 'Varanasi & Ayodhya', href: '/tours/varanasi-ayodhya-tour' },
      { name: 'Bodh Gaya & Rajgir', href: '/tours/bodh-gaya-rajgir-tour' },
      { name: 'North Bengal Tour', href: '/tours/north-bengal-tour' },
      { name: 'Kolkata City Tour', href: '/tours/kolkata-city-tour' },
      { name: 'All Tour Packages →', href: '/tours' },
    ],
  },
  {
    name: 'Cities', href: '#',
    children: [
      { name: 'Kolkata', href: '/west-bengal/kolkata' },
      { name: 'Howrah', href: '/west-bengal/howrah' },
      { name: 'Darjeeling', href: '/west-bengal/darjeeling' },
      { name: 'Siliguri', href: '/west-bengal/siliguri' },
      { name: 'Durgapur', href: '/west-bengal/durgapur' },
      { name: 'Ranchi', href: '/jharkhand/ranchi' },
      { name: 'Jamshedpur', href: '/jharkhand/jamshedpur' },
      { name: 'Bhubaneswar', href: '/odisha/bhubaneswar' },
      { name: 'More Cities →', href: '/west-bengal' },
    ],
  },
  { name: 'Fleet', href: '/fleet' },
  { name: 'Fare Chart', href: '/fare-chart' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true }); // passive: true prevents scroll jank
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      {/* Top bar — visible on all screens */}
      <div className="bg-secondary text-white text-xs sm:text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center">
          <span className="hidden sm:inline">🚖 {BUSINESS.tagline} — Available {BUSINESS.hours}</span>
          <span className="sm:hidden text-xs">🚖 24/7 Cab Service — Kolkata & East India</span>
          <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-1 font-semibold hover:text-accent transition-colors text-xs sm:text-sm">
            <Phone size={12} />
            <span>{BUSINESS.phone}</span>
          </a>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            {/* Logo — always visible with brand name */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Image src="/logo.webp" alt={BUSINESS.name} width={50} height={50} className="rounded-lg w-10 h-10 sm:w-[50px] sm:h-[50px] object-contain" priority />
              <div>
                <span className="font-extrabold text-secondary text-base sm:text-lg lg:text-xl leading-tight block tracking-tight">Kolkata Cab Service</span>
                <span className="text-[#9A4500] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Taxi Service</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group"
                  onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-accent/50 transition-all"
                    onClick={(e) => { if (item.children) e.preventDefault(); }}
                  >
                    {item.name}
                    {item.children && <ChevronDown size={14} className={`transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />}
                  </Link>
                  {item.children && openDropdown === item.name && (
                    <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                      {item.children.map((child) => (
                        <Link key={child.name} href={child.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-accent/50 hover:text-primary transition-colors">
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA buttons — desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-amber-500 text-white font-semibold rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all text-sm">
                <Phone size={16} />
                Call Now
              </a>
            </div>

            {/* Mobile hamburger */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t animate-slideDown max-h-[70vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.children ? '#' : item.href}
                    className="block px-4 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-accent/50 hover:text-primary transition-colors text-sm"
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault();
                        setOpenDropdown(openDropdown === item.name ? null : item.name);
                      } else {
                        setMobileOpen(false);
                      }
                    }}
                  >
                    <span className="flex items-center justify-between">
                      {item.name}
                      {item.children && <ChevronDown size={16} className={`transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />}
                    </span>
                  </Link>
                  {item.children && openDropdown === item.name && (
                    <div className="pl-4 space-y-0.5 mt-1">
                      {item.children.map((child) => (
                        <Link key={child.name} href={child.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:text-primary rounded-lg hover:bg-accent/30">
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t flex gap-2">
                <a href={`tel:${BUSINESS.phone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">
                  <Phone size={16} /> Call Now
                </a>
                <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to book a cab.')}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white font-semibold rounded-xl text-sm">
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
