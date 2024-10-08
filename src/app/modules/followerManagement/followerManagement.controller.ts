import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { FollowerService } from "./followerManagement.service";

const followUser = catchAsync(
    async (req, res) => {
        const followerId = (req.user as JwtPayload).userId; 
        const { followingId } = req.body;

        await FollowerService.followUserIntoDB(followerId, followingId);

        res.status(200).json({
            success: true,
            message: 'Followed Successfully',
        });
    }
)

const unfollowUser = catchAsync(
    async (req, res) => {
        const followerId = (req.user as JwtPayload).userId;
        const { followingId } = req.body;

        await FollowerService.unfollowUserIntoDB(followerId, followingId);

        res.status(200).json({
            success: true,
            message: 'Unfollowed Successfully',
        });
    }
)

export const FollowerController = {
    followUser,
    unfollowUser
}