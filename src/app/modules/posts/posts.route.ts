import express, { NextFunction, Request, Response } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { PostController } from './posts.controller';
import { upload } from '../../utils/imageUpload';

const router = express.Router();

router.post(
    '/create',
    authenticate,
    upload.single('postImage'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    PostController.createPost
);

router.put(
    '/edit/:id',
    authenticate,
    upload.single('postImage'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    PostController.editPost
);

router.delete('/delete/:id', authenticate, PostController.deletePost);

router.post('/upvote/:id', authenticate, PostController.upvotePost);
router.post('/downvote/:id', authenticate, PostController.downvotePost);


export const PostRoutes = router;
