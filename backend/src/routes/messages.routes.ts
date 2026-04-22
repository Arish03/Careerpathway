import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../config/database';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query as any;
  const userId = (req as any).user!.id;
  const conversations = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { seekerProfile: { select: { fullName: true, profilePhoto: true } }, consultantProfile: { select: { fullName: true, profilePhoto: true } } } },
      receiver: { select: { seekerProfile: { select: { fullName: true, profilePhoto: true } }, consultantProfile: { select: { fullName: true, profilePhoto: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
  });
  res.json({ success: true, data: conversations });
});

router.post('/', authenticate, async (req, res) => {
  const { receiverId, content, bookingId } = req.body;
  const userId = (req as any).user!.id;
  const message = await prisma.message.create({
    data: { senderId: userId, receiverId, content, bookingId },
  });
  res.status(201).json({ success: true, data: message });
});

export { router as messageRoutes };
