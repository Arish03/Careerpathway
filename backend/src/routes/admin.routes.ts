import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { prisma } from '../config/database';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.get('/stats', async (req, res) => {
  const [users, consultants, bookings, revenue] = await prisma.$transaction([
    prisma.user.count(),
    prisma.consultantProfile.count({ where: { status: 'APPROVED' } }),
    prisma.booking.count(),
    prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { grossAmount: true } }),
  ]);
  res.json({ success: true, data: { users, consultants, bookings, totalRevenue: revenue._sum.grossAmount || 0 } });
});

router.get('/users', async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query as any;
  const where: any = {};
  if (role) where.role = role;
  if (search) where.OR = [{ email: { contains: search, mode: 'insensitive' } }];
  const users = await prisma.user.findMany({ where, skip: (page - 1) * limit, take: Number(limit), orderBy: { createdAt: 'desc' }, include: { seekerProfile: { select: { fullName: true } }, consultantProfile: { select: { fullName: true, status: true } } } });
  res.json({ success: true, data: users });
});

router.get('/consultants/pending', async (req, res) => {
  const pending = await prisma.consultantProfile.findMany({ where: { status: 'PENDING' }, include: { user: { select: { email: true, createdAt: true } } }, orderBy: { createdAt: 'asc' } });
  res.json({ success: true, data: pending });
});

router.put('/consultants/:id/verify', async (req, res) => {
  const { action, reason } = req.body; // action: 'approve' | 'reject'
  const consultant = await prisma.consultantProfile.update({
    where: { id: req.params.id },
    data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED', rejectionReason: reason },
  });
  res.json({ success: true, data: consultant });
});

router.put('/users/:id/toggle', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const updated = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: !user.isActive } });
  res.json({ success: true, data: updated });
});

export { router as adminRoutes };
