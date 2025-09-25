'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BannerSlider from '../../components/BannerSlider';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, Heart, ArrowRight } from 'lucide-react';

export default function Home() {
  const [homeContent, setHomeContent] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomeContent();
    fetchFeaturedEvents();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/homepage');
      const data = await response.json();
      if (Array.isArray(data)) {
        setHomeContent(data.filter(item => item.is_active));
      } else {
        setHomeContent([]);
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
      setHomeContent([]);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (Array.isArray(data)) {
        setFeaturedEvents(data.filter(event => event.is_active && event.is_featured).slice(0, 3));
      } else {
        setFeaturedEvents([]);
      }
    } catch (error) {
      console.error('Error fetching featured events:', error);
      setFeaturedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedContent = homeContent.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Banner */}
      <BannerSlider />

      <main>
        {/* Welcome Section */}
        {groupedContent.welcome && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Battersea Chapel
                </h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {groupedContent.welcome.map((item, index) => (
                  <div key={item.id} className={`${index % 2 === 1 ? 'lg:order-first' : ''}`}>
                    {item.image_url && (
                      <div className="mb-8 lg:mb-0">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    <div className={`${item.image_url ? 'lg:pl-8' : ''}`}>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {item.content}
                      </p>
                      {item.button_text && item.button_url && (
                        <Link
                          href={item.button_url}
                          className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                        >
                          {item.button_text}
                          <ArrowRight className="ml-2" size={20} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Upcoming Events
                </h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Join us for these special events and gatherings
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {event.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-lime-600 text-sm mb-2">
                        <Calendar size={16} className="mr-2" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      {event.location && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users size={16} className="mr-2" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/events"
                  className="inline-flex items-center bg-lime-500 text-white px-8 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                >
                  View All Events
                  <ChevronRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Services Section */}
        {groupedContent.services && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Our Services
                </h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedContent.services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                    {service.image_url && (
                      <div className="w-16 h-16 mx-auto mb-6">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {service.content}
                    </p>
                    {service.button_text && service.button_url && (
                      <Link
                        href={service.button_url}
                        className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium"
                      >
                        {service.button_text}
                        <ArrowRight className="ml-2" size={16} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-16 bg-lime-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-lime-100 text-xl mb-8 max-w-3xl mx-auto">
              Experience the warmth of our fellowship and grow in faith together. 
              Everyone is welcome at Battersea Chapel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center bg-white text-lime-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
              >
                <Heart className="mr-2" size={20} />
                Visit Us
              </Link>
              <Link
                href="/giving"
                className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-lime-600 transition-colors duration-200 font-semibold"
              >
                Support Our Mission
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
