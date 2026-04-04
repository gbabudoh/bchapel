'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BannerSlider from '../../components/BannerSlider';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, Heart, ArrowRight, MapPin } from 'lucide-react';

export default function Home() {
  const [homeContent, setHomeContent] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    fetchHomeContent();
    fetchFeaturedEvents();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/homepage');
      const data = await response.json();
      if (Array.isArray(data)) {
        setHomeContent(data.filter(item => item.isActive));
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
        setFeaturedEvents(data.filter(event => event.isActive && event.isFeatured).slice(0, 3));
      } else {
        setFeaturedEvents([]);
      }
    } catch (error) {
      console.error('Error fetching featured events:', error);
      setFeaturedEvents([]);
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
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  Who We Are
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                  Welcome to Battersea Chapel
                </h2>
                <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-20">
                {groupedContent.welcome.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex flex-col ${item.imageUrl ? 'lg:flex-row' : ''} gap-12 items-center ${
                      index % 2 === 1 && item.imageUrl ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {item.imageUrl && (
                      <div className="w-full lg:w-1/2">
                        <div className="relative">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
                          />
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5"></div>
                        </div>
                      </div>
                    )}
                    <div className={item.imageUrl ? 'w-full lg:w-1/2' : 'max-w-3xl mx-auto text-center'}>
                      <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-5">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {item.content}
                      </p>
                      {item.buttonText && item.buttonUrl && (
                        <Link
                          href={item.buttonUrl}
                          className="inline-flex items-center bg-lime-500 text-white px-7 py-3.5 rounded-xl hover:bg-lime-600 transition-colors duration-200 font-semibold shadow-sm"
                        >
                          {item.buttonText}
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
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  What's On
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                  Upcoming Events
                </h2>
                <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-5"></div>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">
                  Join us for these special events and gatherings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
                    >
                      {event.imageUrl ? (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-3 bg-lime-500"></div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="inline-flex items-center gap-2 bg-lime-50 text-lime-700 text-sm font-medium px-3 py-1.5 rounded-full mb-4 self-start">
                          <Calendar size={14} />
                          {eventDate.toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 mb-4 line-clamp-3 flex-1">
                          {event.description}
                        </p>
                        {event.location && (
                          <div className="flex items-center text-gray-400 text-sm mb-4">
                            <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                            {event.location}
                          </div>
                        )}
                        <Link
                          href={`/events/${event.id}`}
                          className="inline-flex items-center text-lime-600 hover:text-lime-700 font-semibold text-sm mt-auto"
                        >
                          Learn More
                          <ArrowRight className="ml-1.5" size={15} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-14">
                <Link
                  href="/events"
                  className="inline-flex items-center border-2 border-lime-500 text-lime-600 hover:bg-lime-500 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-colors duration-200"
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
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  How We Serve
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                  Our Services
                </h2>
                <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedContent.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center border-t-4 border-lime-500 group hover:-translate-y-1"
                  >
                    {service.imageUrl && (
                      <div className="w-16 h-16 mx-auto mb-6 bg-lime-50 rounded-full flex items-center justify-center">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-9 h-9 object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                      {service.content}
                    </p>
                    {service.buttonText && service.buttonUrl && (
                      <Link
                        href={service.buttonUrl}
                        className="inline-flex items-center text-lime-600 hover:text-lime-700 font-semibold text-sm"
                      >
                        {service.buttonText}
                        <ArrowRight className="ml-1.5" size={15} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="relative py-24 bg-gray-900 overflow-hidden">
          {/* Decorative lime accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-500"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lime-400 font-semibold uppercase tracking-widest text-xs mb-4">
              You Belong Here
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the warmth of our fellowship and grow in faith together.
              Everyone is welcome at Battersea Chapel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors duration-200 shadow-lg"
              >
                <Heart className="mr-2" size={20} />
                Visit Us
              </Link>
              <Link
                href="/giving"
                className="inline-flex items-center justify-center border-2 border-gray-600 hover:border-lime-500 text-gray-300 hover:text-lime-400 px-8 py-4 rounded-xl font-semibold text-base transition-colors duration-200"
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
