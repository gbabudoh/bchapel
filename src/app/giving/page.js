'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Heart, DollarSign, Shield, CreditCard, Smartphone, Clock } from 'lucide-react';

export default function GivingPage() {
  const [givingOptions, setGivingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [donationType, setDonationType] = useState('one-time');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchGivingOptions();
  }, []);

  const fetchGivingOptions = async () => {
    try {
      const response = await fetch('/api/giving');
      const data = await response.json();
      if (Array.isArray(data)) {
        setGivingOptions(data.filter(option => option.is_active));
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

  const handlePayPalDonation = async (amount, type) => {
    setIsProcessing(true);
    
    try {
      // Enhanced PayPal integration
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = donationType === 'recurring' 
        ? 'https://www.paypal.com/cgi-bin/webscr'
        : 'https://www.paypal.com/donate';
      form.target = '_blank';

      let inputs = {};

      if (donationType === 'recurring') {
        inputs = {
          cmd: '_xclick-subscriptions',
          business: process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'donations@batterseachapel.com',
          item_name: `Monthly ${type} - Battersea Chapel`,
          currency_code: 'USD',
          a3: amount, // Recurring amount
          p3: '1', // Every 1 month
          t3: 'M', // Month
          src: '1', // Recurring
          sra: '1', // Reattempt on failure
          return: `${window.location.origin}/giving/thank-you?type=recurring&amount=${amount}`,
          cancel_return: `${window.location.origin}/giving`,
          notify_url: `${window.location.origin}/api/paypal/webhook`
        };
      } else {
        inputs = {
          business: process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'donations@batterseachapel.com',
          amount: amount,
          currency_code: 'USD',
          item_name: `${type} - Battersea Chapel`,
          return: `${window.location.origin}/giving/thank-you?type=one-time&amount=${amount}`,
          cancel_return: `${window.location.origin}/giving`,
          notify_url: `${window.location.origin}/api/paypal/webhook`
        };
      }

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
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('There was an error processing your donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Heart className="mx-auto h-16 w-16 mb-6 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Give with Joy</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Your generosity helps us serve our community and spread God's love
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm opacity-80">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Secure
            </div>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Easy
            </div>
            <div className="flex items-center">
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile Friendly
            </div>
          </div>
        </div>
      </div>

      {/* Giving Content */}
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Donation Type Selector */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Choose Your Giving Method
                </h2>
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 rounded-lg p-1 flex">
                    <button
                      onClick={() => setDonationType('one-time')}
                      className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                        donationType === 'one-time'
                          ? 'bg-lime-500 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      One-Time Gift
                    </button>
                    <button
                      onClick={() => setDonationType('recurring')}
                      className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                        donationType === 'recurring'
                          ? 'bg-lime-500 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Clock className="inline h-4 w-4 mr-2" />
                      Monthly Giving
                    </button>
                  </div>
                </div>
                
                {donationType === 'recurring' && (
                  <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-6">
                    <p className="text-lime-800 text-sm">
                      <strong>Monthly Giving:</strong> Set up a recurring donation that automatically processes each month. 
                      You can modify or cancel anytime through your PayPal account.
                    </p>
                  </div>
                )}
              </div>

              {/* Giving Options */}
              {givingOptions.map((option) => (
                <div key={option.id} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {option.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {option.description}
                  </p>

                  {/* Suggested Amounts */}
                  {option.suggested_amounts && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Suggested Amounts {donationType === 'recurring' && '(Monthly)'}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {JSON.parse(option.suggested_amounts).map((amount, index) => (
                          <button
                            key={index}
                            onClick={() => handlePayPalDonation(amount, option.title)}
                            disabled={isProcessing}
                            className="bg-lime-100 hover:bg-lime-200 disabled:opacity-50 text-lime-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            ${amount}{donationType === 'recurring' && '/mo'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Amount */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Custom Amount {donationType === 'recurring' && '(Monthly)'}
                    </h3>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Enter amount"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => customAmount && handlePayPalDonation(customAmount, option.title)}
                        disabled={!customAmount || isProcessing}
                        className="bg-lime-500 hover:bg-lime-600 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        {isProcessing ? 'Processing...' : `Donate${donationType === 'recurring' ? ' Monthly' : ''}`}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Default giving options if none are configured */}
              {givingOptions.length === 0 && (
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Tithe',
                      description: 'Support the ongoing ministry and operations of our church',
                      amounts: [25, 50, 100, 250]
                    },
                    {
                      title: 'Offering',
                      description: 'Special offerings for missions and community outreach',
                      amounts: [20, 40, 75, 150]
                    },
                    {
                      title: 'Building Fund',
                      description: 'Help us maintain and improve our church facilities',
                      amounts: [50, 100, 200, 500]
                    }
                  ].map((category) => (
                    <div key={category.title} className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                      <p className="text-gray-600 mb-6 text-sm">
                        {category.description}
                      </p>
                      <div className="space-y-3">
                        {category.amounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => handlePayPalDonation(amount, category.title)}
                            disabled={isProcessing}
                            className="w-full bg-lime-100 hover:bg-lime-200 disabled:opacity-50 text-lime-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            ${amount}{donationType === 'recurring' && '/mo'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enhanced Information Section */}
              <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-lg p-8 border border-lime-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Why We Give
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Giving is an act of worship and a way to participate in God's work in our community. 
                      Your generous contributions help us maintain our facilities, support our ministries, 
                      reach out to those in need, and spread the Gospel.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Every gift, no matter the size, makes a difference and is deeply appreciated.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Your Impact</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Support weekly worship services</li>
                      <li>• Fund community outreach programs</li>
                      <li>• Maintain and improve church facilities</li>
                      <li>• Support missionary work</li>
                      <li>• Provide resources for spiritual growth</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Secure Giving</h3>
                </div>
                <p className="text-blue-800 text-sm">
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