'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import { Plus, Edit, Trash2, Save, X, Mail, Phone, MapPin, Clock, Eye, Reply } from 'lucide-react';

export default function ContactAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({
    type: 'address',
    label: '',
    value: '',
    icon: '',
    isActive: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchContactInfo();
    fetchMessages();
  }, [session, status, router]);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setContactInfo(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setContactInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact/messages');
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/contact/${editingItem.id}` : '/api/contact';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchContactInfo();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      label: item.label,
      value: item.value,
      icon: item.icon,
      isActive: item.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this contact information?')) {
      try {
        const response = await fetch(`/api/contact/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchContactInfo();
        }
      } catch (error) {
        console.error('Error deleting contact info:', error);
      }
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/contact/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'address', label: '', value: '', icon: '', isActive: true });
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
      title="Contact Management"
      description="Manage contact information and view messages"
    >
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-lime-500 text-lime-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contact Information
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-lime-500 text-lime-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages
              {messages.filter(m => !m.isRead).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'info' && (
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add Contact Info
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? 'Edit Contact Information' : 'Add New Contact Information'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    >
                      <option value="address">Address</option>
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="hours">Hours</option>
                      <option value="social">Social Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., MapPin, Phone, Mail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <X size={20} className="inline mr-1" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Save size={20} className="mr-2" />
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Contact Info List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contactInfo.map((info) => (
                  <tr key={info.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="capitalize">{info.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {info.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {info.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        info.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {info.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(info)}
                        className="text-lime-600 hover:text-lime-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(info.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contactInfo.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No contact information found. Add your first contact info to get started.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contact Messages</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div key={message.id} className={`p-6 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{message.name}</h4>
                      {!message.isRead && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-3">
                      <p className="text-gray-900">{message.message}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!message.isRead && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Mark as read"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <a
                      href={`mailto:${message.email}?subject=Re: Contact Form Message`}
                      className="text-lime-600 hover:text-lime-900"
                      title="Reply"
                    >
                      <Reply size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No messages found.
              </div>
            )}
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
