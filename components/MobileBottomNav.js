'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, Heart, Phone } from 'lucide-react';

const tabs = [
  { label: 'Home',      href: '/',          icon: Home },
  { label: 'Events',    href: '/events',    icon: Calendar },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Give',      href: '/giving',    icon: Heart,  highlight: true },
  { label: 'Contact',   href: '/contact',   icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-stretch h-16">
        {tabs.map(({ label, href, icon: Icon, highlight }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 relative
                ${highlight
                  ? isActive
                    ? 'text-white'
                    : 'text-white'
                  : isActive
                    ? 'text-lime-600'
                    : 'text-gray-400'
                }
              `}
            >
              {highlight ? (
                <div className={`absolute -top-5 w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg transition-colors duration-150 ${isActive ? 'bg-lime-600' : 'bg-lime-500'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[9px] font-semibold mt-0.5">{label}</span>
                </div>
              ) : (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-lime-500 rounded-full" />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className={`text-[10px] font-medium ${isActive ? 'text-lime-600' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
