'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';

export default function Navigation() {
  const [navItems, setNavItems] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetchNavItems();
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchNavItems = async () => {
    try {
      const response = await fetch('/api/navigation');
      const data = await response.json();
      if (Array.isArray(data)) {
        setNavItems(data.filter(item => item.isActive));
      } else {
        console.error('Navigation API returned non-array data:', data);
        setNavItems([]);
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
      setNavItems([]);
    }
  };

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Battersea Chapel Logo"
                width={52}
                height={52}
                className="object-contain"
              />
              <span className="text-xl font-bold text-gray-900 leading-tight">
                Battersea<br />
                <span className="text-lime-600">Chapel</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md relative ${
                    isActive
                      ? 'text-lime-600 bg-lime-50'
                      : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'
                  }`}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-lime-500 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/giving"
              className="ml-4 inline-flex items-center gap-1.5 bg-lime-500 hover:bg-lime-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
            >
              <Heart size={15} />
              Give
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
