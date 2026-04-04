'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { User, ArrowRight } from 'lucide-react';

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/leadership');
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeaders(data.filter(leader => leader.isActive).sort((a, b) => a.orderIndex - b.orderIndex));
      } else {
        setLeaders([]);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      setLeaders([]);
    } finally {
      setIsLoading(false);
    }
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
            Meet the Team
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Our Leadership</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated individuals who guide our church community with wisdom, compassion, and faith
          </p>
        </div>
      </section>

      <main className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {leaders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    {leader.imageUrl ? (
                      <img
                        src={leader.imageUrl}
                        alt={leader.name}
                        className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
                        <User size={64} className="text-gray-300" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="p-7">
                    <p className="text-lime-600 text-xs font-semibold uppercase tracking-widest mb-1">
                      {leader.position}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{leader.name}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm line-clamp-4">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <User size={36} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leadership Information</h3>
              <p className="text-gray-500">Leadership profiles will be displayed here once added.</p>
            </div>
          )}
        </div>
      </main>

      {/* CTA */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-500"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect With Our Leaders</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Our leadership team is here to serve and support you on your spiritual journey.
            Reach out with any questions or prayer requests.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200 shadow-lg"
          >
            Contact Us
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
