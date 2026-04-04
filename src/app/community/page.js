'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Heart, Users, Calendar, ArrowRight } from 'lucide-react';

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
        setCommunityContent(data.filter(content => content.isActive));
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
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

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

  const defaultInvolvement = [
    {
      icon: Users,
      title: 'Join a Small Group',
      description: 'Connect with others in intimate settings for Bible study, prayer, and fellowship.',
      href: '/contact',
      label: 'Learn More',
    },
    {
      icon: Heart,
      title: 'Volunteer',
      description: 'Use your gifts and talents to serve others in our community and beyond.',
      href: '/contact',
      label: 'Get Started',
    },
    {
      icon: Calendar,
      title: 'Attend Events',
      description: 'Join us for special events, workshops, and community gatherings throughout the year.',
      href: '/events',
      label: 'View Events',
    },
  ];

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
            Together We Grow
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Our Community</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Join our vibrant community of faith, fellowship, and service. Everyone is welcome at Battersea Chapel.
          </p>
        </div>
      </section>

      <main>
        {/* Welcome Section */}
        {groupedContent.welcome && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  Welcome
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Welcome to Our Family</h2>
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
                      <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-5">{item.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">{item.content}</p>
                      {item.buttonText && item.buttonUrl && (
                        <a
                          href={item.buttonUrl}
                          className="inline-flex items-center bg-lime-500 text-white px-7 py-3.5 rounded-xl hover:bg-lime-600 transition-colors duration-200 font-semibold shadow-sm"
                        >
                          {item.buttonText}
                          <ArrowRight className="ml-2" size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Programs Section */}
        {groupedContent.programs && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  Get Involved
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Community Programs</h2>
                <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-5"></div>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                  Discover the many ways to get involved and grow in faith together
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedContent.programs.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 border-t-4 border-t-lime-500 flex flex-col"
                  >
                    {program.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={program.imageUrl}
                          alt={program.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{program.title}</h3>
                      <p className="text-gray-500 mb-5 leading-relaxed flex-1">{program.content}</p>
                      {program.buttonText && program.buttonUrl && (
                        <a
                          href={program.buttonUrl}
                          className="inline-flex items-center text-lime-600 hover:text-lime-700 font-semibold text-sm"
                        >
                          {program.buttonText}
                          <ArrowRight className="ml-1.5" size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ministries Section */}
        {groupedContent.ministries && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                  Areas of Service
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Our Ministries</h2>
                <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-5"></div>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                  Serving our community and beyond through various ministry opportunities
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedContent.ministries.map((ministry) => (
                  <div
                    key={ministry.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-lime-500 p-7 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-5">
                      {ministry.imageUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={ministry.imageUrl}
                            alt={ministry.title}
                            className="w-14 h-14 object-cover rounded-xl"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{ministry.title}</h3>
                        <p className="text-gray-500 leading-relaxed mb-4">{ministry.content}</p>
                        {ministry.buttonText && ministry.buttonUrl && (
                          <a
                            href={ministry.buttonUrl}
                            className="inline-flex items-center text-lime-600 hover:text-lime-700 font-semibold text-sm"
                          >
                            {ministry.buttonText}
                            <ArrowRight className="ml-1.5" size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Get Involved */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                Take the Next Step
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Get Involved</h2>
              <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-5"></div>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                There are many ways to connect and contribute to our community
              </p>
            </div>

            {groupedContent.involvement && groupedContent.involvement.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedContent.involvement.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center border-t-4 border-lime-500 hover:-translate-y-1"
                  >
                    {item.imageUrl && (
                      <div className="w-14 h-14 bg-lime-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <img src={item.imageUrl} alt={item.title} className="w-8 h-8 object-contain" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-500 mb-7 leading-relaxed">{item.content}</p>
                    {item.buttonText && item.buttonUrl && (
                      <a
                        href={item.buttonUrl}
                        className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-xl hover:bg-lime-600 transition-colors duration-200 font-semibold"
                      >
                        {item.buttonText}
                        <ArrowRight className="ml-2" size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {defaultInvolvement.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center border-t-4 border-lime-500 hover:-translate-y-1"
                    >
                      <div className="w-14 h-14 bg-lime-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconComponent size={26} className="text-lime-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-500 mb-7 leading-relaxed">{item.description}</p>
                      <a
                        href={item.href}
                        className="inline-flex items-center bg-lime-500 text-white px-6 py-3 rounded-xl hover:bg-lime-600 transition-colors duration-200 font-semibold"
                      >
                        {item.label}
                        <ArrowRight className="ml-2" size={16} />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
