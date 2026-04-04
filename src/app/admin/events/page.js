'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import ImageUpload from '../../../../components/admin/ImageUpload';
import { Plus, Edit, Trash2, Save, X, Calendar, MapPin, Star } from 'lucide-react';

export default function EventsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchEvents();
  }, [session, status, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing event
        const response = await fetch(`/api/events/${editingItem}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchEvents();
          resetForm();
        }
      } else {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchEvents();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingItem(event.id);

    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    let formattedDate = event.date;
    if (event.date) {
      const date = new Date(event.date);
      formattedDate = date.toISOString().slice(0, 16);
    }

    setFormData({
      title: event.title,
      description: event.description,
      date: formattedDate,
      location: event.location,
      imageUrl: event.imageUrl || '',
      isFeatured: event.isFeatured,
      isActive: event.isActive
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      imageUrl: '',
      isFeatured: false,
      isActive: true
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchEvents();
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      title="Events Management"
      description="Manage church events and activities"
      action={
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Event
        </button>
      }
    >
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Event' : 'Add New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
                label="Event Image"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured Event</label>
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
                {editingItem ? 'Update Event' : 'Save Event'}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    {event.isFeatured && (
                      <Star className="text-yellow-500 fill-current" size={18} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {event.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {event.isFeatured && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{event.description}</p>
                  {event.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-lime-600 hover:text-lime-800 p-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-900 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPageLayout>
  );
}
