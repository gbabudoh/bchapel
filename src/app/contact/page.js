'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Home } from 'lucide-react';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      if (Array.isArray(data)) {
        setContactInfo(data.filter(info => info.isActive));
      } else {
        setContactInfo([]);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setContactInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });
    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormStatus({ type: 'success', message: "Thank you for your message! We'll get back to you soon." });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      setFormStatus({ type: 'error', message: 'Sorry, there was an error sending your message. Please try again or contact us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = { mail: Mail, phone: Phone, mappin: MapPin, address: Home, clock: Clock };
    const IconComponent = icons[iconName?.toLowerCase()] || Mail;
    return <IconComponent size={20} className="text-lime-500" />;
  };

  const groupedInfo = contactInfo.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
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
            We&apos;d Love to Hear From You
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Contact Us</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Reach out with any questions, prayer requests, or just to say hello
          </p>
        </div>
      </section>

      <main className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Contact info + map */}
            <div className="space-y-8">
              <div>
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-2">Find Us</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              </div>

              {Object.entries(groupedInfo).map(([type, items]) => (
                <div key={type}>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    {type.replace('_', ' ')}
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex-shrink-0 w-9 h-9 bg-lime-50 rounded-lg flex items-center justify-center">
                          {getIcon(item.icon)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                          <p className="text-gray-800 font-medium">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Map */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Our Location</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.540562219524!2d-0.17037368422918447!3d51.47622797963176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760566abcb5bf1%3A0x5c1b0c8b5c1b0c8b!2sBattersea%2C%20London%2C%20UK!5e0!3m2!1sen!2sus!4v1635789012345!5m2!1sen!2sus"
                    width="100%"
                    height="260"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Battersea Chapel Location"
                  ></iframe>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 border-t border-gray-100">
                    <Home size={14} className="text-lime-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">83 Thomas Baines Rd, London SW11 2HH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <div className="mb-8">
                <p className="text-lime-600 font-semibold uppercase tracking-widest text-xs mb-2">Send a Message</p>
                <h2 className="text-3xl font-bold text-gray-900">We&apos;re Here to Help</h2>
              </div>

              {formStatus.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                  formStatus.type === 'success'
                    ? 'bg-lime-50 text-lime-800 border border-lime-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {formStatus.type === 'success'
                    ? <CheckCircle size={18} className="text-lime-600 mt-0.5 flex-shrink-0" />
                    : <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />}
                  <p className="text-sm">{formStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-lime-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-colors duration-200 text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-lime-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-colors duration-200 text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject <span className="text-lime-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-colors duration-200 text-sm"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message <span className="text-lime-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-colors duration-200 resize-vertical text-sm"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-lime-500 hover:bg-lime-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Prayer request note */}
              <div className="mt-5 p-5 bg-lime-50 rounded-xl border border-lime-100">
                <h3 className="font-semibold text-lime-800 mb-1.5 text-sm">Prayer Requests</h3>
                <p className="text-lime-700 text-sm leading-relaxed">
                  If you have a prayer request, please mention it in your message.
                  Our prayer team will lift you up with confidentiality and care.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
