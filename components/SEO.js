import Head from 'next/head';

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  children
}) {
  const siteTitle = "Battersea Chapel";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/og-image.jpg`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {children}
    </Head>
  );
}

// Helper function for structured data
export function generateStructuredData(type, data) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
}