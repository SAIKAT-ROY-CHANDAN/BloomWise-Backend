import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../error/AppError';
import config from '../config';

declare module 'express-serve-static-core' {
    interface Request {
        user?: string | JwtPayload;
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication token is missing');
    }

    try {
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
};