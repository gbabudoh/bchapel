import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '../../../../../lib/prisma';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Send email via SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const churchEmail = process.env.CHURCH_EMAIL || 'info@batterseachapel.org';

    // Email to church
    await transporter.sendMail({
      from: `"Battersea Chapel Website" <${process.env.SMTP_USER}>`,
      to: churchEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #65a30d; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
            Sent via the Battersea Chapel website contact form. Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Battersea Chapel" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting Battersea Chapel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background-color: #65a30d; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Battersea Chapel</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #374151;">Thank you for reaching out, ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              We have received your message regarding "<strong>${subject}</strong>" and will get back to you as soon as possible.
            </p>
            <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #65a30d;">
              <p style="margin: 0; color: #6b7280; font-style: italic;">"${message}"</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              Blessings,<br>
              <strong>The Battersea Chapel Team</strong><br>
              <a href="mailto:info@batterseachapel.org" style="color: #65a30d;">info@batterseachapel.org</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
