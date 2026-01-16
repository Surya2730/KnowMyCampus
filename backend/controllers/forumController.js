const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/forum
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({})
        .populate('author', 'name role')
        .populate('replies.author', 'name role')
        .populate('replies.replies.author', 'name role')
        .sort({ createdAt: -1 });
    res.json(posts);
});

// @desc    Create a post
// @route   POST /api/forum
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    const post = await Post.create({
        title,
        content,
        category,
        author: req.user._id,
    });

    if (post) {
        const populatedPost = await Post.findById(post._id).populate('author', 'name role');
        res.status(201).json(populatedPost);
    } else {
        res.status(400);
        throw new Error('Invalid post data');
    }
});

// @desc    Reply to a post
// @route   POST /api/forum/:id/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (post) {
        const reply = {
            content,
            author: req.user._id,
        };

        post.replies.push(reply);
        await post.save();

        const updatedPost = await Post.findById(req.params.id)
            .populate('author', 'name role')
            .populate('replies.author', 'name role');

        res.status(201).json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Reply to a reply (sub-reply)
// @route   POST /api/forum/:postId/reply/:replyId
// @access  Private
const addSubReply = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (post) {
        const reply = post.replies.id(req.params.replyId);

        if (!reply) {
            res.status(404);
            throw new Error('Reply not found');
        }

        const subReply = {
            content,
            author: req.user._id,
            createdAt: new Date()
        };

        reply.replies.push(subReply);
        await post.save();

        const updatedPost = await Post.findById(req.params.postId)
            .populate('author', 'name role')
            .populate('replies.author', 'name role')
            .populate('replies.replies.author', 'name role');

        res.status(201).json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Report a post
// @route   POST /api/forum/:id/report
// @access  Private
const reportPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.reports.includes(req.user._id)) {
            res.status(400);
            throw new Error('Post already reported by you');
        }

        post.reports.push(req.user._id);
        await post.save();
        res.json({ message: 'Post reported successfully' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete a post
// @route   DELETE /api/forum/:id
// @access  Private/Admin
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        // Check if user is admin or the post author
        if (req.user.role === 'Admin' || post.author.toString() === req.user._id.toString()) {
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(403);
            throw new Error('Not authorized to delete this post');
        }
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

module.exports = {
    getPosts,
    createPost,
    addReply,
    addSubReply,
    reportPost,
    deletePost,
};
