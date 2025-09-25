'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  Home, 
  Navigation, 
  Image, 
  Users, 
  Calendar, 
  Heart, 
  Mail, 
  Settings, 
  FileText, 
  DollarSign,
  ImageIcon,
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/navigation', icon: Navigation, label: 'Navigation' },
    { href: '/admin/banners', icon: Image, label: 'Banners' },
    { href: '/admin/images', icon: ImageIcon, label: 'Image Gallery' },
    { href: '/admin/footer', icon: Settings, label: 'Footer' },
    { href: '/admin/homepage', icon: FileText, label: 'Homepage' },
    { href: '/admin/about', icon: Users, label: 'About' },
    { href: '/admin/events', icon: Calendar, label: 'Events' },
    { href: '/admin/leadership', icon: Users, label: 'Leadership' },
    { href: '/admin/community', icon: Heart, label: 'Community' },
    { href: '/admin/giving', icon: DollarSign, label: 'Giving' },
    { href: '/admin/contact', icon: Mail, label: 'Contact' },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600">Battersea Chapel</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 mb-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-lime-100 text-lime-700 border-r-2 border-lime-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut size={18} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}