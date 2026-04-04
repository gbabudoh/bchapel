'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import { Save, Globe, BarChart3, Share2, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function SEOAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    siteUrl: '',
    googleAnalyticsId: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    ogImage: '/og-image.jpg',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchSettings();
  }, [session, status, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/seo-settings');
      const data = await response.json();

      // Ensure all fields have string values (not null)
      const cleanedData = {
        siteTitle: data.siteTitle || '',
        siteDescription: data.siteDescription || '',
        siteKeywords: data.siteKeywords || '',
        siteUrl: data.siteUrl || '',
        googleAnalyticsId: data.googleAnalyticsId || '',
        facebookUrl: data.facebookUrl || '',
        instagramUrl: data.instagramUrl || '',
        youtubeUrl: data.youtubeUrl || '',
        twitterUrl: data.twitterUrl || '',
        ogImage: data.ogImage || '/og-image.jpg',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        address: data.address || ''
      };

      setSettings(cleanedData);
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/seo-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('SEO settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update settings. Please try again.');
      }
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      setMessage('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <AdminPageLayout
      title="SEO & Analytics Settings"
      description="Manage your website's SEO, analytics, and social media settings"
    >
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully')
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic SEO Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="text-lime-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Basic SEO Settings</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => handleInputChange('site_title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="Battersea Chapel - A Place of Worship, Community & Faith"
              />
              <p className="text-sm text-gray-500 mt-1">This appears in browser tabs and search results</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                rows="3"
                placeholder="Welcome to Battersea Chapel - A vibrant Christian community..."
              />
              <p className="text-sm text-gray-500 mt-1">This appears in search engine results (150-160 characters recommended)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                value={settings.siteKeywords}
                onChange={(e) => handleInputChange('site_keywords', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="Battersea Chapel,Church London,Christian Community..."
              />
              <p className="text-sm text-gray-500 mt-1">Comma-separated keywords relevant to your church</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => handleInputChange('site_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="https://batterseachapel.com"
              />
              <p className="text-sm text-gray-500 mt-1">Your website&apos;s main URL (without trailing slash)</p>
            </div>
          </div>
        </div>

        {/* Analytics Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-lime-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Analytics Settings</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics Measurement ID</label>
            <input
              type="text"
              value={settings.googleAnalyticsId}
              onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-sm text-gray-500 mt-1">
              Get this from your Google Analytics 4 property.
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-lime-600 hover:text-lime-800 ml-1">
                Open Google Analytics <ExternalLink size={14} className="inline" />
              </a>
            </p>
          </div>
        </div>

        {/* Social Media Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Share2 className="text-lime-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="https://www.facebook.com/batterseachapel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="https://www.instagram.com/batterseachapel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="https://www.youtube.com/batterseachapel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
              <input
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="https://www.twitter.com/batterseachapel"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="text-lime-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="info@batterseachapel.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="+44 20 1234 5678"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                rows="2"
                placeholder="123 Church Street, Battersea, London SW11 1AA"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </AdminPageLayout>
  );
}
