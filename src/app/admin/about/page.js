'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/admin/AdminSidebar';
import { Plus, Edit, Trash2, Save, X, User, Image } from 'lucide-react';

export default function AboutAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [aboutContent, setAboutContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    image_url: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchAboutContent();
  }, [session, status, router]);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();
      setAboutContent(data);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchAboutContent();
        setShowAddForm(false);
        setFormData({
          section: '',
          title: '',
          content: '',
          image_url: '',
          order_index: 0,
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error creating about content:', error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/about/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        fetchAboutContent();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating about content:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this content section?')) {
      try {
        const response = await fetch(`/api/about/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchAboutContent();
        }
      } catch (error) {
        console.error('Error deleting about content:', error);
      }
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
              <p className="text-gray-600 mt-2">Manage about page content sections</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Content Section
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Content Section</h2>
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
                    <option value="mission">Mission</option>
                    <option value="vision">Vision</option>
                    <option value="values">Values</option>
                    <option value="history">History</option>
                    <option value="beliefs">Beliefs</option>
                    <option value="pastor">Pastor's Message</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
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
                    rows="6"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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

          <div className="grid gap-6">
            {aboutContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-lime-100 text-lime-800">
                          {item.section}
                        </span>
                        <span className="text-sm text-gray-500">Order: {item.order_index}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{item.content}</p>
                      {item.image_url && (
                        <div className="mb-4">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                        className="text-indigo-600 hover:text-indigo-900 p-2"
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
        </div>
      </div>
    </div>
  );
}