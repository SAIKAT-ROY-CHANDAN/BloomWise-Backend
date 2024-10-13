import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { AuthService } from "./auth.service"
import { JwtPayload } from "jsonwebtoken"


const createUser = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AuthService.createUserIntoDB(req.body, req.file)

        res.status(200).json({
            success: true,
            message: 'User Registered successfully',
            data: result
        })
    }
)

const updateUser = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req.user as JwtPayload).userId;
        const result = await AuthService.updateUserInDB(userId, req.body, req.file)

        res.status(200).json({
            success: true,
            message: 'Profile Updated successfully',
            data: result
        })
    }
)

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthService.loginUserIntoDB(req.body);

    res.status(200).json({
        success: true,
        message: 'User Login successfully',
        data: result
    })
});


export const AuthController = {
    createUser,
    updateUser,
    loginUser
}