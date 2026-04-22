import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as PaymentController from '../controllers/payments.controller';

const router = Router();

// POST /api/payments/order — create payment order
router.post('/order',
  authenticate,
  [body('bookingId').isUUID()],
  validate,
  PaymentController.createOrder
);

// POST /api/payments/verify — verify payment (Razorpay)
router.post('/verify',
  authenticate,
  [
    body('razorpayOrderId').notEmpty(),
    body('razorpayPaymentId').notEmpty(),
    body('razorpaySignature').notEmpty(),
    body('bookingId').isUUID(),
  ],
  validate,
  PaymentController.verifyPayment
);

// POST /api/payments/mock — mock payment for dev/testing
router.post('/mock',
  authenticate,
  [body('bookingId').isUUID()],
  validate,
  PaymentController.mockPayment
);

// GET /api/payments — get payment history
router.get('/', authenticate, PaymentController.getPaymentHistory);

// POST /api/payments/payout/request — consultant requests payout
router.post('/payout/request', authenticate, PaymentController.requestPayout);

// GET /api/payments/earnings — consultant earnings summary
router.get('/earnings', authenticate, PaymentController.getEarnings);

export { router as paymentRoutes };
