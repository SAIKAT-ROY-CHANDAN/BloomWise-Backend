import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { PostService } from "./posts.service";


const createPost = catchAsync(async (req, res) => {
    const userId = (req.user as JwtPayload).userId;
    const postData = { ...req.body, createdBy: userId };

    const post = await PostService.createPostIntoDB(postData, req.file);

    res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
    });
});


const editPost = catchAsync(async (req, res) => {
    const postId = req.params.id;
    const userId = (req.user as JwtPayload).userId;
    const updatedData = req.body;
    const file = req.file

    const updatedPost = await PostService.editPostIntoDB(postId, userId, updatedData, file);

    res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: updatedPost,
    });
});


const deletePost = catchAsync(async (req, res) => {
    const postId = req.params.id;
    const userId = (req.user as JwtPayload).userId;

    await PostService.deletePostIntoDB(postId, userId);

    res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
    });
});

const upvotePost = catchAsync(async (req, res) => {
    const postId = req.params.id;
    const userId = (req.user as JwtPayload).userId;

    const updatedPost = await PostService.upvotePostIntoDB(postId, userId);

    res.status(200).json({
        success: true,
        message: 'Post upvoted successfully',
        data: updatedPost,
    });
});

const downvotePost = catchAsync(async (req, res) => {
    const postId = req.params.id;
    const userId = (req.user as JwtPayload).userId;

    const updatedPost = await PostService.downvotePostIntoDB(postId, userId);

    res.status(200).json({
        success: true,
        message: 'Post downvoted successfully',
        data: updatedPost,
    });
});


export const PostController = {
    createPost,
    editPost,
    deletePost,
    upvotePost,
    downvotePost
};
