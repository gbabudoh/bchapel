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
        const sortedContent = data
          .filter(content => content.isActive)
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        setAboutContent(sortedContent);
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
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  Object.keys(groupedContent).forEach(section => {
    groupedContent[section].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  });

  const sectionLabel = (name) => ({
    pastor: { eyebrow: 'Leadership', title: "Pastor's Message" },
    mission: { eyebrow: 'Purpose', title: 'Our Mission' },
    values: { eyebrow: 'What Drives Us', title: 'Our Values' },
    history: { eyebrow: 'Our Journey', title: 'Our History' },
    beliefs: { eyebrow: 'Faith', title: 'What We Believe' },
    hero: { eyebrow: 'Welcome', title: 'About Us' },
  }[name] || { eyebrow: 'About', title: name.charAt(0).toUpperCase() + name.slice(1) });

  const TwoColumnSection = ({ item }) => {
    const isImageLeft = item.layout !== 'image-right';
    return (
      <div className={`flex flex-col ${item.imageUrl ? 'lg:flex-row' : ''} gap-12 items-center ${!isImageLeft && item.imageUrl ? 'lg:flex-row-reverse' : ''}`}>
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
        <div className={item.imageUrl ? 'w-full lg:w-1/2' : 'max-w-3xl mx-auto'}>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-5">{item.title}</h3>
          <div className="text-gray-600 text-lg leading-relaxed space-y-2">
            {item.content?.split('\n\n').map((para, i) => (
              <p key={i}>{para.split('\n').map((line, j, arr) => (
                <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
              ))}</p>
            ))}
          </div>
        </div>
      </div>
    );
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

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-500"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lime-400 font-semibold uppercase tracking-widest text-xs mb-4">
            Our Story
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">About Us</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Discover our story, mission, and the heart behind Battersea Chapel
          </p>
        </div>
      </section>

      <main>
        {aboutContent.map((item, index) => {
          const isFirstInSection = index === 0 || aboutContent[index - 1].section !== item.section;
          if (!isFirstInSection) return null;

          const sectionItems = aboutContent.filter(c => c.section === item.section);
          const sectionName = item.section;
          const { eyebrow, title } = sectionLabel(sectionName);
          const isEven = Object.keys(groupedContent).indexOf(sectionName) % 2 === 0;

          return (
            <section
              key={sectionName}
              className={`py-20 ${isEven ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-3">
                    {eyebrow}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                    {title}
                  </h2>
                  <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full"></div>
                </div>

                {sectionName === 'values' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sectionItems.map((value, valueIndex) => {
                      const icons = [Heart, Users, Book, Star];
                      const IconComponent = icons[valueIndex % icons.length];
                      return (
                        <div
                          key={value.id}
                          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center border-t-4 border-lime-500 hover:-translate-y-1"
                        >
                          <div className="w-14 h-14 bg-lime-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IconComponent size={26} className="text-lime-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                          <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">{value.content}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : sectionName === 'beliefs' ? (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {sectionItems.map((belief) => (
                      <div
                        key={belief.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-lime-500 p-8"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{belief.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{belief.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-20">
                    {sectionItems.map((sectionItem) => (
                      <TwoColumnSection key={sectionItem.id} item={sectionItem} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {aboutContent.length === 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400 text-lg">About content coming soon.</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
