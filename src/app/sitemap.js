import prisma from '../../lib/prisma';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/leadership`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/giving`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic event pages
  let eventPages = [];
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      select: { id: true, createdAt: true }
    });
    
    eventPages = events.map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(event.createdAt),
      changeFrequency: 'monthly',
      priority: 0.5,
    }));
  } catch (error) {
    console.error('Error generating sitemap for events:', error);
  }

  return [...staticPages, ...eventPages];
}