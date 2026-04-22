import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { setCache, getCache, delCache } from '../config/redis';

// GET /api/consultants — search with filters
export const searchConsultants = async (req: Request, res: Response) => {
  const {
    domain, country, institution, consultantType, language,
    minRating, maxPrice, minPrice, duration,
    page = 1, limit = 12, sortBy = 'rating', q,
  } = req.query as any;

  const where: any = { status: 'APPROVED', user: { isActive: true } };
  if (domain) where.domains = { has: domain };
  if (country) where.countryOfInstitution = { contains: country, mode: 'insensitive' };
  if (institution) where.institution = { contains: institution, mode: 'insensitive' };
  if (consultantType) where.consultantType = consultantType;
  if (language) where.languages = { has: language };
  if (minRating) where.averageRating = { gte: parseFloat(minRating) };
  if (minPrice || maxPrice) where.ratePerSession = {
    ...(minPrice && { gte: parseFloat(minPrice) }),
    ...(maxPrice && { lte: parseFloat(maxPrice) }),
  };
  if (q) where.OR = [
    { fullName: { contains: q, mode: 'insensitive' } },
    { institution: { contains: q, mode: 'insensitive' } },
    { subSpecializations: { has: q } },
  ];

  const orderBy: any = sortBy === 'rating' ? { averageRating: 'desc' }
    : sortBy === 'price_asc' ? { ratePerSession: 'asc' }
    : sortBy === 'price_desc' ? { ratePerSession: 'desc' }
    : { totalSessions: 'desc' };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [total, consultants] = await prisma.$transaction([
    prisma.consultantProfile.count({ where }),
    prisma.consultantProfile.findMany({
      where, orderBy, skip, take: parseInt(limit),
      select: {
        id: true, fullName: true, profilePhoto: true, bio: true,
        consultantType: true, institution: true, degree: true,
        domains: true, subSpecializations: true, countryOfInstitution: true,
        ratePerSession: true, currency: true, durationOptions: true,
        languages: true, averageRating: true, totalSessions: true,
        isFeatured: true, responseTime: true,
      },
    }),
  ]);

  res.json({ success: true, data: { consultants, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } });
};

// GET /api/consultants/:id
export const getConsultantById = async (req: Request, res: Response) => {
  const cached = await getCache(`consultant:${req.params.id}`);
  if (cached) return res.json({ success: true, data: cached });

  const consultant = await prisma.consultantProfile.findFirst({
    where: { id: req.params.id, status: 'APPROVED' },
    include: {
      user: { select: { email: true, createdAt: true } },
      _count: { select: { bookings: true } },
    },
  });
  if (!consultant) throw new AppError('Consultant not found', 404);

  await setCache(`consultant:${req.params.id}`, consultant, 300);
  res.json({ success: true, data: consultant });
};

// GET /api/consultants/:id/availability
export const getAvailability = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const slots = await prisma.availability.findMany({
    where: {
      consultantId: req.params.id,
      isBooked: false,
      date: {
        gte: from ? new Date(from as string) : new Date(),
        lte: to ? new Date(to as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
  res.json({ success: true, data: slots });
};

// PUT /api/consultants/availability
export const updateAvailability = async (req: AuthRequest, res: Response) => {
  const { slots } = req.body; // [{ date, startTime, endTime }]
  const consultant = await prisma.consultantProfile.findUnique({ where: { userId: req.user!.id } });
  if (!consultant) throw new AppError('Consultant profile not found', 404);

  const created = await prisma.$transaction(
    slots.map((s: any) =>
      prisma.availability.upsert({
        where: { consultantId_date_startTime: { consultantId: consultant.id, date: new Date(s.date), startTime: s.startTime } },
        update: {},
        create: { consultantId: consultant.id, date: new Date(s.date), startTime: s.startTime, endTime: s.endTime },
      })
    )
  );
  await delCache(`consultant:${consultant.id}`);
  res.json({ success: true, data: created, message: 'Availability updated' });
};

// PUT /api/consultants/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { bio, subSpecializations, ratePerSession, durationOptions, languages, linkedinUrl } = req.body;
  const consultant = await prisma.consultantProfile.update({
    where: { userId: req.user!.id },
    data: { bio, subSpecializations, ratePerSession, durationOptions, languages, linkedinUrl },
  });
  await delCache(`consultant:${consultant.id}`);
  res.json({ success: true, data: consultant });
};

// POST /api/consultants/:id/save
export const toggleSaveConsultant = async (req: AuthRequest, res: Response) => {
  const seeker = await prisma.seekerProfile.findUnique({ where: { userId: req.user!.id } });
  if (!seeker) throw new AppError('Seeker profile not found', 404);
  const existing = await prisma.savedConsultant.findUnique({ where: { seekerId_consultantId: { seekerId: seeker.id, consultantId: req.params.id } } });
  if (existing) {
    await prisma.savedConsultant.delete({ where: { id: existing.id } });
    return res.json({ success: true, saved: false });
  }
  await prisma.savedConsultant.create({ data: { seekerId: seeker.id, consultantId: req.params.id } });
  res.json({ success: true, saved: true });
};

// GET /api/consultants/:id/reviews
export const getConsultantReviews = async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: (await prisma.consultantProfile.findUnique({ where: { id: req.params.id } }))?.userId },
    include: { reviewer: { select: { seekerProfile: { select: { fullName: true, profilePhoto: true } } } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ success: true, data: reviews });
};
