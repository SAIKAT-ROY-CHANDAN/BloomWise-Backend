import { uploadToImgBB } from "../../utils/imageUpload";
import PostModel from "./posts.model";
import fs from 'fs'

const createPostIntoDB = async (postData: any, file?: Express.Multer.File) => {
    let imageUrl = '';

    if (file) {
        try {
            imageUrl = await uploadToImgBB(file.path);
            fs.unlinkSync(file.path);
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

const editPostIntoDB = async (postId: string, userId: string, updatedData: any, file?: Express.Multer.File) => {
    let imageUrl = '';

    if (file) {
        try {
            imageUrl = await uploadToImgBB(file.path);
            fs.unlinkSync(file.path);

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

    // Check if the user has previously downvoted
    const hasDownvoted = await PostModel.findOne({
        _id: postId,
        downvotedBy: userId,
    });

    // Prepare the update object
    const updateObj: any = {
        $push: { upvotedBy: userId },
        $inc: { upvotes: 1 },
    };

    if (hasDownvoted) {
        // If the user has downvoted before, decrease the downvote count
        updateObj.$pull = { downvotedBy: userId };
        updateObj.$inc.downvotes = -1;
    }

    // Update the post in the database
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

    // Check if the user has already downvoted
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
        // If the user had previously upvoted, remove their upvote and decrease the count
        updateObj.$pull = { upvotedBy: userId };
        updateObj.$inc.upvotes = -1;
    }

    // Update the post with new downvote and handle upvote adjustment if needed
    const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        updateObj,
        { new: true }
    );

    return updatedPost;
};


export const PostService = {
    createPostIntoDB,
    editPostIntoDB,
    deletePostIntoDB,
    upvotePostIntoDB,
    downvotePostIntoDB
};
