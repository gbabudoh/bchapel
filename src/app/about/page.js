'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Heart, Users, Book, Star } from 'lucide-react';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAboutContent(data.filter(content => content.is_active));
      } else {
        setAboutContent([]);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
      setAboutContent([]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedContent = aboutContent.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

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
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-lime-100 max-w-3xl mx-auto">
            Discover our story, mission, and the heart behind Battersea Chapel
          </p>
        </div>
      </section>

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mission Section */}
          {groupedContent.mission && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {groupedContent.mission.map((item, index) => (
                  <div key={item.id} className={`${index % 2 === 1 ? 'lg:order-first' : ''}`}>
                    {item.image_url && (
                      <div className="mb-8 lg:mb-0">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-96 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                    )}
                    <div className={`${item.image_url ? 'lg:pl-8' : ''}`}>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">{item.title}</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Values Section */}
          {groupedContent.values && (
            <section className="mb-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">The principles that guide our community</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedContent.values.map((value, index) => {
                  const icons = [Heart, Users, Book, Star];
                  const IconComponent = icons[index % icons.length];
                  
                  return (
                    <div key={value.id} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                      <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconComponent size={32} className="text-lime-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{value.content}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* History Section */}
          {groupedContent.history && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our History</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto"></div>
              </div>
              <div className="space-y-12">
                {groupedContent.history.map((item, index) => (
                  <div key={item.id} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    {item.image_url && (
                      <div className="lg:w-1/2">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-80 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                    )}
                    <div className="lg:w-1/2">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Beliefs Section */}
          {groupedContent.beliefs && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Believe</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">The foundation of our faith</p>
              </div>
              <div className="max-w-4xl mx-auto">
                {groupedContent.beliefs.map((belief) => (
                  <div key={belief.id} className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{belief.title}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{belief.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="bg-lime-500 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Family</h2>
            <p className="text-lime-100 text-lg mb-8 max-w-2xl mx-auto">
              We'd love to welcome you into our community. Come as you are and discover 
              the love and fellowship that awaits you at Battersea Chapel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center bg-white text-lime-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
              >
                Visit Us
              </a>
              <a
                href="/events"
                className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-lime-600 transition-colors duration-200 font-semibold"
              >
                View Events
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}