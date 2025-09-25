'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const activeEvents = data.filter(event => event.is_active);
        const now = new Date();
        
        // Separate featured and upcoming events
        const featured = activeEvents.filter(event => event.is_featured);
        const upcoming = activeEvents.filter(event => new Date(event.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setEvents(activeEvents);
        setFeaturedEvents(featured);
        setUpcomingEvents(upcoming);
      } else {
        setEvents([]);
        setFeaturedEvents([]);
        setUpcomingEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setFeaturedEvents([]);
      setUpcomingEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Church Events</h1>
          <p className="text-xl text-lime-100 max-w-3xl mx-auto">
            Join us for worship, fellowship, and community events that strengthen our faith and bonds
          </p>
        </div>
      </section>

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Events</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredEvents.map((event) => {
                  const dateInfo = formatDate(event.date);
                  return (
                    <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center">
                            <Calendar size={64} className="text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white rounded-lg p-3 text-center shadow-lg">
                          <div className="text-2xl font-bold text-gray-900">{dateInfo.day}</div>
                          <div className="text-sm text-lime-600 font-semibold">{dateInfo.month}</div>
                        </div>
                        <div className="absolute top-4 right-4 bg-lime-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Clock size={16} className="mr-2 text-lime-500" />
                          <span>{dateInfo.fullDate} at {dateInfo.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin size={16} className="mr-2 text-lime-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
                        <button className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200">
                          Learn More
                          <ArrowRight className="ml-2" size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Don't miss these upcoming gatherings</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => {
                  const dateInfo = formatDate(event.date);
                  return (
                    <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Calendar size={48} className="text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-white rounded-lg p-2 text-center shadow-md">
                          <div className="text-lg font-bold text-gray-900">{dateInfo.day}</div>
                          <div className="text-xs text-lime-600 font-semibold">{dateInfo.month}</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <Clock size={14} className="mr-2 text-lime-500" />
                          <span>{dateInfo.weekday} at {dateInfo.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <MapPin size={14} className="mr-2 text-lime-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">{event.description}</p>
                        <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-lime-50 hover:text-lime-700 transition-colors duration-200 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* No Events Message */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
              <p className="text-gray-600">Check back soon for upcoming events and gatherings.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}