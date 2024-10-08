import express from 'express';
import { FollowerController } from './followerManagement.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = express.Router();

router.post('/follow', authenticate, FollowerController.followUser);

router.delete('/unfollow', authenticate, FollowerController.unfollowUser);

export const FollowRoutes = router;
