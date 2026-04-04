'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
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
  const [paypalSettings, setPaypalSettings] = useState({
    email: '',
    sandboxMode: false,
    currency: 'GBP'
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    suggestedAmounts: '',
    type: 'one-time',
    isActive: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchGivingOptions();
    fetchDonations();
    fetchPaypalSettings();
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

  const fetchPaypalSettings = async () => {
    try {
      const response = await fetch('/api/paypal-settings');
      if (response.ok) {
        const data = await response.json();
        setPaypalSettings(data);
      }
    } catch (error) {
      console.error('Error fetching PayPal settings:', error);
    }
  };

  const savePaypalSettings = async () => {
    try {
      const response = await fetch('/api/paypal-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paypalSettings),
      });
      if (response.ok) {
        alert('PayPal settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving PayPal settings:', error);
      alert('Error saving PayPal settings');
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
      suggestedAmounts: item.suggestedAmounts,
      type: item.type,
      isActive: item.isActive
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
    setFormData({ title: '', description: '', suggestedAmounts: '', type: 'one-time', isActive: true });
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <AdminPageLayout
      title="Giving Management"
      description="Manage donation options and view donation history"
    >
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
            <button
              onClick={() => setActiveTab('paypal')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'paypal'
                  ? 'border-lime-500 text-lime-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              PayPal Settings
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
                    value={formData.suggestedAmounts}
                    onChange={(e) => setFormData({ ...formData, suggestedAmounts: e.target.value })}
                    placeholder="25,50,100,250"
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
                      {option.suggestedAmounts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        option.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {option.isActive ? 'Active' : 'Inactive'}
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

      {activeTab === 'paypal' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">PayPal Configuration</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PayPal Email Address
              </label>
              <input
                type="email"
                value={paypalSettings.email}
                onChange={(e) => setPaypalSettings({ ...paypalSettings, email: e.target.value })}
                placeholder="your-paypal@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is the email address associated with your PayPal account that will receive donations.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={paypalSettings.currency}
                onChange={(e) => setPaypalSettings({ ...paypalSettings, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              >
                <option value="GBP">GBP (British Pound)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="CAD">CAD (Canadian Dollar)</option>
                <option value="AUD">AUD (Australian Dollar)</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="sandbox_mode"
                checked={paypalSettings.sandboxMode}
                onChange={(e) => setPaypalSettings({ ...paypalSettings, sandboxMode: e.target.checked })}
                className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
              />
              <label htmlFor="sandbox_mode" className="ml-2 block text-sm text-gray-900">
                Sandbox Mode (for testing)
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Create a PayPal Business account at paypal.com</li>
                <li>Verify your account with bank details</li>
                <li>Enable &quot;Website Payments Standard&quot; in your PayPal settings</li>
                <li>Enter your PayPal email address above</li>
                <li>Test donations using sandbox mode first</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Current Status:</h3>
              <div className="text-sm text-yellow-800">
                <p><strong>PayPal Email:</strong> {paypalSettings.email || 'Not configured'}</p>
                <p><strong>Currency:</strong> {paypalSettings.currency}</p>
                <p><strong>Mode:</strong> {paypalSettings.sandboxMode ? 'Sandbox (Testing)' : 'Live (Production)'}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => window.open('https://www.paypal.com/business', '_blank')}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg"
              >
                Create PayPal Account
              </button>
              <button
                onClick={savePaypalSettings}
                className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <Save size={20} className="mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
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
                    {new Date(donation.createdAt).toLocaleDateString()}
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
                    {donation.transactionId}
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
    </AdminPageLayout>
  );
}
