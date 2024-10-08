import { model, Schema } from "mongoose";
import { TFollower } from "./followerManagement.interface";

const followSchema = new Schema<TFollower>({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Follow = model<TFollower>('Follow', followSchema)

export default Follow