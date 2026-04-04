'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        router.push('/events');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      router.push('/events');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'long' }),
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

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <Link href="/events" className="text-lime-600 hover:text-lime-700">
              ← Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const dateInfo = formatDate(event.date);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <Link 
            href="/events"
            className="inline-flex items-center text-lime-600 hover:text-lime-700 mb-8 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Events
          </Link>

          {/* Event Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {event.imageUrl && (
              <div className="relative h-96">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <div className="text-3xl font-bold">{dateInfo.day}</div>
                    <div className="text-lg">{dateInfo.month}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                  {event.isFeatured && (
                    <span className="inline-block bg-lime-100 text-lime-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Featured Event
                    </span>
                  )}
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Share2 size={24} />
                </button>
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar size={20} className="mr-3 text-lime-500" />
                    <div>
                      <div className="font-semibold">{dateInfo.fullDate}</div>
                      <div className="text-sm text-gray-500">{dateInfo.weekday}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock size={20} className="mr-3 text-lime-500" />
                    <div>
                      <div className="font-semibold">{dateInfo.time}</div>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center text-gray-700">
                      <MapPin size={20} className="mr-3 text-lime-500" />
                      <div>
                        <div className="font-semibold">{event.location}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Description */}
              <div className="prose max-w-none">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                >
                  Contact Us for More Info
                </Link>
                <Link
                  href="/events"
                  className="border-2 border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                >
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}