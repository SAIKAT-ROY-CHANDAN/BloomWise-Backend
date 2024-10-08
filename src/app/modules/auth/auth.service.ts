import httpStatus from "http-status"
import { TUser } from "./auth.interface"
import { User } from "./auth.model"
import bcrypt from "bcrypt"
import { createToken } from "./auth.utils"
import config from "../../config"
import AppError from "../../error/AppError"
import fs from 'fs'
import { uploadToImgBB } from "../../utils/imageUpload"

const createUserIntoDB = async (payload: TUser, file?: Express.Multer.File) => {
    let imageUrl = '';

    if (file) {
        try {
            imageUrl = await uploadToImgBB(file.path);

            fs.unlinkSync(file.path);
        } catch (error: any) {
            throw new Error('Error uploading file to ImgBB: ' + error.message);
        }
    }

    const userPayload = {
        ...payload,
        profileImage: imageUrl,
    };

    const result = await User.create(userPayload);
    return result;
};

const updateUserInDB = async (userId: string, payload: Partial<TUser>, file?: Express.Multer.File) => {
    const updateData: Partial<TUser> = { ...payload };

    if (file) {
        try {
            const imageUrl = await uploadToImgBB(file.path);
            updateData.profileImage = imageUrl;
            fs.unlinkSync(file.path);
        } catch (error: any) {
            throw new Error('Error uploading file to ImgBB: ' + error.message);
        }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return updatedUser;
};


const loginUserIntoDB = async (payload: Partial<TUser>) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found')
    }

    const isPasswordCorrect = await bcrypt.compare(password as string, user.password);

    if (!isPasswordCorrect) {
        throw new AppError(httpStatus.FORBIDDEN, 'Your Password is Incorrect')
    }


    const jwtPayload = {
        userId: user._id.toString(),
        role: user.role
    }

    const token = createToken(jwtPayload, config.jwt_access_secret as string)

    return { user, token }
}

export const AuthService = {
    createUserIntoDB,
    loginUserIntoDB,
    updateUserInDB
}