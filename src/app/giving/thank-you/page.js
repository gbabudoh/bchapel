'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import { Heart, CheckCircle, Mail, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [donationDetails, setDonationDetails] = useState({
    type: 'one-time',
    amount: '0'
  });

  useEffect(() => {
    const type = searchParams.get('type') || 'one-time';
    const amount = searchParams.get('amount') || '0';
    setDonationDetails({ type, amount });
  }, [searchParams]);

  const shareMessage = `I just made a donation to Battersea Chapel! Join me in supporting their ministry. ${typeof window !== 'undefined' ? window.location.origin : ''}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Supporting Battersea Chapel',
          text: 'I just made a donation to Battersea Chapel!',
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareMessage);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50">
      <Navigation />
      
      {/* Thank You Header */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lime-400 to-green-500"></div>
            
            {/* Success icon */}
            <div className="relative">
              <div className="mx-auto w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center mb-8">
                <CheckCircle className="h-12 w-12 text-lime-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Thank You!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Your generous {donationDetails.type === 'recurring' ? 'monthly' : ''} donation of 
                <span className="font-semibold text-lime-600"> £{donationDetails.amount}</span> has been received. 
                Your heart for giving blesses our entire community.
              </p>

              {/* Donation Details */}
              <div className="bg-lime-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Donation Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">£{donationDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">
                      {donationDetails.type === 'recurring' ? 'Monthly Recurring' : 'One-Time'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <Mail className="h-8 w-8 text-lime-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Confirmation Email</h4>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive a confirmation email from PayPal for your records
                  </p>
                </div>
                
                {donationDetails.type === 'recurring' && (
                  <div className="text-center p-4">
                    <Calendar className="h-8 w-8 text-lime-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Monthly Processing</h4>
                    <p className="text-sm text-gray-600">
                      Your donation will process automatically each month
                    </p>
                  </div>
                )}
                
                <div className="text-center p-4">
                  <Heart className="h-8 w-8 text-lime-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Making a Difference</h4>
                  <p className="text-sm text-gray-600">
                    Your gift directly supports our ministry and community outreach
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
                
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 transition-colors duration-200"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                
                <Link 
                  href="/giving"
                  className="text-lime-600 hover:text-lime-700 font-medium transition-colors duration-200"
                >
                  Make Another Donation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Impact in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how your generous giving is making a real difference in our community and beyond
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-lime-50 rounded-lg">
              <div className="text-3xl font-bold text-lime-600 mb-2">150+</div>
              <div className="text-gray-900 font-semibold mb-2">Families Served</div>
              <div className="text-sm text-gray-600">
                Through our food pantry and community outreach programs
              </div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">25</div>
              <div className="text-gray-900 font-semibold mb-2">Youth Programs</div>
              <div className="text-sm text-gray-600">
                Weekly activities and mentorship for local youth
              </div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
              <div className="text-gray-900 font-semibold mb-2">Mission Trips</div>
              <div className="text-sm text-gray-600">
                Supporting communities locally and internationally
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-xl italic text-gray-700 mb-6">
            &ldquo;Give, and it will be given to you. A good measure, pressed down, shaken together 
            and running over, will be poured into your lap. For with the measure you use, 
            it will be measured to you.&rdquo;
          </blockquote>
          <cite className="text-lime-600 font-semibold">Luke 6:38</cite>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}