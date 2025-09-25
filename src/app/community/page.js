'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Heart, Users, Calendar, MapPin, Clock, ArrowRight, Mail, Phone } from 'lucide-react';

export default function CommunityPage() {
  const [communityContent, setCommunityContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCommunityContent();
  }, []);

  const fetchCommunityContent = async () => {
    try {
      const response = await fetch('/api/community');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCommunityContent(data.filter(content => content.is_active));
      } else {
        setCommunityContent([]);
      }
    } catch (error) {
      console.error('Error fetching community content:', error);
      setCommunityContent([]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedContent = communityContent.reduce((acc, item) => {
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
          <h1 className="text-5xl font-bold mb-4">Our Community</h1>
          <p className="text-xl text-lime-100 max-w-3xl mx-auto">
            Join our vibrant community of faith, fellowship, and service. Everyone is welcome at Battersea Chapel.
          </p>
        </div>
      </section>

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Section */}
          {groupedContent.welcome && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Family</h2>
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">{item.content}</p>
                      {item.button_text && item.button_url && (
                        <a
                          href={item.button_url}
                          className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                        >
                          {item.button_text}
                          <ArrowRight className="ml-2" size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Programs Section */}
          {groupedContent.programs && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Programs</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Discover the many ways to get involved and grow in faith together
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedContent.programs.map((program) => (
                  <div key={program.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {program.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={program.image_url}
                          alt={program.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{program.content}</p>
                      {program.button_text && program.button_url && (
                        <a
                          href={program.button_url}
                          className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium"
                        >
                          {program.button_text}
                          <ArrowRight className="ml-2" size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ministries Section */}
          {groupedContent.ministries && (
            <section className="mb-20 bg-gray-50 rounded-2xl p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Ministries</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Serving our community and beyond through various ministry opportunities
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {groupedContent.ministries.map((ministry) => (
                  <div key={ministry.id} className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      {ministry.image_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={ministry.image_url}
                            alt={ministry.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{ministry.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{ministry.content}</p>
                        {ministry.button_text && ministry.button_url && (
                          <a
                            href={ministry.button_url}
                            className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium"
                          >
                            {ministry.button_text}
                            <ArrowRight className="ml-2" size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Community Stats */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                See how our community is making a difference together
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-lime-50 rounded-lg">
                <div className="text-4xl font-bold text-lime-600 mb-2">500+</div>
                <div className="text-gray-900 font-semibold mb-2">Community Members</div>
                <div className="text-sm text-gray-600">Active participants in our programs</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">25</div>
                <div className="text-gray-900 font-semibold mb-2">Weekly Programs</div>
                <div className="text-sm text-gray-600">Regular activities and services</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">150+</div>
                <div className="text-gray-900 font-semibold mb-2">Families Served</div>
                <div className="text-sm text-gray-600">Through outreach programs</div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="text-4xl font-bold text-orange-600 mb-2">12</div>
                <div className="text-gray-900 font-semibold mb-2">Years of Service</div>
                <div className="text-sm text-gray-600">Serving the Battersea community</div>
              </div>
            </div>
          </section>

          {/* Get Involved Section */}
          {groupedContent.involvement && groupedContent.involvement.length > 0 ? (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Involved</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  There are many ways to connect and contribute to our community
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedContent.involvement.map((item) => (
                  <div key={item.id} className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {item.image_url && (
                      <div className="w-20 h-20 mx-auto mb-6">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{item.content}</p>
                    {item.button_text && item.button_url && (
                      <a
                        href={item.button_url}
                        className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                      >
                        {item.button_text}
                        <ArrowRight className="ml-2" size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Involved</h2>
                <div className="w-24 h-1 bg-lime-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  There are many ways to connect and contribute to our community
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="text-lime-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Join a Small Group</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Connect with others in intimate settings for Bible study, prayer, and fellowship.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2" size={16} />
                  </a>
                </div>
                <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Volunteer</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Use your gifts and talents to serve others in our community and beyond.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2" size={16} />
                  </a>
                </div>
                <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="text-purple-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Attend Events</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Join us for special events, workshops, and community gatherings throughout the year.
                  </p>
                  <a
                    href="/events"
                    className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                  >
                    View Events
                    <ArrowRight className="ml-2" size={16} />
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="bg-lime-500 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-lime-100 text-lg mb-8 max-w-2xl mx-auto">
              We'd love to welcome you into our family. Come as you are and discover 
              the love, fellowship, and purpose that awaits you at Battersea Chapel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center bg-white text-lime-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
              >
                <Mail className="mr-2" size={20} />
                Contact Us
              </a>
              <a
                href="/events"
                className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-lime-600 transition-colors duration-200 font-semibold"
              >
                <Calendar className="mr-2" size={20} />
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