'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [footerItems, setFooterItems] = useState([]);

  useEffect(() => {
    fetchFooterItems();
  }, []);

  const fetchFooterItems = async () => {
    try {
      const response = await fetch('/api/footer');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setFooterItems(data.filter(item => item.isActive));
      } else {
        console.error('Error from API:', data.error || 'Unknown error');
        setFooterItems([]);
      }
    } catch (error) {
      console.error('Error fetching footer items:', error);
      setFooterItems([]);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      youtube: Youtube,
      mail: Mail,
      phone: Phone,
      mappin: MapPin,
    };
    const IconComponent = icons[iconName?.toLowerCase()] || Mail;
    return <IconComponent size={20} />;
  };

  // Group items by section
  const groupedItems = footerItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  // Sort items within each section by order_index
  Object.keys(groupedItems).forEach(section => {
    groupedItems[section].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  });

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-12 md:gap-x-16 md:gap-y-20">
          
          {/* Battersea Chapel Section */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-8">
              <Image
                src="/logo.png"
                alt="Battersea Chapel Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div className="ml-3">
                <h2 className="text-2xl font-bold text-white">Battersea Chapel</h2>
                <p className="text-lime-400 text-sm font-medium">Faith • Community • Hope</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed max-w-xs text-left">
              A place where faith meets community, and hearts find their home in Christ. 
              Join us as we grow together in love, service, and spiritual understanding.
            </p>

            {/* Contact Information */}
            {groupedItems.contact && (
              <div className="space-y-4 w-full">
                {groupedItems.contact.map((item) => (
                  <div key={item.id} className="flex items-start justify-start">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-lime-400">
                      {getIcon(item.icon)}
                    </div>
                    <div className="ml-3 text-left">
                      {item.url ? (
                        <a
                          href={item.url}
                          className="text-gray-300 hover:text-lime-400 transition-colors duration-200"
                        >
                          <div className="font-medium">{item.title}</div>
                          {item.content && (
                            <div className="text-sm text-gray-400 mt-1">{item.content}</div>
                          )}
                        </a>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-300">{item.title}</div>
                          {item.content && (
                            <div className="text-sm text-gray-400 mt-1">{item.content}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links Section - Middle */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-10 text-lime-400">
              Links
            </h3>
            
            <div className="space-y-8 w-fit text-left">
              {/* Navigation Links */}
              {groupedItems.links && (
                <div>
                  <ul className="space-y-5">
                    {groupedItems.links.map((item) => (
                      <li key={item.id}>
                        <a
                          href={item.url}
                          className="text-gray-300 hover:text-lime-400 transition-colors duration-200 flex items-center justify-start text-lg"
                        >
                          {item.icon && (
                            <span className="mr-3">{getIcon(item.icon)}</span>
                          )}
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Information Links */}
              {groupedItems.info && (
                <div className="pt-6">
                  <ul className="space-y-4">
                    {groupedItems.info.map((item) => (
                      <li key={item.id}>
                        {item.url ? (
                          <a
                            href={item.url}
                            className="text-gray-300 hover:text-lime-400 transition-colors duration-200 flex items-center justify-start text-lg"
                          >
                            {item.icon && (
                              <span className="mr-3">{getIcon(item.icon)}</span>
                            )}
                            {item.title}
                          </a>
                        ) : (
                          <div className="text-gray-300 flex items-center justify-start">
                            {item.icon && (
                              <span className="mr-3">{getIcon(item.icon)}</span>
                            )}
                            <div className="text-left">
                              <div className="font-medium text-lg">{item.title}</div>
                              {item.content && (
                                <div className="text-sm text-gray-400 mt-1">{item.content}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Section - Far Right */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-10 text-lime-400">
              Social
            </h3>

            {/* Social Media Links */}
            {groupedItems.social && (
              <div className="space-y-5 w-fit text-left">
                {groupedItems.social.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="text-gray-300 hover:text-lime-400 transition-colors duration-200 flex items-center justify-start text-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.icon && (
                      <span className="mr-3">{getIcon(item.icon)}</span>
                    )}
                    {item.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Battersea Chapel. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-lime-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-lime-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/contact" className="text-gray-400 hover:text-lime-400 transition-colors duration-200">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}