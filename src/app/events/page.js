'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (Array.isArray(data)) {
        const activeEvents = data.filter(event => event.isActive);
        const now = new Date();
        setUpcomingEvents(
          activeEvents.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date))
        );
        setPastEvents(
          activeEvents.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
        );
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-GB', { month: 'short' }),
      weekday: date.toLocaleDateString('en-GB', { weekday: 'long' }),
      full: date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const EventCard = ({ event, past = false }) => {
    const dateInfo = formatDate(event.date);
    return (
      <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 ${past ? 'opacity-75 hover:opacity-100' : ''}`}>
        <div className="relative">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-3 bg-lime-500"></div>
          )}
          {/* Date badge */}
          <div className="absolute top-3 left-3 bg-white rounded-xl px-3 py-2 text-center shadow-md min-w-[52px]">
            <div className="text-lg font-bold text-gray-900 leading-none">{dateInfo.day}</div>
            <div className="text-xs text-lime-600 font-semibold uppercase mt-0.5">{dateInfo.month}</div>
          </div>
          {past && (
            <div className="absolute top-3 right-3 bg-gray-900/70 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
              Past
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{event.title}</h3>
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={13} className="mr-2 text-lime-500 flex-shrink-0" />
              {dateInfo.weekday} at {dateInfo.time}
            </div>
            {event.location && (
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={13} className="mr-2 text-lime-500 flex-shrink-0" />
                {event.location}
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm line-clamp-3 flex-1 mb-5">{event.description}</p>
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center justify-center border border-lime-500 text-lime-600 hover:bg-lime-500 hover:text-white py-2.5 rounded-xl font-medium text-sm transition-colors duration-200"
          >
            View Details
            <ArrowRight className="ml-1.5" size={14} />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-500"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lime-400 font-semibold uppercase tracking-widest text-xs mb-4">
            What's Happening
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Church Events</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Join us for worship, fellowship, and community events that strengthen our faith and bonds
          </p>
        </div>
      </section>

      <main>
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  Don't Miss Out
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Upcoming Events</h2>
                <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  Look Back
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Past Events</h2>
                <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} past />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Calendar size={36} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
              <p className="text-gray-500">Check back soon for upcoming events and gatherings.</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
