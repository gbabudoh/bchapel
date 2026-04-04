'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import { Plus, Edit, Trash2, Save, X, Settings, Link, ExternalLink } from 'lucide-react';

export default function FooterAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [footerItems, setFooterItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    url: '',
    icon: '',
    orderIndex: 0,
    isActive: true,
    linkType: 'internal' // New field to distinguish between internal and external links
  });

  // Common internal page links for quick selection
  const internalPages = [
    { value: '/', label: 'Home' },
    { value: '/about', label: 'About Us' },
    { value: '/leadership', label: 'Leadership' },
    { value: '/events', label: 'Events' },
    { value: '/giving', label: 'Giving' },
    { value: '/community', label: 'Community' },
    { value: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchFooterItems();
  }, [session, status, router]);

  const fetchFooterItems = async () => {
    try {
      const response = await fetch('/api/footer');
      const data = await response.json();
      setFooterItems(data);
    } catch (error) {
      console.error('Error fetching footer items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchFooterItems();
        setShowAddForm(false);
        setFormData({
          section: '',
          title: '',
          content: '',
          url: '',
          icon: '',
          orderIndex: 0,
          isActive: true,
          linkType: 'internal'
        });
      }
    } catch (error) {
      console.error('Error creating footer item:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/footer/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchFooterItems();
        setEditingItem(null);
        setFormData({
          section: '',
          title: '',
          content: '',
          url: '',
          icon: '',
          orderIndex: 0,
          isActive: true,
          linkType: 'internal'
        });
      }
    } catch (error) {
      console.error('Error updating footer item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this footer item?')) {
      try {
        const response = await fetch(`/api/footer/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchFooterItems();
        }
      } catch (error) {
        console.error('Error deleting footer item:', error);
      }
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    // Determine link type based on URL
    const linkType = item.url && (item.url.startsWith('http') || item.url.includes('@')) ? 'external' : 'internal';
    setFormData({
      section: item.section,
      title: item.title,
      content: item.content || '',
      url: item.url || '',
      icon: item.icon || '',
      orderIndex: item.orderIndex || 0,
      isActive: item.isActive !== false,
      linkType: linkType
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({
      section: '',
      title: '',
      content: '',
      url: '',
      icon: '',
      orderIndex: 0,
      isActive: true,
      linkType: 'internal'
    });
  };

  const renderLinkField = () => {
    if (formData.linkType === 'internal') {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Link size={16} className="inline mr-1" />
            Internal Page Link
          </label>
          <select
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
          >
            <option value="">Select a page</option>
            {internalPages.map((page) => (
              <option key={page.value} value={page.value}>
                {page.label} ({page.value})
              </option>
            ))}
          </select>
          <input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
            placeholder="Or enter custom path (e.g., /custom-page)"
          />
        </div>
      );
    } else {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ExternalLink size={16} className="inline mr-1" />
            External URL or Email
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
            placeholder="https://example.com or mailto:email@domain.com"
          />
        </div>
      );
    }
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
      title="Footer Management"
      description="Manage footer sections, page links, and external URLs"
      action={
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingItem(null);
          }}
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Footer Item
        </button>
      }
    >
      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Footer Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                required
              >
                <option value="">Select Section</option>
                <option value="contact">Contact</option>
                <option value="links">Quick Links</option>
                <option value="social">Social Media</option>
                <option value="info">Information</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                rows="3"
              />
            </div>

            {/* Link Type Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="link_type"
                    value="internal"
                    checked={formData.linkType === 'internal'}
                    onChange={(e) => setFormData({ ...formData, linkType: e.target.value, url: '' })}
                    className="mr-2"
                  />
                  <Link size={16} className="mr-1" />
                  Internal Page
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="link_type"
                    value="external"
                    checked={formData.linkType === 'external'}
                    onChange={(e) => setFormData({ ...formData, linkType: e.target.value, url: '' })}
                    className="mr-2"
                  />
                  <ExternalLink size={16} className="mr-1" />
                  External URL/Email
                </label>
              </div>
            </div>

            {/* Dynamic Link Field */}
            <div className="md:col-span-2">
              {renderLinkField()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="e.g., facebook, twitter, phone, home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input
                type="number"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active_add"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active_add" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingItem && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Footer Item</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                required
              >
                <option value="">Select Section</option>
                <option value="contact">Contact</option>
                <option value="links">Quick Links</option>
                <option value="social">Social Media</option>
                <option value="info">Information</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                rows="3"
              />
            </div>

            {/* Link Type Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="edit_link_type"
                    value="internal"
                    checked={formData.linkType === 'internal'}
                    onChange={(e) => setFormData({ ...formData, linkType: e.target.value })}
                    className="mr-2"
                  />
                  <Link size={16} className="mr-1" />
                  Internal Page
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="edit_link_type"
                    value="external"
                    checked={formData.linkType === 'external'}
                    onChange={(e) => setFormData({ ...formData, linkType: e.target.value })}
                    className="mr-2"
                  />
                  <ExternalLink size={16} className="mr-1" />
                  External URL/Email
                </label>
              </div>
            </div>

            {/* Dynamic Link Field */}
            <div className="md:col-span-2">
              {renderLinkField()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                placeholder="e.g., facebook, twitter, phone, home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input
                type="number"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active_edit"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active_edit" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 flex items-center gap-2"
              >
                <Save size={16} />
                Update
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer Items Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Footer Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {footerItems.map((item) => (
                <tr key={item.id} className={editingItem?.id === item.id ? 'bg-lime-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.url && (
                      <div className="flex items-center">
                        {item.url.startsWith('http') || item.url.includes('@') ? (
                          <ExternalLink size={14} className="mr-1 text-blue-500" />
                        ) : (
                          <Link size={14} className="mr-1 text-green-500" />
                        )}
                        <span className="truncate max-w-xs">{item.url}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.icon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.orderIndex}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-lime-600 hover:text-lime-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageLayout>
  );
}
