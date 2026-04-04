import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image
export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'bchapel',
      resource_type: 'auto',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Helper function to delete image
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};
