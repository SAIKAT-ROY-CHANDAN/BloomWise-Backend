import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './auth.validation';
import { upload } from '../../utils/imageUpload';
import { authenticate } from '../../middlewares/authenticate';

const router = express.Router();

router.post('/register',
    upload.single('profileImage'),
    (req: Request, res: Response, next: NextFunction) => {
        next();
    },
    validateRequest(userValidation.userValidationSchema),
    AuthController.createUser
);

router.put('/update/:userId',
    authenticate,
    upload.single('profileImage'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(userValidation.userUpdateValidationSchema),
    AuthController.updateUser
);

router.post(
    '/login',
    // validateRequest(userValidation.userValidationSchema),
    AuthController.loginUser
)


export const AuthRoutes = router;
