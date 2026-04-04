'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Heart, Shield, CreditCard, Smartphone, Clock } from 'lucide-react';

export default function GivingPage() {
  const [givingOptions, setGivingOptions] = useState([]);
  const [customAmounts, setCustomAmounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [donationType, setDonationType] = useState('one-time');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalSettings, setPaypalSettings] = useState({ email: '', currency: 'GBP' });


  useEffect(() => {
    fetchGivingOptions();
    fetchPaypalSettings();
  }, []);

  const fetchPaypalSettings = async () => {
    try {
      const response = await fetch('/api/paypal-settings');
      if (response.ok) {
        const data = await response.json();
        setPaypalSettings(data);
      }
    } catch (error) {
      console.error('Error fetching PayPal settings:', error);
    }
  };

  const fetchGivingOptions = async () => {
    try {
      const response = await fetch('/api/giving');
      const data = await response.json();
      if (Array.isArray(data)) {
        setGivingOptions(data.filter(option => option.isActive));
      } else {
        setGivingOptions([]);
      }
    } catch (error) {
      console.error('Error fetching giving options:', error);
      setGivingOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryKey = (title) => title.toLowerCase().replace(' ', '');

  const handleAmountChange = (optionId, value) => {
    setCustomAmounts(prev => ({ ...prev, [optionId]: value }));
  };

  const handlePayPalDonation = async (amount, type) => {
    setIsProcessing(true);
    try {
      const paypalEmail = paypalSettings.email || process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'gbabudoh@gmail.com';
      const currency = paypalSettings.currency || 'GBP';

      if (donationType === 'recurring') {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.paypal.com/cgi-bin/webscr';
        form.target = '_blank';
        const inputs = {
          cmd: '_xclick-subscriptions',
          business: paypalEmail,
          item_name: `Monthly ${type} - Battersea Chapel`,
          currency_code: currency,
          a3: amount, p3: '1', t3: 'M', src: '1', sra: '1',
          return: `${window.location.origin}/giving/thank-you?type=recurring&amount=${amount}`,
          cancel_return: `${window.location.origin}/giving`,
        };
        Object.keys(inputs).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = inputs[key];
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else {
        const paypalMeUrl = `https://www.paypal.me/${paypalEmail.split('@')[0]}/${amount}${currency}`;
        window.open(paypalMeUrl, '_blank');
        setTimeout(() => {
          window.location.href = `/giving/thank-you?type=one-time&amount=${amount}`;
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('There was an error processing your donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const defaultCategories = [
    { title: 'Tithe', description: 'Support the ongoing ministry and operations of our church' },
    { title: 'Offering', description: 'Special offerings for missions and community outreach' },
    { title: 'Support Fund', description: 'Help us maintain and improve our church facilities' },
  ];

  const DonationCard = ({ id, title, description }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 border-t-4 border-t-lime-500 p-7 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed flex-1">{description}</p>
      <div className="space-y-3">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">£</span>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent text-sm"
            value={customAmounts[id] || ''}
            onChange={(e) => handleAmountChange(id, e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            const amount = customAmounts[id];
            if (amount) handlePayPalDonation(amount, title);
          }}
          disabled={!customAmounts[id] || isProcessing}
          className="w-full bg-lime-500 hover:bg-lime-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-200"
        >
          {isProcessing ? 'Processing…' : `Donate${donationType === 'recurring' ? ' Monthly' : ''}`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-500"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={28} className="text-lime-400" />
          </div>
          <p className="text-lime-400 font-semibold uppercase tracking-widest text-xs mb-4">
            Give with Joy
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Support Our Mission</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Your generosity helps us serve our community and spread God's love
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-lime-500" /> Secure
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard size={14} className="text-lime-500" /> Easy
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone size={14} className="text-lime-500" /> Mobile Friendly
            </div>
          </div>
        </div>
      </section>

      <main className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
            </div>
          ) : (
            <div className="space-y-10">

              {/* Donation type selector */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Your Giving Method</h2>
                <div className="flex justify-center">
                  <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
                    <button
                      onClick={() => setDonationType('one-time')}
                      className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                        donationType === 'one-time'
                          ? 'bg-lime-500 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      One-Time Gift
                    </button>
                    <button
                      onClick={() => setDonationType('recurring')}
                      className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1.5 ${
                        donationType === 'recurring'
                          ? 'bg-lime-500 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <Clock size={14} />
                      Monthly Giving
                    </button>
                  </div>
                </div>
                {donationType === 'recurring' && (
                  <div className="mt-6 bg-lime-50 border border-lime-100 rounded-xl p-4">
                    <p className="text-lime-800 text-sm text-center">
                      <strong>Monthly Giving:</strong> Set up a recurring donation that processes automatically each month.
                      Modify or cancel anytime through your PayPal account.
                    </p>
                  </div>
                )}
              </div>

              {/* Giving cards */}
              {givingOptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {givingOptions.map((option) => (
                    <DonationCard
                      key={option.id}
                      id={option.id}
                      title={option.title}
                      description={option.description}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {defaultCategories.map((cat) => (
                    <DonationCard
                      key={cat.title}
                      id={getCategoryKey(cat.title)}
                      title={cat.title}
                      description={cat.description}
                    />
                  ))}
                </div>
              )}

              {/* Why we give */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Why We Give</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Giving is an act of worship and a way to participate in God's work in our community.
                      Your contributions help us maintain our facilities, support our ministries,
                      reach out to those in need, and spread the Gospel.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Every gift, no matter the size, makes a difference and is deeply appreciated.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Your Impact</h3>
                    <ul className="space-y-2.5 text-sm text-gray-600">
                      {[
                        'Support weekly worship services',
                        'Fund community outreach programs',
                        'Maintain and improve church facilities',
                        'Support missionary work',
                        'Provide resources for spiritual growth',
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Secure giving notice */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-lime-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-lime-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">Secure Giving</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  All donations are processed securely through PayPal. We never store your payment information.
                  You'll receive a confirmation email for your records, and donations may be tax-deductible.
                </p>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
