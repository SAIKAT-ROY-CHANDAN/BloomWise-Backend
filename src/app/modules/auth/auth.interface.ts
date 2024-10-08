export type TUser = {
    username: string,
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'admin'; 
    address: string;
    profileImage?: string;
    followerCount: number;
    followingCount: number;
    isFollowing: boolean;
}
