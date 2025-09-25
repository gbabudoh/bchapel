import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter (you'll need to configure this with your email settings)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to church
    const churchEmail = {
      from: process.env.SMTP_USER,
      to: process.env.CHURCH_EMAIL || 'admin@bchapel.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #65a30d;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #65a30d;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              This message was sent through the Battersea Chapel website contact form.
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply to sender
    const autoReply = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting Battersea Chapel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background-color: #65a30d; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Battersea Chapel</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #374151;">Thank you for reaching out!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Dear ${name},
            </p>
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for contacting us. We have received your message regarding "${subject}" 
              and will get back to you as soon as possible.
            </p>
            <p style="color: #4b5563; line-height: 1.6;">
              In the meantime, we encourage you to visit our website to learn more about our 
              services, events, and community activities.
            </p>
            <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
              <h3 style="color: #65a30d; margin-top: 0;">Your Message:</h3>
              <p style="color: #6b7280; font-style: italic;">"${message}"</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              Blessings,<br>
              <strong>The Battersea Chapel Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(churchEmail);
    await transporter.sendMail(autoReply);

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}