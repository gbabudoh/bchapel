import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.seoSettings.findFirst({
      orderBy: { id: 'desc' }
    });
    
    if (!settings) {
      return NextResponse.json({
        siteTitle: 'Battersea Chapel - A Place of Worship, Community & Faith',
        siteDescription: 'Welcome to Battersea Chapel - A vibrant Christian community in London offering worship services, community programs, and spiritual growth opportunities for all ages.',
        siteKeywords: 'Battersea Chapel,Church London,Christian Community,Worship Services,Bible Study,Community Programs,Faith,Prayer,Sunday Service,London Church',
        siteUrl: 'http://localhost:3000',
        googleAnalyticsId: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        twitterUrl: '',
        ogImage: '/og-image.jpg',
        contactEmail: '',
        contactPhone: '',
        address: ''
      });
    }
    
    // Map Prisma fields to snake_case for API compatibility
    return NextResponse.json({
      id: settings.id,
      siteTitle: settings.siteTitle || '',
      siteDescription: settings.siteDescription || '',
      siteKeywords: settings.siteKeywords || '',
      siteUrl: settings.siteUrl || '',
      googleAnalyticsId: settings.googleAnalyticsId || '',
      facebookUrl: settings.facebookUrl || '',
      instagramUrl: settings.instagramUrl || '',
      youtubeUrl: settings.youtubeUrl || '',
      twitterUrl: settings.twitterUrl || '',
      ogImage: settings.ogImage || '/og-image.jpg',
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      address: settings.address || ''
    });
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    const existingSettings = await prisma.seoSettings.findFirst();
    
    const settingsData = {
      siteTitle: data.siteTitle,
      siteDescription: data.siteDescription,
      siteKeywords: data.siteKeywords,
      siteUrl: data.siteUrl,
      googleAnalyticsId: data.googleAnalyticsId,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
      youtubeUrl: data.youtubeUrl,
      twitterUrl: data.twitterUrl,
      ogImage: data.ogImage,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address
    };
    
    if (existingSettings) {
      await prisma.seoSettings.update({
        where: { id: existingSettings.id },
        data: settingsData
      });
    } else {
      await prisma.seoSettings.create({
        data: settingsData
      });
    }

    return NextResponse.json({ message: 'SEO settings updated successfully' });
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to update SEO settings' },
      { status: 500 }
    );
  }
}
