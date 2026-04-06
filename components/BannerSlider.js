'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      setBanners(data.filter(banner => banner.isActive));
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative banner-slider overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={banners.length > 1}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full block object-cover object-center h-[320px] sm:h-[450px] md:h-[600px]"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex items-end justify-center text-center text-white px-5 pb-8 sm:pb-12 md:items-center md:pb-0">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 leading-tight animate-fade-in-up">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-5 md:mb-8 opacity-90 animate-fade-in-up animation-delay-200">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.buttonText && banner.buttonUrl && (
                    <button
                      onClick={(e) => { e.stopPropagation(); window.location.href = banner.buttonUrl; }}
                      className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-colors duration-200 inline-block animate-fade-in-up animation-delay-400"
                    >
                      {banner.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button className="swiper-button-prev-custom absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 group flex items-center justify-center">
            <svg className="w-4 h-4 md:w-6 md:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="swiper-button-next-custom absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 group flex items-center justify-center">
            <svg className="w-4 h-4 md:w-6 md:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {banners.length > 1 && (
        <div className="swiper-pagination-custom absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"></div>
      )}

      <style jsx>{`
        .banner-slider :global(.swiper-pagination-bullet-custom) {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 1;
        }
        
        .banner-slider :global(.swiper-pagination-bullet-custom:hover) {
          background: rgba(255, 255, 255, 0.75);
          transform: scale(1.1);
        }
        
        .banner-slider :global(.swiper-pagination-bullet-active-custom) {
          background: white;
          transform: scale(1.2);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}