'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  Navigation,
  Image as ImageIcon,
  Users,
  Calendar,
  Heart,
  Mail,
  Settings,
  FileText,
  PoundSterling,
  GalleryHorizontal,
  BarChart3,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', icon: Home, label: 'Dashboard' },
    ],
  },
  {
    label: 'Site Content',
    items: [
      { href: '/admin/homepage', icon: FileText, label: 'Homepage' },
      { href: '/admin/about', icon: Users, label: 'About' },
      { href: '/admin/events', icon: Calendar, label: 'Events' },
      { href: '/admin/leadership', icon: Users, label: 'Leadership' },
      { href: '/admin/community', icon: Heart, label: 'Community' },
      { href: '/admin/giving', icon: PoundSterling, label: 'Giving' },
      { href: '/admin/contact', icon: Mail, label: 'Contact' },
    ],
  },
  {
    label: 'Appearance',
    items: [
      { href: '/admin/navigation', icon: Navigation, label: 'Navigation' },
      { href: '/admin/banners', icon: ImageIcon, label: 'Banners' },
      { href: '/admin/images', icon: GalleryHorizontal, label: 'Image Gallery' },
      { href: '/admin/footer', icon: Settings, label: 'Footer' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/seo', icon: BarChart3, label: 'SEO & Analytics' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.username
    ? session.user.username.slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 flex flex-col z-40">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
        <div className="relative w-9 h-9 flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Battersea Chapel"
            fill
            className="object-contain"
          />
        </div>
        <div className="leading-tight">
          <p className="text-white font-bold text-sm">Battersea Chapel</p>
          <p className="text-lime-400 text-xs font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-1.5">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 group ${
                        isActive
                          ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={16} className={isActive ? 'text-lime-400' : 'text-gray-500 group-hover:text-gray-300'} />
                        {item.label}
                      </span>
                      {isActive && <ChevronRight size={14} className="text-lime-500" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + Sign Out */}
      <div className="border-t border-gray-800 p-4 space-y-3">
        {session && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{session.user.username}</p>
              <p className="text-gray-500 text-xs truncate">{session.user.email || 'Administrator'}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-150"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
