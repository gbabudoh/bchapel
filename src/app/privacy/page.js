import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { Shield, Database, Share2, Cookie, Lock, UserCheck, Link, RefreshCw, Mail } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Battersea Chapel',
};

const sections = [
  {
    icon: Shield,
    number: '01',
    title: 'Introduction',
    content: (
      <p className="text-gray-600 leading-relaxed">
        Battersea Chapel (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or engage with our services.
      </p>
    ),
  },
  {
    icon: Database,
    number: '02',
    title: 'Information We Collect',
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-5">We may collect the following types of information:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Personal Information', desc: 'Name, email address, phone number, and contact details you provide via forms.' },
            { label: 'Donation Information', desc: 'Payments are processed securely through PayPal. We do not store card details.' },
            { label: 'Usage Data', desc: 'Pages visited, time spent on site, and browser type to improve your experience.' },
            { label: 'Communication Data', desc: 'Records of correspondence when you contact us by email or through our website.' },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="font-semibold text-gray-900 mb-1 text-sm">{item.label}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    icon: UserCheck,
    number: '03',
    title: 'How We Use Your Information',
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-5">We use the information we collect to:</p>
        <ul className="space-y-3">
          {[
            'Respond to your enquiries and prayer requests',
            'Process donations and send receipts',
            'Send newsletters and updates (only with your consent)',
            'Improve our website and services',
            'Comply with legal obligations',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded-full bg-lime-100 flex-shrink-0 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-lime-500 block"></span>
              </span>
              <span className="text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: Share2,
    number: '04',
    title: 'Sharing Your Information',
    content: (
      <p className="text-gray-600 leading-relaxed">
        We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers (such as PayPal for payment processing) solely to operate our website and services. These providers are obligated to keep your information confidential.
      </p>
    ),
  },
  {
    icon: Cookie,
    number: '05',
    title: 'Cookies',
    content: (
      <p className="text-gray-600 leading-relaxed">
        Our website may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us understand how visitors use our site. You can choose to disable cookies through your browser settings, though this may affect some functionality.
      </p>
    ),
  },
  {
    icon: Lock,
    number: '06',
    title: 'Data Security',
    content: (
      <p className="text-gray-600 leading-relaxed">
        We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
      </p>
    ),
  },
  {
    icon: UserCheck,
    number: '07',
    title: 'Your Rights',
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-5">Under UK GDPR, you have the right to:</p>
        <ul className="space-y-3 mb-6">
          {[
            'Access the personal data we hold about you',
            'Request correction of inaccurate data',
            'Request deletion of your data',
            'Object to or restrict how we process your data',
            'Withdraw consent at any time where processing is based on consent',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded-full bg-lime-100 flex-shrink-0 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-lime-500 block"></span>
              </span>
              <span className="text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-600 leading-relaxed">
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:info@batterseachapel.org" className="text-lime-600 hover:text-lime-700 font-medium">
            info@batterseachapel.org
          </a>.
        </p>
      </>
    ),
  },
  {
    icon: Link,
    number: '08',
    title: 'Third-Party Links',
    content: (
      <p className="text-gray-600 leading-relaxed">
        Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    number: '09',
    title: 'Changes to This Policy',
    content: (
      <p className="text-gray-600 leading-relaxed">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-500"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lime-500 opacity-5 rounded-full pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lime-400 font-semibold uppercase tracking-widest text-xs mb-4">Legal</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Privacy Policy</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            How we collect, use, and protect your information.
          </p>
          <p className="text-gray-500 text-sm mt-6">Last updated: April 2025</p>
        </div>
      </section>

      <main className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.number} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-12 h-12 bg-lime-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-lime-600" />
                    </div>
                    <div>
                      <p className="text-lime-600 text-xs font-semibold uppercase tracking-widest mb-1">{section.number}</p>
                      <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                  </div>
                  <div className="pl-17">
                    {section.content}
                  </div>
                </div>
              );
            })}

            {/* Contact Card */}
            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-12 h-12 bg-lime-500 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-lime-400" />
                </div>
                <div>
                  <p className="text-lime-400 text-xs font-semibold uppercase tracking-widest mb-1">10</p>
                  <h2 className="text-xl font-bold text-white">Contact Us</h2>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy, please get in touch with us.
              </p>
              <div className="bg-white bg-opacity-5 rounded-xl p-5 border border-white border-opacity-10">
                <p className="font-semibold text-white mb-1">Battersea Chapel</p>
                <p className="text-gray-400 text-sm mb-3">London, United Kingdom</p>
                <a
                  href="mailto:info@batterseachapel.org"
                  className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200"
                >
                  <Mail size={15} />
                  info@batterseachapel.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
