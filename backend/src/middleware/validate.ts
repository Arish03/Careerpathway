import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e: any) => `${e.path}: ${e.msg}`).join(', ');
    throw new AppError(`Validation failed: ${messages}`, 400);
  }
  next();
};
