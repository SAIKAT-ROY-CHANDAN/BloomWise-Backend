import { model, Schema } from "mongoose";
import { TUser } from "./auth.interface";
import bcrypt from 'bcrypt'
import config from "../../config";

export const userSchema = new Schema<TUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: { type: String, enum: ['admin', 'user'], },
    address: { type: String },
    profileImage: { type: String },
    followers: { type: String, default: '0' },
    following: { type: String, default: '0' },
    isFollowing: { type: Boolean, default: false } 
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            return ret;
        }
    },
    toObject: {
        transform(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
})

userSchema.pre('save', async function (next) {
    const user = this
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    )
})

export const User = model<TUser>('User', userSchema)