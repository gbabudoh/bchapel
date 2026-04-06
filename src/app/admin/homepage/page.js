'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import ImageUpload from '../../../../components/admin/ImageUpload';
import { Plus, Edit, Trash2, Save, X, FileText, Image } from 'lucide-react';

export default function HomepageAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    imageUrl: '',
    buttonText: '',
    buttonUrl: '',
    orderIndex: 0,
    isActive: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchContent();
  }, [session, status, router]);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/homepage');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ section: '', title: '', content: '', imageUrl: '', buttonText: '', buttonUrl: '', orderIndex: 0, isActive: true });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      section: item.section || '',
      title: item.title || '',
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      buttonText: item.buttonText || '',
      buttonUrl: item.buttonUrl || '',
      orderIndex: item.orderIndex || 0,
      isActive: item.isActive !== false,
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/homepage/${editingItem.id}` : '/api/homepage';
      const method = editingItem ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchContent();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving homepage content:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this content section?')) {
      try {
        const response = await fetch(`/api/homepage/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchContent();
        }
      } catch (error) {
        console.error('Error deleting homepage content:', error);
      }
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
      title="Homepage Content"
      description="Manage homepage sections and content"
      action={
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Content Section
        </button>
      }
    >
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Content Section' : 'Add New Content Section'}</h2>
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
                <option value="hero">Hero Section</option>
                <option value="welcome">Welcome</option>
                <option value="services">Services</option>
                <option value="community">Community</option>
                <option value="events">Events Preview</option>
                <option value="testimonials">Testimonials</option>
              </select>
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
            <div className="md:col-span-2">
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
                rows="4"
                required
              />
            </div>
            <div>
              <ImageUpload
                onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
                label="Homepage Image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
              <input
                type="url"
                value={formData.buttonUrl}
                onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 flex items-center gap-2"
              >
                <Save size={16} />
                {editingItem ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {content.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-lime-100 text-lime-800">
                      {item.section}
                    </span>
                    <span className="text-sm text-gray-500">Order: {item.orderIndex}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700 mb-4">{item.content}</p>
                  {item.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {item.buttonText && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Button:</span>
                      <span>{item.buttonText}</span>
                      {item.buttonUrl && (
                        <a href={item.buttonUrl} target="_blank" rel="noopener noreferrer" className="text-lime-600 hover:text-lime-800">
                          ({item.buttonUrl})
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-lime-600 hover:text-lime-800 p-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPageLayout>
  );
}
