'use client';
import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ 
  onImageUpload, 
  currentImage = null, 
  label = "Upload Image",
  accept = "image/*"
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.image.url);
        onImageUpload(result.image.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-lime-500 bg-lime-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
