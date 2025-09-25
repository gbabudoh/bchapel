'use client';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode, Autoplay } from 'swiper/modules';
import { X, Download, Share2 } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function ImageGallery({ images = [], category = 'all', autoplay = false }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    if (category === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === category));
    }
  }, [images, category]);

  const openLightbox = (image, index) => {
    setSelectedImage({ ...image, index });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async (imageUrl, title) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Image from Battersea Chapel',
          url: imageUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(imageUrl);
      alert('Image URL copied to clipboard!');
    }
  };

  if (filteredImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No images available in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="image-gallery">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, FreeMode, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          autoplay={autoplay ? {
            delay: 3000,
            disableOnInteraction: false,
          } : false}
          className="gallery-swiper"
        >
          {filteredImages.map((image, index) => (
            <SwiperSlide key={image.id}>
              <div 
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => openLightbox(image, index)}
              >
                <div className="aspect-square">
                  <img
                    src={image.file_path}
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-3">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm truncate">{image.title}</h3>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
            >
              <X size={24} />
            </button>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <button
                onClick={() => downloadImage(selectedImage.file_path, selectedImage.original_name)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
                title="Download"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => shareImage(selectedImage.file_path, selectedImage.title)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Main Image Swiper */}
            <Swiper
              modules={[Navigation, Thumbs]}
              spaceBetween={10}
              slidesPerView={1}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              initialSlide={selectedImage.index}
              className="lightbox-swiper h-full"
            >
              {filteredImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={image.file_path}
                      alt={image.alt_text || image.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            {filteredImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  breakpoints={{
                    640: {
                      slidesPerView: 6,
                    },
                    768: {
                      slidesPerView: 8,
                    },
                  }}
                  freeMode={true}
                  watchSlidesProgress={true}
                  className="thumbs-swiper"
                >
                  {filteredImages.map((image) => (
                    <SwiperSlide key={`thumb-${image.id}`}>
                      <div className="aspect-square cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-200">
                        <img
                          src={image.file_path}
                          alt={image.alt_text || image.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* Image Info */}
            {selectedImage.title && (
              <div className="absolute bottom-20 left-4 right-4 text-center">
                <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.title}</h3>
                {selectedImage.alt_text && (
                  <p className="text-gray-300 text-sm">{selectedImage.alt_text}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .image-gallery :global(.gallery-swiper) {
          padding: 20px 0;
        }

        .image-gallery :global(.swiper-button-next),
        .image-gallery :global(.swiper-button-prev) {
          color: #84cc16;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .image-gallery :global(.swiper-button-next:after),
        .image-gallery :global(.swiper-button-prev:after) {
          font-size: 16px;
          font-weight: bold;
        }

        .image-gallery :global(.swiper-pagination-bullet) {
          background: #84cc16;
        }

        :global(.lightbox-swiper) {
          height: calc(100vh - 200px);
        }

        :global(.lightbox-swiper .swiper-button-next),
        :global(.lightbox-swiper .swiper-button-prev) {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        :global(.lightbox-swiper .swiper-button-next:hover),
        :global(.lightbox-swiper .swiper-button-prev:hover) {
          background: rgba(255, 255, 255, 0.3);
        }

        :global(.thumbs-swiper .swiper-slide-thumb-active) {
          opacity: 1;
          border: 2px solid #84cc16;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}