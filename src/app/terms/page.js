import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { FileText, Users, Ban, CreditCard, Copyright, AlertTriangle, RefreshCw, Globe, Mail } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Battersea Chapel',
};

const sections = [
  {
    icon: FileText,
    number: '01',
    title: 'Acceptance of Terms',
    content: (
      <p className="text-gray-600 leading-relaxed">
        By accessing and using the Battersea Chapel website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website. We reserve the right to update these terms at any time, and your continued use of the site constitutes acceptance of any changes.
      </p>
    ),
  },
  {
    icon: Globe,
    number: '02',
    title: 'Use of the Website',
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-5">You agree to use this website only for lawful purposes and in a manner that does not:</p>
        <ul className="space-y-3">
          {[
            'Infringe the rights of others or restrict their use of the site',
            'Transmit unsolicited or unauthorised advertising material',
            'Attempt to gain unauthorised access to any part of the website',
            'Introduce viruses, trojans, or other malicious code',
            'Use the site in any way that is unlawful or fraudulent',
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
    icon: CreditCard,
    number: '03',
    title: 'Donations',
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-5">When making a donation through our website:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Payment Processing', desc: 'All donations are processed securely through PayPal. We do not store your payment details.' },
            { label: 'Voluntary Giving', desc: 'All donations are voluntary and made in good faith to support Battersea Chapel\'s ministry.' },
            { label: 'Non-Refundable', desc: 'Donations are generally non-refundable except in cases of technical error or fraud.' },
            { label: 'Gift Aid', desc: 'UK taxpayers may be eligible to Gift Aid their donation. Contact us for more information.' },
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
    icon: Copyright,
    number: '04',
    title: 'Intellectual Property',
    content: (
      <p className="text-gray-600 leading-relaxed">
        All content on this website — including text, images, logos, graphics, and audio — is the property of Battersea Chapel and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, or use any content without our prior written permission, except for personal, non-commercial use.
      </p>
    ),
  },
  {
    icon: Users,
    number: '05',
    title: 'User Content',
    content: (
      <p className="text-gray-600 leading-relaxed">
        If you submit content to us (such as prayer requests, testimonies, or contact messages), you grant Battersea Chapel a non-exclusive licence to use, reproduce, and publish that content for ministry purposes. You warrant that any content you submit is accurate, lawful, and does not infringe third-party rights.
      </p>
    ),
  },
  {
    icon: Ban,
    number: '06',
    title: 'Disclaimer of Warranties',
    content: (
      <p className="text-gray-600 leading-relaxed">
        This website is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Battersea Chapel makes no warranties, express or implied, regarding the accuracy, completeness, or reliability of any content on this site. We do not guarantee uninterrupted or error-free access to the website.
      </p>
    ),
  },
  {
    icon: AlertTriangle,
    number: '07',
    title: 'Limitation of Liability',
    content: (
      <p className="text-gray-600 leading-relaxed">
        To the fullest extent permitted by law, Battersea Chapel shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or reliance on its content. This includes, without limitation, loss of data, loss of income, or any other losses.
      </p>
    ),
  },
  {
    icon: Globe,
    number: '08',
    title: 'Third-Party Links',
    content: (
      <p className="text-gray-600 leading-relaxed">
        Our website may contain links to external websites for your convenience. These links do not constitute endorsement by Battersea Chapel. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
      </p>
    ),
  },
  {
    icon: FileText,
    number: '09',
    title: 'Governing Law',
    content: (
      <p className="text-gray-600 leading-relaxed">
        These Terms and Conditions are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    number: '10',
    title: 'Changes to These Terms',
    content: (
      <p className="text-gray-600 leading-relaxed">
        We reserve the right to amend these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. It is your responsibility to review these terms regularly. Your continued use of the website after any changes constitutes your acceptance of the revised terms.
      </p>
    ),
  },
];

export default function TermsPage() {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Terms &amp; Conditions</h1>
          <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our website.
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
                  <p className="text-lime-400 text-xs font-semibold uppercase tracking-widest mb-1">11</p>
                  <h2 className="text-xl font-bold text-white">Contact Us</h2>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                If you have any questions about these Terms &amp; Conditions, please get in touch.
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
