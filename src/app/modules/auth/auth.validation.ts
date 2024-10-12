import { z } from "zod"

const userValidationSchema = z.object({
    body: z.object({
        username: z.string().min(1).max(255),
        email: z.string().email().max(255),
        password: z.string().min(6).max(255),
        phone: z.string().max(20).optional(),
        role: z.enum(['admin', 'user']),
        address: z.string().min(1).max(255).optional(),
        profileImage: z.string().optional(),
        followers: z.string().optional(),
        following: z.string().optional(),
        isFollowing: z.boolean().optional()
    })
})

const userUpdateValidationSchema = z.object({
    body: z.object({
        username: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        phone: z.string().optional(),
        role: z.enum(['admin', 'user']).optional(),
        address: z.string().optional(),
        profileImage: z.string().optional(),
        followers: z.string().optional(),
        following: z.string().optional(),
        isFollowing: z.boolean().optional()
    })
})

export const userValidation = {
    userValidationSchema,
    userUpdateValidationSchema
}