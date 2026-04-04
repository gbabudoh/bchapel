'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  Copy,
  Filter,
  Search,
  Grid,
  List,
  X,
  Check
} from 'lucide-react';

export default function ImagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'banners', label: 'Banners' },
    { value: 'events', label: 'Events' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchImages();
  }, [session, status, router, selectedCategory, currentPage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/images?${params}`);
      const data = await response.json();

      if (response.ok) {
        setImages(data.images || []);
        setPagination(data.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory || 'general');
      formData.append('title', file.name.split('.')[0]);
      formData.append('alt_text', file.name.split('.')[0]);

      try {
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        return await response.json();
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
        return null;
      }
    });

    try {
      await Promise.all(uploadPromises);
      fetchImages();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images?id=${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchImages();
        setSelectedImage(null);
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const filteredImages = images.filter(image =>
    image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.originalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <AdminPageLayout
      title="Image Gallery"
      description="Manage your website images"
    >
      {/* Upload button inline above filters */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Upload size={20} />
          <span>Upload Images</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-lime-100 text-lime-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-lime-100 text-lime-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Images Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-500"></div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.filePath}
                      alt={image.altText || image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <Eye className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200" size={24} />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.title || image.originalName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {image.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredImages.map((image) => (
                    <tr key={image.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={image.filePath}
                          alt={image.altText}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {image.title || image.originalName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-lime-100 text-lime-800 capitalize">
                          {image.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(image.fileSize / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedImage(image)}
                            className="text-lime-600 hover:text-lime-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => copyToClipboard(image.filePath)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
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
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Images</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
              </p>
            </div>

            {uploading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
                <span className="ml-2 text-gray-600">Uploading...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedImage.title || selectedImage.originalName}
                </h2>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <img
                  src={selectedImage.filePath}
                  alt={selectedImage.altText}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>File Name:</strong> {selectedImage.originalName}
                </div>
                <div>
                  <strong>Category:</strong> {selectedImage.category}
                </div>
                <div>
                  <strong>File Size:</strong> {(selectedImage.fileSize / 1024).toFixed(1)} KB
                </div>
                <div>
                  <strong>Type:</strong> {selectedImage.mimeType}
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <strong>File Path:</strong>
                <div className="flex items-center mt-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                    {selectedImage.filePath}
                  </code>
                  <button
                    onClick={() => copyToClipboard(selectedImage.filePath)}
                    className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => handleDelete(selectedImage.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
