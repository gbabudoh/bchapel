import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.paypalSettings.findFirst({
      orderBy: { id: 'desc' }
    });
    
    if (!settings) {
      return NextResponse.json({
        email: '',
        currency: 'GBP',
        sandboxMode: false
      });
    }
    
    return NextResponse.json({
      email: settings.email,
      currency: settings.currency,
      sandboxMode: settings.sandboxMode
    });
  } catch (error) {
    console.error('Error fetching PayPal settings:', error);
    return NextResponse.json({ error: 'Failed to fetch PayPal settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, currency, sandboxMode } = await request.json();
    
    // Check if settings exist
    const existingSettings = await prisma.paypalSettings.findFirst();
    
    if (existingSettings) {
      // Update existing settings
      await prisma.paypalSettings.update({
        where: { id: existingSettings.id },
        data: {
          email,
          currency: currency || 'GBP',
          sandboxMode: sandboxMode || false
        }
      });
    } else {
      // Create new settings
      await prisma.paypalSettings.create({
        data: {
          email,
          currency: currency || 'GBP',
          sandboxMode: sandboxMode || false
        }
      });
    }
    
    return NextResponse.json({ message: 'PayPal settings saved successfully' });
  } catch (error) {
    console.error('Error saving PayPal settings:', error);
    return NextResponse.json({ error: 'Failed to save PayPal settings' }, { status: 500 });
  }
}