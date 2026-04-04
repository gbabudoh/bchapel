'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [gaId, setGaId] = useState(null);

  useEffect(() => {
    // Fetch GA ID from database settings
    const fetchGAId = async () => {
      try {
        const response = await fetch('/api/seo-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.googleAnalyticsId) {
            setGaId(data.googleAnalyticsId);
          }
        }
      } catch (error) {
        console.error('Error fetching GA ID:', error);
        // Fallback to environment variable if database fetch fails
        const envGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
        if (envGaId) {
          setGaId(envGaId);
        }
      }
    };

    fetchGAId();
  }, []);

  useEffect(() => {
    if (!gaId) return;

    // Check if scripts already exist
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`);
    if (existingScript) return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `;
    document.head.appendChild(script2);

    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1);
      if (document.head.contains(script2)) document.head.removeChild(script2);
    };
  }, [gaId]);

  useEffect(() => {
    if (!gaId || !window.gtag) return;

    const url = pathname + searchParams.toString();
    
    window.gtag('config', gaId, {
      page_path: url,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}

// Helper function to track events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};