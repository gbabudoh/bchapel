import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "../../components/ClientProviders";
import MobileBottomNav from "../../components/MobileBottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Battersea Chapel - A Place of Worship, Community & Faith",
    template: "%s | Battersea Chapel"
  },
  description: "Welcome to Battersea Chapel - A vibrant Christian community in London offering worship services, community programs, and spiritual growth opportunities for all ages.",
  keywords: [
    "Battersea Chapel",
    "Church London",
    "Christian Community",
    "Worship Services",
    "Bible Study",
    "Community Programs",
    "Faith",
    "Prayer",
    "Sunday Service",
    "London Church"
  ],
  authors: [{ name: "Battersea Chapel" }],
  creator: "Battersea Chapel",
  publisher: "Battersea Chapel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Battersea Chapel - A Place of Worship, Community & Faith",
    description: "Welcome to Battersea Chapel - A vibrant Christian community in London offering worship services, community programs, and spiritual growth opportunities for all ages.",
    url: '/',
    siteName: 'Battersea Chapel',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Battersea Chapel',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Battersea Chapel - A Place of Worship, Community & Faith",
    description: "Welcome to Battersea Chapel - A vibrant Christian community in London offering worship services, community programs, and spiritual growth opportunities for all ages.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/icon-120x120.png', sizes: '120x120', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Battersea Chapel',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#65a30d" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Battersea Chapel" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <ClientProviders>
          <div className="pb-16 md:pb-0">
            {children}
          </div>
          <MobileBottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
