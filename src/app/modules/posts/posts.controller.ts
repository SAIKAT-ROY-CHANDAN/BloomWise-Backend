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

const getPosts = catchAsync(async (req, res) => {
    const result = await PostService.getPostsFromDB(req.query);

    res.status(200).json({
        data: result.posts,
        total: result.total,
        page: result.page,
        totalPages: result.totalPage,
    });
});

const getSinglePosts = catchAsync(async (req, res) => {
    const result = await PostService.getPostsFromDB(req.query);

    res.status(200).json({
        data: result.posts,
        total: result.total,
        page: result.page,
        totalPages: result.totalPage,
    });
});

const getUserOwnPosts = catchAsync(async (req, res) => {
    const userId = (req.user as JwtPayload).userId;
    const result = await PostService.getUserOwnPostsFromDB(userId, req.query);

    res.status(200).json({
        data: result.posts,
        total: result.total,
        page: result.page,
        totalPages: result.totalPage,
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

const addComment = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const { commentText } = req.body;
    console.log(req.body, 'from contoller');
    const userId = (req.user as JwtPayload).userId;

    const updatedPost = await PostService.addCommentIntoDB(postId, userId, commentText);

    res.status(200).json({
        success: true,
        message: 'Comment added successfully',
        data: updatedPost,
    });
});

const editComment = catchAsync(async (req, res) => {
    const { postId, commentId } = req.params;
    const { commentText } = req.body;
    const userId = (req.user as JwtPayload).userId;

    const updatedPost = await PostService.editCommentIntoDB(postId, commentId, userId, commentText);

    res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedPost,
    });
});

const deleteComment = catchAsync(async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = (req.user as JwtPayload).userId;

    const updatedPost = await PostService.deleteCommentIntoDB(postId, commentId, userId);

    res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
        data: updatedPost,
    });
});


export const PostController = {
    createPost,
    editPost,
    deletePost,
    upvotePost,
    downvotePost,
    addComment,
    editComment,
    deleteComment,
    getPosts,
    getUserOwnPosts,
    getSinglePosts
};
