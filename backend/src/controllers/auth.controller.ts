import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { EmailService } from '../services/email.service';
import { setCache, delCache, getCache } from '../config/redis';

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ sub: userId, role }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

// ── Register Seeker ──────────────────────────────────────
export const registerSeeker = async (req: Request, res: Response) => {
  const { email, password, fullName, phone, educationLevel, interestedDomains, preferredCountries } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const emailVerifyToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      email, passwordHash, phone, role: 'SEEKER', emailVerifyToken,
      seekerProfile: {
        create: { fullName, educationLevel, interestedDomains: interestedDomains || [], preferredCountries: preferredCountries || [] },
      },
    },
  });

  await EmailService.sendVerificationEmail(email, fullName, emailVerifyToken);

  res.status(201).json({
    success: true,
    message: 'Account created! Please verify your email.',
    data: { userId: user.id },
  });
};

// ── Register Consultant ──────────────────────────────────
export const registerConsultant = async (req: Request, res: Response) => {
  const { email, password, fullName, phone, bio, consultantType, institution, degree,
    yearOfPassing, domains, subSpecializations, countryOfInstitution, linkedinUrl,
    ratePerSession, durationOptions, languages, idDocumentUrl } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const emailVerifyToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      email, passwordHash, phone, role: 'CONSULTANT', emailVerifyToken,
      consultantProfile: {
        create: {
          fullName, bio, consultantType, institution, degree,
          yearOfPassing: yearOfPassing ? parseInt(yearOfPassing) : null,
          domains: domains || [], subSpecializations: subSpecializations || [],
          countryOfInstitution, linkedinUrl, ratePerSession, durationOptions: durationOptions || [30, 60],
          languages: languages || ['English'], idDocumentUrl: idDocumentUrl || 'pending',
          status: 'PENDING',
        },
      },
    },
  });

  await EmailService.sendVerificationEmail(email, fullName, emailVerifyToken);

  res.status(201).json({
    success: true,
    message: 'Application submitted! Please verify your email. Admin will review your profile within 24–48 hours.',
    data: { userId: user.id },
  });
};

// ── Login ────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { seekerProfile: true, consultantProfile: true },
  });

  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isEmailVerified) throw new AppError('Please verify your email first', 403);
  if (!user.isActive) throw new AppError('Account has been suspended', 403);
  if (user.role === 'CONSULTANT' && user.consultantProfile?.status === 'PENDING') {
    throw new AppError('Your consultant application is under review', 403);
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: await bcrypt.hash(refreshToken, 8) } });
  await setCache(`user:${user.id}`, { id: user.id, role: user.role }, 900);

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

  const profile = user.role === 'SEEKER' ? user.seekerProfile : user.consultantProfile;

  res.json({
    success: true,
    data: {
      accessToken,
      user: { id: user.id, email: user.email, role: user.role, profile },
    },
  });
};

// ── Refresh Token ────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.headers['x-refresh-token'];
  if (!token) throw new AppError('Refresh token required', 401);

  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.refreshToken) throw new AppError('Invalid refresh token', 401);

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: await bcrypt.hash(newRefreshToken, 8) } });

  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, data: { accessToken } });
};

// ── Logout ───────────────────────────────────────────────
export const logout = async (req: AuthRequest, res: Response) => {
  await prisma.user.update({ where: { id: req.user!.id }, data: { refreshToken: null } });
  await delCache(`user:${req.user!.id}`);
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};

// ── Verify Email ─────────────────────────────────────────
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
  if (!user) throw new AppError('Invalid or expired verification link', 400);
  await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true, emailVerifyToken: null } });
  res.json({ success: true, message: 'Email verified! You can now login.' });
};

// ── Forgot Password ──────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const resetToken = uuidv4();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: resetToken, passwordResetExpiry: expiry } });
    await EmailService.sendPasswordResetEmail(email, resetToken);
  }
  res.json({ success: true, message: 'If this email is registered, you will receive a reset link.' });
};

// ── Reset Password ───────────────────────────────────────
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token, passwordResetExpiry: { gt: new Date() } },
  });
  if (!user) throw new AppError('Invalid or expired reset token', 400);
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash, passwordResetToken: null, passwordResetExpiry: null, refreshToken: null } });
  res.json({ success: true, message: 'Password reset successful. Please login.' });
};

// ── Get Me ───────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, email: true, phone: true, role: true,
      isEmailVerified: true, isPhoneVerified: true, isActive: true,
      createdAt: true, updatedAt: true,
      seekerProfile: true,
      consultantProfile: true,
    },
  });
  res.json({ success: true, data: user });
};
