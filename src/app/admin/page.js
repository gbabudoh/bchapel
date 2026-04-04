'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminPageLayout from '../../../components/admin/AdminPageLayout';
import Link from 'next/link';
import {
  Navigation,
  Image,
  Users,
  Calendar,
  Heart,
  Mail,
  Settings,
  FileText,
  PoundSterling,
  GalleryHorizontal,
  BarChart3,
  ArrowRight,
  ImageIcon,
} from 'lucide-react';

const adminSections = [
  { href: '/admin/homepage', icon: FileText, label: 'Homepage', description: 'Edit homepage sections and content' },
  { href: '/admin/about', icon: Users, label: 'About', description: 'Manage about page content' },
  { href: '/admin/events', icon: Calendar, label: 'Events', description: 'Create and manage church events' },
  { href: '/admin/leadership', icon: Users, label: 'Leadership', description: 'Manage leadership team profiles' },
  { href: '/admin/community', icon: Heart, label: 'Community', description: 'Manage community programs' },
  { href: '/admin/giving', icon: PoundSterling, label: 'Giving', description: 'Manage giving options and PayPal' },
  { href: '/admin/contact', icon: Mail, label: 'Contact', description: 'Manage contact information' },
  { href: '/admin/navigation', icon: Navigation, label: 'Navigation', description: 'Edit navigation menu items' },
  { href: '/admin/banners', icon: Image, label: 'Banners', description: 'Manage homepage banner slider' },
  { href: '/admin/images', icon: GalleryHorizontal, label: 'Image Gallery', description: 'Upload and manage images' },
  { href: '/admin/footer', icon: Settings, label: 'Footer', description: 'Manage footer and social links' },
  { href: '/admin/seo', icon: BarChart3, label: 'SEO & Analytics', description: 'SEO settings and Google Analytics' },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ events: 0, leaders: 0, banners: 0 });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const [eventsRes, leadersRes, bannersRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/leadership'),
        fetch('/api/banners'),
      ]);
      const [events, leaders, banners] = await Promise.all([
        eventsRes.json(),
        leadersRes.json(),
        bannersRes.json(),
      ]);
      setStats({
        events: Array.isArray(events) ? events.filter(e => e.isActive).length : 0,
        leaders: Array.isArray(leaders) ? leaders.filter(l => l.isActive).length : 0,
        banners: Array.isArray(banners) ? banners.filter(b => b.isActive).length : 0,
      });
    } catch {
      // Stats are decorative — fail silently
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!session) return null;

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const statCards = [
    { label: 'Active Events', value: stats.events, color: 'bg-lime-500' },
    { label: 'Leaders', value: stats.leaders, color: 'bg-gray-700' },
    { label: 'Active Banners', value: stats.banners, color: 'bg-lime-600' },
    { label: 'Admin Sections', value: adminSections.length, color: 'bg-gray-800' },
  ];

  return (
    <AdminPageLayout title="Dashboard" description={today}>

      {/* Welcome banner */}
      <div className="bg-gray-900 rounded-2xl p-7 mb-8 flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-8 right-32 w-32 h-32 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div>
          <p className="text-lime-400 text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
          <h2 className="text-2xl font-bold text-white mb-1">{session.user.username}</h2>
          <p className="text-gray-400 text-sm">Here's what's going on with your site today.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex-shrink-0 flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200"
        >
          View Site
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <div className={`mt-3 h-1 w-10 ${stat.color} rounded-full`}></div>
          </div>
        ))}
      </div>

      {/* Section grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Manage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="bg-white rounded-xl border border-gray-200 hover:border-lime-400 hover:shadow-md transition-all duration-200 p-5 flex items-start gap-4 group"
              >
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-lime-50 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <Icon size={20} className="text-gray-500 group-hover:text-lime-600 transition-colors duration-200" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-lime-700 transition-colors duration-200">
                    {section.label}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{section.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </AdminPageLayout>
  );
}
