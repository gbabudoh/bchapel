'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { User, Mail, Phone, Linkedin, Twitter } from 'lucide-react';

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
        setLeaders(data.filter(leader => leader.is_active).sort((a, b) => a.order_index - b.order_index));
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
          <h1 className="text-5xl font-bold mb-4">Our Leadership</h1>
          <p className="text-xl text-lime-100 max-w-3xl mx-auto">
            Meet the dedicated individuals who guide our church community with wisdom, compassion, and faith
          </p>
        </div>
      </section>

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {leaders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => (
                <div key={leader.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    {leader.image_url ? (
                      <img
                        src={leader.image_url}
                        alt={leader.name}
                        className="w-full h-80 object-cover"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gradient-to-br from-lime-100 to-lime-200 flex items-center justify-center">
                        <User size={80} className="text-lime-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex space-x-3">
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200">
                            <Mail size={18} />
                          </button>
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200">
                            <Phone size={18} />
                          </button>
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200">
                            <Linkedin size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                    <p className="text-lime-600 font-semibold mb-4">{leader.position}</p>
                    <p className="text-gray-700 leading-relaxed">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <User size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Leadership Information</h3>
              <p className="text-gray-600">Leadership profiles will be displayed here once added.</p>
            </div>
          )}

          {/* Call to Action */}
          <section className="mt-20 bg-gray-50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Our Leaders</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our leadership team is here to serve and support you on your spiritual journey. 
              Feel free to reach out with any questions or prayer requests.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-lime-500 text-white px-8 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200 font-semibold"
            >
              Contact Us
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}