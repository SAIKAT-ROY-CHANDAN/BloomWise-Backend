import { User } from "../auth/auth.model";
import Follow from "./followerManagement.model";

const followUserIntoDB = async (followerId: string, followingId: string) => {
    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
    if (existingFollow) {
        throw new Error('You are already following this user.');
    }

    const follow = new Follow({ follower: followerId, following: followingId });
    await follow.save();

    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { followerCount: 1 } });
};

const unfollowUserIntoDB = async (followerId: any, followingId: any) => {
    await Follow.findOneAndDelete({ follower: followerId, following: followingId });

    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { followerCount: -1 } });
};

export const FollowerService = {
    followUserIntoDB,
    unfollowUserIntoDB
}