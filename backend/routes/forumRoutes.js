const express = require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    addReply,
    addSubReply,
    reportPost,
    deletePost,
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPosts)
    .post(protect, createPost);

router.route('/:id/reply')
    .post(protect, addReply);

router.route('/:postId/reply/:replyId')
    .post(protect, addSubReply);

router.route('/:id/report')
    .post(protect, reportPost);

router.route('/:id')
    .delete(protect, deletePost);

module.exports = router;
