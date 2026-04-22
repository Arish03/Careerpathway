import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as AiController from '../controllers/ai.controller';

const router = Router();

// POST /api/ai/chat — send message to AI
router.post('/chat',
  [
    body('message').isLength({ min: 1, max: 5000 }),
    body('sessionId').optional().isUUID(),
    body('domain').optional().isString(),
  ],
  validate,
  AiController.chat
);

// GET /api/ai/sessions — get user's AI chat history (requires auth)
router.get('/sessions', authenticate, AiController.getSessions);

// POST /api/ai/sessions — create new session (requires auth)
router.post('/sessions', authenticate, AiController.createSession);

// GET /api/ai/sessions/:id — get session messages
router.get('/sessions/:id', authenticate, AiController.getSessionById);

// DELETE /api/ai/sessions/:id — delete session
router.delete('/sessions/:id', authenticate, AiController.deleteSession);

// POST /api/ai/analyze — analyze uploaded document (marksheet/resume)
router.post('/analyze',
  authenticate,
  [body('fileUrl').isURL()],
  validate,
  AiController.analyzeDocument
);

export { router as aiRoutes };
