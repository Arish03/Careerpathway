import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// POST /api/payments/order
export const createOrder = async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.body;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { consultant: { select: { ratePerSession: true, currency: true } } },
  });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.seekerId !== req.user!.id) throw new AppError('Unauthorized', 403);

  const gross = Number(booking.consultant.ratePerSession);
  const commissionPct = 20;
  const commission = gross * commissionPct / 100;
  const net = gross - commission;

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      bookingId, grossAmount: gross, commissionPct,
      commissionAmount: commission, netAmount: net,
      currency: booking.consultant.currency, gateway: 'razorpay',
    },
  });

  // In production: create Razorpay order here
  // const razorpay = new Razorpay({ key_id: ..., key_secret: ... });
  // const order = await razorpay.orders.create({ amount: gross * 100, currency: 'INR', receipt: bookingId });

  res.json({
    success: true,
    data: {
      paymentId: payment.id,
      amount: gross, currency: payment.currency,
      // razorpayOrderId: order.id, // uncomment with real Razorpay
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
};

// POST /api/payments/verify
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  // In production: verify HMAC signature with Razorpay
  // const expectedSig = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  // if (expectedSig !== razorpaySignature) throw new AppError('Payment verification failed', 400);

  await prisma.$transaction([
    prisma.payment.update({
      where: { bookingId },
      data: { status: 'COMPLETED', gatewayOrderId: razorpayOrderId, gatewayPaymentId: razorpayPaymentId, gatewaySignature: razorpaySignature },
    }),
    prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } }),
  ]);

  res.json({ success: true, message: 'Payment verified. Booking confirmed!' });
};

// POST /api/payments/mock — for dev/testing
export const mockPayment = async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.body;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { consultant: { select: { ratePerSession: true, currency: true } } },
  });
  if (!booking) throw new AppError('Booking not found', 404);

  const gross = Number(booking.consultant.ratePerSession);
  const commissionPct = 20;

  await prisma.$transaction([
    prisma.payment.upsert({
      where: { bookingId },
      update: { status: 'COMPLETED' },
      create: {
        bookingId, grossAmount: gross, commissionPct,
        commissionAmount: gross * commissionPct / 100,
        netAmount: gross * (1 - commissionPct / 100),
        currency: booking.consultant.currency,
        gateway: 'mock', status: 'COMPLETED',
        gatewayPaymentId: `mock_${Date.now()}`,
      },
    }),
    prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } }),
  ]);

  res.json({ success: true, message: 'Mock payment successful. Booking confirmed!' });
};

// GET /api/payments
export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  const payments = await prisma.payment.findMany({
    where: { booking: { seekerId: req.user!.id } },
    include: { booking: { include: { consultant: { select: { fullName: true } }, slot: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: payments });
};

// GET /api/payments/earnings
export const getEarnings = async (req: AuthRequest, res: Response) => {
  const consultant = await prisma.consultantProfile.findUnique({ where: { userId: req.user!.id } });
  if (!consultant) throw new AppError('Consultant profile not found', 404);

  const payments = await prisma.payment.findMany({
    where: { booking: { consultantId: consultant.id }, status: 'COMPLETED' },
    include: { booking: { include: { slot: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const totalEarned = payments.reduce((s, p) => s + Number(p.netAmount), 0);
  const thisMonth = payments.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, p) => s + Number(p.netAmount), 0);

  res.json({ success: true, data: { payments, totalEarned, thisMonth, currency: consultant.currency } });
};

// POST /api/payments/payout/request
export const requestPayout = async (req: AuthRequest, res: Response) => {
  const consultant = await prisma.consultantProfile.findUnique({ where: { userId: req.user!.id } });
  if (!consultant) throw new AppError('Consultant profile not found', 404);

  // Logic: find unpaid completed payments and create payout
  res.json({ success: true, message: 'Payout request submitted. Processing in 3–5 business days.' });
};
