import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

// Register Seeker
router.post('/register/seeker',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
    body('fullName').isLength({ min: 2, max: 100 }),
    body('phone').isMobilePhone('any'),
  ],
  validate,
  AuthController.registerSeeker
);

// Register Consultant
router.post('/register/consultant',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('fullName').notEmpty(),
    body('bio').isLength({ min: 50, max: 500 }),
    body('ratePerSession').isNumeric().isFloat({ min: 100 }),
  ],
  validate,
  AuthController.registerConsultant
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  AuthController.login
);

// Refresh Token
router.post('/refresh', AuthController.refreshToken);

// Logout
router.post('/logout', authenticate, AuthController.logout);

// Email Verification
router.get('/verify-email/:token', AuthController.verifyEmail);

// Forgot Password
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validate,
  AuthController.forgotPassword
);

// Reset Password
router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }),
  ],
  validate,
  AuthController.resetPassword
);

// Get current user
router.get('/me', authenticate, AuthController.getMe);

export { router as authRoutes };
