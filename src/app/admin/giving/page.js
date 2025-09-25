'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/admin/AdminSidebar';
import { Plus, Edit, Trash2, Save, X, DollarSign, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

export default function GivingAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [givingOptions, setGivingOptions] = useState([]);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('options');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    suggested_amounts: '',
    type: 'one-time',
    is_active: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchGivingOptions();
    fetchDonations();
  }, [session, status, router]);

  const fetchGivingOptions = async () => {
    try {
      const response = await fetch('/api/giving');
      const data = await response.json();
      setGivingOptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching giving options:', error);
      setGivingOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations');
      const data = await response.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setDonations([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/giving/${editingItem.id}` : '/api/giving';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchGivingOptions();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving giving option:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      suggested_amounts: item.suggested_amounts,
      type: item.type,
      is_active: item.is_active
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this giving option?')) {
      try {
        const response = await fetch(`/api/giving/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchGivingOptions();
        }
      } catch (error) {
        console.error('Error deleting giving option:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', suggested_amounts: '', type: 'one-time', is_active: true });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Giving Management</h1>
                <p className="text-gray-600 mt-2">Manage donation options and view donation history</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('options')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'options'
                        ? 'border-lime-500 text-lime-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Giving Options
                  </button>
                  <button
                    onClick={() => setActiveTab('donations')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'donations'
                        ? 'border-lime-500 text-lime-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Donation History
                  </button>
                </nav>
              </div>
            </div>

            {activeTab === 'options' && (
              <>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Giving Option
                  </button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingItem ? 'Edit Giving Option' : 'Add New Giving Option'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                          </label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          >
                            <option value="one-time">One-time</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Suggested Amounts (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.suggested_amounts}
                          onChange={(e) => setFormData({ ...formData, suggested_amounts: e.target.value })}
                          placeholder="25,50,100,250"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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

                {/* Giving Options List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Suggested Amounts
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
                      {givingOptions.map((option) => (
                        <tr key={option.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{option.title}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="capitalize">{option.type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {option.suggested_amounts}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              option.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {option.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(option)}
                              className="text-lime-600 hover:text-lime-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(option.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {givingOptions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No giving options found. Create your first giving option to get started.
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'donations' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Donations</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(donation.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="capitalize">{donation.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            donation.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : donation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.transaction_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {donations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No donations found.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}