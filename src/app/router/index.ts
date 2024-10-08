import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.router";
import { FollowRoutes } from "../modules/followerManagement/followerManagement.route";

const router = Router()

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/social',
        route: FollowRoutes
    },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router