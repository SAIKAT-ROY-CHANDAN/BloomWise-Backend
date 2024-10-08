import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './auth.validation';
import { upload } from '../../utils/imageUpload';

const router = express.Router();

router.post('/register',
    upload.single('profileImage'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(userValidation.userValidationSchema),
    AuthController.createUser
);

router.put('/update/:userId', 
    upload.single('profileImage'), 
    (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(userValidation.userValidationSchema),
    AuthController.updateUser
);


export const AuthRoutes = router;
