import { Router } from 'express';
import { prisma } from '../config/database';
import { setCache, getCache } from '../config/redis';

const router = Router();

router.get('/', async (req, res) => {
  const cached = await getCache('domains:all');
  if (cached) return res.json({ success: true, data: cached });

  const DOMAINS = [
    { slug: 'education', name: 'Education', description: 'Colleges, entrance exams, study abroad guidance', icon: 'GraduationCap', isActive: true, sortOrder: 1 },
    { slug: 'business', name: 'Business', description: 'MBA, entrepreneurship, finance careers', icon: 'Briefcase', isActive: true, sortOrder: 2 },
    { slug: 'sports', name: 'Sports', description: 'Athletic careers, sports management, coaching', icon: 'Trophy', isActive: true, sortOrder: 3 },
    { slug: 'medical', name: 'Medical', description: 'MBBS, USMLE, medical specialties guidance', icon: 'Stethoscope', isActive: true, sortOrder: 4 },
    { slug: 'engineering', name: 'Engineering', description: 'JEE, GATE, tech career paths', icon: 'Cpu', isActive: true, sortOrder: 5 },
    { slug: 'arts', name: 'Arts & Design', description: 'Creative careers, design schools, fine arts', icon: 'Palette', isActive: true, sortOrder: 6 },
    { slug: 'law', name: 'Law', description: 'CLAT, LLB, legal careers and bar exams', icon: 'Scale', isActive: true, sortOrder: 7 },
    { slug: 'government', name: 'Government', description: 'UPSC, SSC, civil services preparation', icon: 'Shield', isActive: true, sortOrder: 8 },
    { slug: 'research', name: 'Research & Academia', description: 'PhD, fellowships, post-doctoral careers', icon: 'FlaskConical', isActive: true, sortOrder: 9 },
  ];

  await setCache('domains:all', DOMAINS, 3600);
  res.json({ success: true, data: DOMAINS });
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const consultants = await prisma.consultantProfile.findMany({
    where: { status: 'APPROVED', domains: { has: slug.charAt(0).toUpperCase() + slug.slice(1) } },
    select: { id: true, fullName: true, profilePhoto: true, averageRating: true, ratePerSession: true, totalSessions: true },
    take: 6,
    orderBy: { averageRating: 'desc' },
  });
  res.json({ success: true, data: { slug, consultants } });
});

export { router as domainRoutes };
