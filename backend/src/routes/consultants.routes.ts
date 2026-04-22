import { Router } from 'express';
import { query } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import * as ConsultantController from '../controllers/consultants.controller';

const router = Router();

// GET /api/consultants — search & filter
router.get('/',
  [
    query('domain').optional().isString(),
    query('country').optional().isString(),
    query('minRating').optional().isFloat({ min: 1, max: 5 }),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('sortBy').optional().isIn(['rating', 'price_asc', 'price_desc', 'sessions']),
  ],
  validate,
  ConsultantController.searchConsultants
);

// GET /api/consultants/:id — get profile
router.get('/:id', ConsultantController.getConsultantById);

// GET /api/consultants/:id/availability
router.get('/:id/availability', ConsultantController.getAvailability);

// PUT /api/consultants/availability — update availability (consultant only)
router.put('/availability',
  authenticate,
  requireRole('CONSULTANT'),
  ConsultantController.updateAvailability
);

// PUT /api/consultants/profile — update consultant profile
router.put('/profile',
  authenticate,
  requireRole('CONSULTANT'),
  ConsultantController.updateProfile
);

// POST /api/consultants/:id/save — save/unsave consultant
router.post('/:id/save',
  authenticate,
  requireRole('SEEKER'),
  ConsultantController.toggleSaveConsultant
);

// GET /api/consultants/:id/reviews
router.get('/:id/reviews', ConsultantController.getConsultantReviews);

export { router as consultantRoutes };
