import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../config/database';

const router = Router();

router.get('/me', authenticate, async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { seekerProfile: true, consultantProfile: true },
  });
  res.json({ success: true, data: user });
});

router.put('/me', authenticate, async (req: any, res) => {
  const { fullName, phone } = req.body;
  if (req.user!.role === 'SEEKER') {
    const profile = await prisma.seekerProfile.update({ where: { userId: req.user!.id }, data: { fullName } });
    return res.json({ success: true, data: profile });
  }
  const profile = await prisma.consultantProfile.update({ where: { userId: req.user!.id }, data: { fullName } });
  res.json({ success: true, data: profile });
});

export { router as userRoutes };
