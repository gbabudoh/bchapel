'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import ImageUpload from '../../../../components/admin/ImageUpload';
import { Plus, Edit, Trash2, Save, X, User, Image, ArrowUp, ArrowDown } from 'lucide-react';

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
    imageUrl: '',
    layout: 'image-left', // 'image-left' or 'text-left'
    orderIndex: 0,
    isActive: true
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
      // Sort by order_index to display in correct order
      const sortedData = Array.isArray(data) ? data.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)) : [];
      setAboutContent(sortedData);
    } catch (error) {
      console.error('Error fetching about content:', error);
      setAboutContent([]);
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
          imageUrl: '',
          orderIndex: 0,
          isActive: true
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

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData({
      section: item.section || '',
      title: item.title || '',
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      layout: item.layout || 'image-left',
      orderIndex: item.orderIndex || 0,
      isActive: item.isActive !== false
    });
  };

  const handleSaveEdit = async () => {
    if (editingItem) {
      await handleUpdate(editingItem, formData);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({
      section: '',
      title: '',
      content: '',
      imageUrl: '',
      layout: 'image-left',
      orderIndex: 0,
      isActive: true
    });
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

  const moveItem = async (id, direction) => {
    const currentIndex = aboutContent.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= aboutContent.length) return;

    // Swap order_index values
    const currentItem = aboutContent[currentIndex];
    const targetItem = aboutContent[newIndex];

    try {
      // Update both items
      await handleUpdate(currentItem.id, { ...currentItem, orderIndex: targetItem.orderIndex });
      await handleUpdate(targetItem.id, { ...targetItem, orderIndex: currentItem.orderIndex });
    } catch (error) {
      console.error('Error reordering items:', error);
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
      title="About Page Management"
      description="Manage about page content sections"
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
                <option value="pastor">Pastor&apos;s Message</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
              <select
                value={formData.layout}
                onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
              >
                <option value="image-left">Image Left | Text Right</option>
                <option value="text-left">Text Left | Image Right</option>
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
                rows="6"
                required
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
                label="About Image"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aboutContent.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {editingItem === item.id ? (
                // Edit Form
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                      <select
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                      >
                        <option value="hero">Hero Section</option>
                        <option value="mission">Mission</option>
                        <option value="vision">Vision</option>
                        <option value="values">Values</option>
                        <option value="history">History</option>
                        <option value="beliefs">Beliefs</option>
                        <option value="pastor">Pastor&apos;s Message</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
                      <select
                        value={formData.layout}
                        onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                      >
                        <option value="image-left">Image Left | Text Right</option>
                        <option value="text-left">Text Left | Image Right</option>
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
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                        rows="6"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUpload
                        onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                        currentImage={formData.imageUrl}
                        label="About Image"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit_active_${item.id}`}
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="mr-2"
                      />
                      <label htmlFor={`edit_active_${item.id}`} className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-sm font-bold rounded-full bg-gray-100 text-gray-700">
                        #{item.orderIndex}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-lime-100 text-lime-800">
                        {item.section}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{item.content}</p>
                    {item.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={aboutContent.findIndex(i => i.id === item.id) === 0}
                        className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={aboutContent.findIndex(i => i.id === item.id) === aboutContent.length - 1}
                        className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-lime-600 hover:text-lime-800 p-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminPageLayout>
  );
}
