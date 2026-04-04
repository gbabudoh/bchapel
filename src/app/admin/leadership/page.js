'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import ImageUpload from '../../../../components/admin/ImageUpload';
import { Plus, Edit, Trash2, Save, X, User } from 'lucide-react';

export default function LeadershipAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    imageUrl: '',
    orderIndex: 0,
    isActive: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchLeaders();
  }, [session, status, router]);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/leadership');
      const data = await response.json();
      setLeaders(data);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/leadership/${editingItem.id}` : '/api/leadership';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchLeaders();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving leader:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      position: item.position,
      bio: item.bio || '',
      imageUrl: item.imageUrl || '',
      orderIndex: item.orderIndex,
      isActive: item.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this leader?')) {
      try {
        const response = await fetch(`/api/leadership/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchLeaders();
        }
      } catch (error) {
        console.error('Error deleting leader:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      imageUrl: '',
      orderIndex: 0,
      isActive: true
    });
    setEditingItem(null);
    setShowAddForm(false);
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
      title="Leadership Management"
      description="Manage your church leadership team"
      action={
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Leader
        </button>
      }
    >
      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Leader' : 'Add New Leader'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>

            <div>
              <ImageUpload
                onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
                label="Leader Photo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief biography of the leader..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  className="mr-2"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Save size={20} className="mr-2" />
                {editingItem ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <X size={20} className="mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leaders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map((leader) => (
          <div key={leader.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200">
              {leader.imageUrl ? (
                <img
                  src={leader.imageUrl}
                  alt={leader.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="text-gray-400" size={48} />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {leader.name}
                  </h3>
                  <p className="text-lime-600 font-medium">
                    {leader.position}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  leader.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {leader.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {leader.bio && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {leader.bio}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Order: {leader.orderIndex}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(leader)}
                    className="text-lime-600 hover:text-lime-900 p-1"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(leader.id)}
                    className="text-red-600 hover:text-red-900 p-1"
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
