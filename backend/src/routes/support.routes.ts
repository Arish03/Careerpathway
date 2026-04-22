import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { prisma } from '../config/database';

const router = Router();

router.post('/', authenticate,
  [body('subject').notEmpty(), body('category').notEmpty(), body('description').isLength({ min: 10 })],
  validate,
  async (req: any, res: any) => {
    const ticket = await prisma.supportTicket.create({
      data: { userId: req.user!.id, subject: req.body.subject, category: req.body.category, description: req.body.description },
    });
    res.status(201).json({ success: true, data: ticket });
  }
);

router.get('/', authenticate, async (req: any, res: any) => {
  const tickets = await prisma.supportTicket.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: tickets });
});

export { router as supportRoutes };
