import { Types } from 'mongoose';

export type Comment = {
    _id: string;
    post: Types.ObjectId;
    commentText: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type TPost = {
    _id: string;
    title: string;
    content: string;
    category: string;
    isPremium: boolean;
    createdBy: Types.ObjectId;
    upvotes: number;
    downvotes: number;
    upvotedBy: Types.ObjectId
    downvotedBy: Types.ObjectId;
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
    image: string
};
