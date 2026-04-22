import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// POST /api/bookings
export const createBooking = async (req: AuthRequest, res: Response) => {
  const { consultantId, slotId, topic, agenda, sessionType, durationMinutes, preferredLang, attachmentUrl } = req.body;

  const slot = await prisma.availability.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBooked) throw new AppError('Slot not available', 400);
  if (slot.consultantId !== consultantId) throw new AppError('Slot does not belong to this consultant', 400);

  const booking = await prisma.$transaction(async (tx) => {
    await tx.availability.update({ where: { id: slotId }, data: { isBooked: true } });
    return tx.booking.create({
      data: { seekerId: req.user!.id, consultantId, slotId, topic, agenda, sessionType, durationMinutes, preferredLang: preferredLang || 'English', attachmentUrl },
      include: { consultant: { select: { fullName: true, ratePerSession: true } }, slot: true },
    });
  });

  res.status(201).json({ success: true, data: booking, message: 'Booking created. Please complete payment.' });
};

// GET /api/bookings
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const { status, tab = 'upcoming' } = req.query;
  const isConsultant = req.user!.role === 'CONSULTANT';

  const where: any = isConsultant
    ? { consultant: { userId: req.user!.id } }
    : { seekerId: req.user!.id };

  if (tab === 'upcoming') where.status = { in: ['PENDING', 'CONFIRMED'] };
  else if (tab === 'past') where.status = 'COMPLETED';
  else if (tab === 'cancelled') where.status = { in: ['CANCELLED'] };
  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      consultant: { select: { fullName: true, profilePhoto: true, domains: true } },
      slot: true, payment: { select: { status: true, grossAmount: true } },
      review: { select: { rating: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: bookings });
};

// GET /api/bookings/:id
export const getBookingById = async (req: AuthRequest, res: Response) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: {
      consultant: true, slot: true,
      payment: true, review: true,
    },
  });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.seekerId !== req.user!.id && !(booking.consultant.userId === req.user!.id || req.user!.role === 'ADMIN')) {
    throw new AppError('Unauthorized', 403);
  }
  res.json({ success: true, data: booking });
};

// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id }, include: { slot: true } });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') throw new AppError('Cannot cancel this booking', 400);

  await prisma.$transaction([
    prisma.booking.update({ where: { id: req.params.id }, data: { status: 'CANCELLED', cancellationReason: req.body.reason, cancelledAt: new Date() } }),
    prisma.availability.update({ where: { id: booking.slotId }, data: { isBooked: false } }),
  ]);

  res.json({ success: true, message: 'Booking cancelled successfully' });
};

// PUT /api/bookings/:id/reschedule
export const rescheduleBooking = async (req: AuthRequest, res: Response) => {
  const { newSlotId } = req.body;
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) throw new AppError('Booking not found', 404);

  const newSlot = await prisma.availability.findUnique({ where: { id: newSlotId } });
  if (!newSlot || newSlot.isBooked) throw new AppError('New slot not available', 400);

  await prisma.$transaction([
    prisma.availability.update({ where: { id: booking.slotId }, data: { isBooked: false } }),
    prisma.availability.update({ where: { id: newSlotId }, data: { isBooked: true } }),
    prisma.booking.update({ where: { id: booking.id }, data: { slotId: newSlotId, status: 'CONFIRMED' } }),
  ]);

  res.json({ success: true, message: 'Booking rescheduled successfully' });
};

// POST /api/bookings/:id/review
export const submitReview = async (req: AuthRequest, res: Response) => {
  const { rating, comment, isAnonymous } = req.body;
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: { consultant: true, review: true },
  });
  if (!booking || booking.seekerId !== req.user!.id) throw new AppError('Booking not found', 404);
  if (booking.status !== 'COMPLETED') throw new AppError('Can only review completed sessions', 400);
  if (booking.review) throw new AppError('Review already submitted', 409);

  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      reviewerId: req.user!.id,
      revieweeId: booking.consultant.userId,
      rating, comment, isAnonymous: isAnonymous || false,
    },
  });

  // Update consultant average rating
  const allReviews = await prisma.review.findMany({ where: { revieweeId: booking.consultant.userId }, select: { rating: true } });
  const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await prisma.consultantProfile.update({ where: { id: booking.consultantId }, data: { averageRating: avg } });

  res.status(201).json({ success: true, data: review });
};
