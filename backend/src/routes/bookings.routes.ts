import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as BookingController from '../controllers/bookings.controller';

const router = Router();

// POST /api/bookings — create a booking
router.post('/',
  authenticate,
  [
    body('consultantId').isUUID(),
    body('slotId').isUUID(),
    body('topic').isLength({ min: 5, max: 500 }),
    body('sessionType').isIn(['VIDEO', 'AUDIO', 'CHAT']),
    body('durationMinutes').isInt({ min: 15, max: 120 }),
  ],
  validate,
  BookingController.createBooking
);

// GET /api/bookings — get my bookings
router.get('/', authenticate, BookingController.getMyBookings);

// GET /api/bookings/:id
router.get('/:id', authenticate, BookingController.getBookingById);

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel',
  authenticate,
  [body('reason').optional().isString()],
  validate,
  BookingController.cancelBooking
);

// PUT /api/bookings/:id/reschedule
router.put('/:id/reschedule',
  authenticate,
  [body('newSlotId').isUUID()],
  validate,
  BookingController.rescheduleBooking
);

// POST /api/bookings/:id/review
router.post('/:id/review',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isLength({ max: 1000 }),
    body('isAnonymous').optional().isBoolean(),
  ],
  validate,
  BookingController.submitReview
);

export { router as bookingRoutes };
