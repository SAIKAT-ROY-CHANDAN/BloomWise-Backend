export type TUser = {
    username: string,
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'admin'; 
    address: string;
    profileImage?: string;
    followers: string;
    following: string;
    isFollowing: boolean;
}
