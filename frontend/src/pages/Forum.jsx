import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Forum.css';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [replyContent, setReplyContent] = useState({});
    const [subReplyContent, setSubReplyContent] = useState({});
    const [showSubReplyForm, setShowSubReplyForm] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/forum');
            setPosts(data);
        } catch (err) {
            console.error('Error fetching posts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const createPostHandler = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forum', { title, content, category });
            setTitle('');
            setContent('');
            setCategory('General');
            fetchPosts();
        } catch (err) {
            alert('Failed to create post');
        }
    };

    const replyHandler = async (e, postId) => {
        e.preventDefault();
        try {
            await api.post(`/forum/${postId}/reply`, { content: replyContent[postId] });
            setReplyContent({ ...replyContent, [postId]: '' });
            fetchPosts();
        } catch (err) {
            alert('Failed to reply');
        }
    };

    const subReplyHandler = async (e, postId, replyId) => {
        e.preventDefault();
        const key = `${postId}-${replyId}`;
        try {
            await api.post(`/forum/${postId}/reply/${replyId}`, { content: subReplyContent[key] });
            setSubReplyContent({ ...subReplyContent, [key]: '' });
            setShowSubReplyForm({ ...showSubReplyForm, [key]: false });
            fetchPosts();
        } catch (err) {
            alert('Failed to reply');
        }
    };

    const deleteHandler = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/forum/${postId}`);
                fetchPosts();
            } catch (err) {
                alert('Failed to delete post');
            }
        }
    };

    const reportHandler = async (postId) => {
        try {
            await api.post(`/forum/${postId}/report`);
            alert('Post reported successfully');
            fetchPosts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to report post');
        }
    };

    if (loading) return <div className="loader">Loading discussion...</div>;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <div className="forum-page">
            <h2 className="title mb-20">Discussion Forum</h2>

            {/* Create Post Section */}
            {userInfo && userInfo.role === 'Student' && (
                <div className="card forum-create mb-20">
                    <h3>Start a Discussion</h3>
                    <form onSubmit={createPostHandler}>
                        <input
                            placeholder="Topic Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                        <div className="flex justify-between items-center">
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
                                <option value="General">General</option>
                                <option value="Placements">Placements</option>
                                <option value="Internships">Internships</option>
                                <option value="Academics">Academics</option>
                            </select>
                            <button type="submit" className="btn btn-primary">Post</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts Listing */}
            <div className="posts-list">
                {posts.map(post => (
                    <div key={post._id} className={`card post-card mb-20 ${post.reports && post.reports.length > 0 ? 'reported' : ''}`}>
                        <div className="post-header flex justify-between items-start">
                            <div>
                                <span className="post-category">{post.category}</span>
                                <h4 className="mt-5">{post.title}</h4>
                                <small className="text-muted">By {post.author?.name} • {new Date(post.createdAt).toLocaleString()}</small>
                            </div>
                            <div className="flex gap-10">
                                {userInfo && (userInfo.role === 'Admin' || (post.author && post.author._id === userInfo._id)) && (
                                    <button className="btn btn-danger btn-xs" onClick={() => deleteHandler(post._id)}>Delete</button>
                                )}
                                {userInfo && userInfo.role === 'Student' && post.author && post.author._id !== userInfo._id && (
                                    <button className="btn btn-secondary btn-xs" onClick={() => reportHandler(post._id)}>Report</button>
                                )}
                            </div>
                        </div>
                        <p className="post-content">{post.content}</p>

                        <div className="replies-section">
                            <h5>Replies ({post.replies.length})</h5>
                            {post.replies.map((reply, i) => (
                                <div key={i} className="reply">
                                    <p>{reply.content}</p>
                                    <small>— {reply.author?.name} • {new Date(reply.createdAt).toLocaleString()}</small>
                                    <button
                                        className="btn-link"
                                        onClick={() => setShowSubReplyForm({ ...showSubReplyForm, [`${post._id}-${reply._id}`]: !showSubReplyForm[`${post._id}-${reply._id}`] })}
                                    >
                                        Reply
                                    </button>

                                    {/* Sub-reply form */}
                                    {showSubReplyForm[`${post._id}-${reply._id}`] && (
                                        <form className="sub-reply-form flex mt-10" onSubmit={(e) => subReplyHandler(e, post._id, reply._id)}>
                                            <input
                                                placeholder="Write a reply..."
                                                value={subReplyContent[`${post._id}-${reply._id}`] || ''}
                                                onChange={(e) => setSubReplyContent({ ...subReplyContent, [`${post._id}-${reply._id}`]: e.target.value })}
                                                required
                                            />
                                            <button type="submit" className="btn btn-secondary btn-xs">Reply</button>
                                        </form>
                                    )}

                                    {/* Display sub-replies */}
                                    {reply.replies && reply.replies.length > 0 && (
                                        <div className="sub-replies ml-20 mt-10">
                                            {reply.replies.map((subReply, j) => (
                                                <div key={j} className="sub-reply">
                                                    <p>{subReply.content}</p>
                                                    <small>— {subReply.author?.name} • {new Date(subReply.createdAt).toLocaleString()}</small>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <form className="reply-form flex" onSubmit={(e) => replyHandler(e, post._id)}>
                                <input
                                    placeholder="Write a reply..."
                                    value={replyContent[post._id] || ''}
                                    onChange={(e) => setReplyContent({ ...replyContent, [post._id]: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn btn-secondary">Reply</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forum;
