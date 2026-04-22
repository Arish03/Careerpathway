import nodemailer from 'nodemailer';
import { logger } from '../config/logger';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  static async sendVerificationEmail(to: string, name: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    await this.send(to, 'Verify your CareerPathway account', `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0a0f;color:#e2e8f0;border-radius:12px">
        <h1 style="color:#a855f7;margin-bottom:8px">Welcome to CareerPathway! 🎓</h1>
        <p>Hi ${name}, please verify your email to get started.</p>
        <a href="${url}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Verify Email</a>
        <p style="color:#94a3b8;font-size:14px">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `);
  }

  static async sendPasswordResetEmail(to: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    await this.send(to, 'Reset your CareerPathway password', `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0a0f;color:#e2e8f0;border-radius:12px">
        <h1 style="color:#a855f7">Reset Password 🔐</h1>
        <p>Click below to reset your password. Link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Reset Password</a>
      </div>
    `);
  }

  static async sendBookingConfirmation(to: string, name: string, bookingDetails: any) {
    await this.send(to, 'Booking Confirmed — CareerPathway', `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0a0f;color:#e2e8f0;border-radius:12px">
        <h1 style="color:#10b981">Booking Confirmed! ✅</h1>
        <p>Hi ${name}, your session has been confirmed.</p>
        <div style="background:#1e293b;padding:20px;border-radius:8px;margin:20px 0">
          <p><strong>Consultant:</strong> ${bookingDetails.consultantName}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.time}</p>
          <p><strong>Topic:</strong> ${bookingDetails.topic}</p>
        </div>
      </div>
    `);
  }

  private static async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"CareerPathway" <${process.env.EMAIL_FROM || 'noreply@careerpathway.com'}>`,
        to, subject, html,
      });
    } catch (err) {
      logger.error('Email send failed:', err);
    }
  }
}
