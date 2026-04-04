'use client';
import { useEffect, useState } from 'react';

export default function StructuredData() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/seo-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          // Use default settings if API fails
          setSettings({
            siteTitle: 'Battersea Chapel',
            siteDescription: 'Welcome to Battersea Chapel - A vibrant Christian community in London',
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            ogImage: '/og-image.jpg'
          });
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
        // Use default settings if fetch fails
        setSettings({
          siteTitle: 'Battersea Chapel',
          siteDescription: 'Welcome to Battersea Chapel - A vibrant Christian community in London',
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          ogImage: '/og-image.jpg'
        });
      }
    };

    fetchSettings();
  }, []);

  if (!settings) return null;

  const sameAs = [];
  if (settings.facebookUrl) sameAs.push(settings.facebookUrl);
  if (settings.instagramUrl) sameAs.push(settings.instagramUrl);
  if (settings.youtubeUrl) sameAs.push(settings.youtubeUrl);
  if (settings.twitterUrl) sameAs.push(settings.twitterUrl);

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "ReligiousOrganization",
    "name": "Battersea Chapel",
    "alternateName": "Battersea Chapel London",
    "description": settings.siteDescription,
    "url": settings.siteUrl,
    "logo": `${settings.siteUrl}/favicon.png`,
    "image": `${settings.siteUrl}${settings.ogImage}`,
    "address": settings.address ? {
      "@type": "PostalAddress",
      "streetAddress": settings.address,
      "addressLocality": "London",
      "addressCountry": "GB"
    } : {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    },
    "sameAs": sameAs,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "General Inquiry",
      "url": `${settings.siteUrl}/contact`,
      ...(settings.contactEmail && { "email": settings.contactEmail }),
      ...(settings.contactPhone && { "telephone": settings.contactPhone })
    }
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Battersea Chapel",
    "url": settings.siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${settings.siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
    </>
  );
}