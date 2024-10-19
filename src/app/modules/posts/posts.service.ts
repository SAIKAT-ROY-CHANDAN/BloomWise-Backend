import mongoose from "mongoose";
import { uploadToImgBB } from "../../utils/imageUpload";
import PostModel from "./posts.model";
import fs from 'fs'
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const createPostIntoDB = async (postData: any, file?: Express.Multer.File) => {
    let imageUrl = '';

    // if (file) {
    //     try {
    //         imageUrl = await uploadToImgBB(file.path);
    //         fs.unlinkSync(file.path);
    //     } catch (error: any) {
    //         throw new Error('Error uploading file to ImgBB: ' + error.message);
    //     }
    // }
    if (file) {
        try {
            const base64Data = file.buffer.toString('base64');
            imageUrl = await uploadToImgBB(base64Data);
        } catch (error: any) {
            throw new Error('Error uploading file to ImgBB: ' + error.message);
        }
    }

    const postPayload = {
        ...postData,
        image: imageUrl
    };


    const newPost = new PostModel(postPayload);
    await newPost.save();
    return newPost;
};

const getPostsFromDB = async (query: Record<string, unknown>) => {
    const modelQuery = PostModel.find();
    const queryBuilder = new QueryBuilder(modelQuery, query);

    queryBuilder.search(['title', 'content', 'category'])
        .filter()
        .sort()
        .fields();

    const posts = await queryBuilder.modelQuery.populate('createdBy', 'name');

    const totalInfo = await queryBuilder.countTotal();

    return { posts, ...totalInfo };
};

const getSinglePostFromDB = async (postId: string) => {
    const post = await PostModel.findById(postId).populate('createdBy', 'name');

    if (!post) {
        throw new Error('Post not found');
    }

    return post;
};


const getUserOwnPostsFromDB = async (userId: string, query: Record<string, unknown>) => {
    const modelQuery = PostModel.find({ createdBy: userId }).sort({ upvotes: -1 });

    const queryBuilder = new QueryBuilder(modelQuery, query);

    const posts = await queryBuilder.paginate().modelQuery.populate('createdBy', 'name');

    const totalInfo = await queryBuilder.countTotal();

    return { posts, ...totalInfo };
};

const editPostIntoDB = async (postId: string, userId: string, updatedData: any, file?: Express.Multer.File) => {
    let imageUrl = '';

    // if (file) {
    //     try {
    //         imageUrl = await uploadToImgBB(file.path);
    //         fs.unlinkSync(file.path);

    //         updatedData = { ...updatedData, image: imageUrl };
    //     } catch (error: any) {
    //         throw new Error('Error uploading file to ImgBB: ' + error.message);
    //     }
    // }

    if (file) {
        try {
            const base64Data = file.buffer.toString('base64');

            imageUrl = await uploadToImgBB(base64Data);

            updatedData = { ...updatedData, image: imageUrl };
        } catch (error: any) {
            throw new Error('Error uploading file to ImgBB: ' + error.message);
        }
    }


    const post = await PostModel.findOneAndUpdate(
        { _id: postId, createdBy: userId },
        updatedData,
        { new: true }
    );

    if (!post) {
        throw new Error('Post not found or not authorized');
    }

    return post;
};

const deletePostIntoDB = async (postId: string, userId: string) => {
    const post = await PostModel.findOneAndDelete({
        _id: postId,
        createdBy: userId,
    });

    if (!post) {
        throw new Error('Post not found or not authorized');
    }
};

const upvotePostIntoDB = async (postId: string, userId: string) => {
    const post = await PostModel.findById(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    const hasUpvoted = await PostModel.findOne({
        _id: postId,
        upvotedBy: userId,
    });

    if (hasUpvoted) {
        throw new Error('You have already upvoted this post');
    }

    const hasDownvoted = await PostModel.findOne({
        _id: postId,
        downvotedBy: userId,
    });

    const updateObj: any = {
        $push: { upvotedBy: userId },
        $inc: { upvotes: 1 },
    };

    if (hasDownvoted) {
        updateObj.$pull = { downvotedBy: userId };
        updateObj.$inc.downvotes = -1;
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        updateObj,
        { new: true }
    );

    return updatedPost;
};

const downvotePostIntoDB = async (postId: string, userId: string) => {
    const post = await PostModel.findById(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    const hasDownvoted = await PostModel.findOne({
        _id: postId,
        downvotedBy: userId,
    });

    if (hasDownvoted) {
        throw new Error('You have already downvoted this post');
    }

    // Check if the user has previously upvoted
    const hasUpvoted = await PostModel.findOne({
        _id: postId,
        upvotedBy: userId,
    });


    const updateObj: any = {
        $push: { downvotedBy: userId },
        $inc: { downvotes: 1 },
    };

    if (hasUpvoted) {
        updateObj.$pull = { upvotedBy: userId };
        updateObj.$inc.upvotes = -1;
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        updateObj,
        { new: true }
    );

    return updatedPost;
};

const getCommentsFromDB = async (postId: string) => {
    const post = await PostModel.findOne({ _id: postId }, 'comments')
    .populate('comments.createdBy', 'username email profileImage');

    if (!post) {
        throw new Error('Post not found');
    }

    const sortedComments = post.comments.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sortedComments;
};


const addCommentIntoDB = async (postId: string, userId: string, commentText: string) => {
    const post = await PostModel.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
            $push: {
                comments: {
                    commentText,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
        },
        { new: true }
    );
    return updatedPost;
};

const editCommentIntoDB = async (postId: string, commentId: string, userId: string, updatedText: string) => {

    const post = await PostModel.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    const comment = post.comments.find((comment) => comment._id.toString() === commentId);
    // const comment = post.comments.id(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.createdBy.toString() !== userId) {
        throw new Error('Unauthorized to edit this comment');
    }

    const updatedPost = await PostModel.updateOne(
        { _id: postId, 'comments._id': commentId, 'comments.createdBy': userId },
        {
            $set: {
                'comments.$.commentText': updatedText,
                'comments.$.updatedAt': new Date(),
            },
        },
        { new: true }
    );

    return updatedPost;
};

const deleteCommentIntoDB = async (postId: string, commentId: string, userId: string) => {
    const post = await PostModel.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    const objectIdCommentId = new mongoose.Types.ObjectId(commentId);

    const comment = post.comments.find((comment) => comment._id.toString() === objectIdCommentId.toString());

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.createdBy.toString() !== userId) {
        throw new Error('Unauthorized to delete this comment');
    }

    const deletedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
            $pull: {
                comments: { _id: commentId },
            },
        },
        { new: true }
    );

    return deletedPost;
};



export const PostService = {
    createPostIntoDB,
    editPostIntoDB,
    deletePostIntoDB,
    upvotePostIntoDB,
    downvotePostIntoDB,
    addCommentIntoDB,
    editCommentIntoDB,
    deleteCommentIntoDB,
    getPostsFromDB,
    getUserOwnPostsFromDB,
    getSinglePostFromDB,
    getCommentsFromDB
};
