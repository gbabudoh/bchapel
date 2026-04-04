import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "../../components/ClientProviders";
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
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#65a30d" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
