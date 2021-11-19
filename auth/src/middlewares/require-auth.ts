import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/unauthorizedError';

export const requireAuth = (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
        throw new UnauthorizedError();
    }

    next();
};
