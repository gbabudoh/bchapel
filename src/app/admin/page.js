'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { 
  Navigation, 
  Image, 
  Users, 
  Calendar, 
  Heart, 
  Mail, 
  Settings, 
  FileText, 
  DollarSign,
  ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const adminSections = [
    { href: '/admin/navigation', icon: Navigation, label: 'Navigation', description: 'Manage navigation menu items' },
    { href: '/admin/banners', icon: Image, label: 'Banners', description: 'Manage homepage banner slider' },
    { href: '/admin/images', icon: ImageIcon, label: 'Image Gallery', description: 'Upload and manage website images' },
    { href: '/admin/footer', icon: Settings, label: 'Footer', description: 'Manage footer content and social media' },
    { href: '/admin/homepage', icon: FileText, label: 'Homepage', description: 'Manage homepage content sections' },
    { href: '/admin/about', icon: Users, label: 'About', description: 'Manage about page content' },
    { href: '/admin/events', icon: Calendar, label: 'Events', description: 'Manage church events' },
    { href: '/admin/leadership', icon: Users, label: 'Leadership', description: 'Manage leadership team' },
    { href: '/admin/community', icon: Heart, label: 'Community', description: 'Manage community page content' },
    { href: '/admin/giving', icon: DollarSign, label: 'Giving', description: 'Manage giving options and PayPal' },
    { href: '/admin/contact', icon: Mail, label: 'Contact', description: 'Manage contact information' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-2">Welcome back, {session.user.username}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-lime-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                        <Icon className="text-lime-600" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 ml-4">
                        {section.label}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {section.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}