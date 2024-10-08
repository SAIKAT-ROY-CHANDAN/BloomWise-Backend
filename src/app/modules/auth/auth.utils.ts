import jwt from 'jsonwebtoken';

export const createToken = (
    jwtPayload: { userId: string; role: string },
    secret: string
): string => {
    return jwt.sign(jwtPayload, secret, { expiresIn: '30d' });
};
