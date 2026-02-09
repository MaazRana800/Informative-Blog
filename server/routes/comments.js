const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, sort = 'newest' } = req.query;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { likesCount: -1, createdAt: -1 }
    };

    const comments = await Comment.find({ 
      post: postId, 
      parent: null, 
      isDeleted: false,
      isApproved: true 
    })
    .populate('author', 'username')
    .populate({
      path: 'replies',
      match: { isDeleted: false, isApproved: true },
      populate: { author: 'username' },
      options: { sort: { createdAt: 1 } }
    })
    .sort(sortOptions[sort] || sortOptions.newest)
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ 
      post: postId, 
      parent: null, 
      isDeleted: false,
      isApproved: true 
    });

    res.json({
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new comment
router.post('/', auth, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('postId').isMongoId().withMessage('Invalid post ID'),
  body('parentId').optional().isMongoId().withMessage('Invalid parent comment ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, postId, parentId } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If it's a reply, check if parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment || parentComment.post.toString() !== postId) {
        return res.status(400).json({ message: 'Invalid parent comment' });
      }
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      post: postId,
      parent: parentId || null
    });

    await comment.save();

    // Update parent comment's reply count if it's a reply
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      await parentComment.updateReplyCount(1);
    }

    // Update user's comment count
    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (userProfile) {
      await userProfile.updateStats('comment');
    }

    // Populate author info
    await comment.populate('author', 'username');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment
router.put('/:commentId', auth, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'username');

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.softDelete();

    // Update parent comment's reply count if it's a reply
    if (comment.parent) {
      const parentComment = await Comment.findById(comment.parent);
      if (parentComment) {
        await parentComment.updateReplyCount(-1);
      }
    }

    // Update user's comment count
    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (userProfile) {
      await userProfile.updateStats('comment', -1);
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike comment
router.post('/:commentId/like', auth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const existingLike = comment.likes.find(like => 
      like.user.toString() === req.user.id
    );

    if (existingLike) {
      // Unlike
      comment.likes = comment.likes.filter(like => 
        like.user.toString() !== req.user.id
      );
    } else {
      // Like
      comment.likes.push({ user: req.user.id });
    }

    await comment.updateLikeCount();
    await comment.populate('author', 'username');

    res.json({
      comment,
      isLiked: !existingLike,
      likesCount: comment.likesCount
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report comment
router.post('/:commentId/report', auth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.reportCount += 1;
    
    // Auto-hide if too many reports
    if (comment.reportCount >= 5) {
      comment.isApproved = false;
    }

    await comment.save();

    res.json({ message: 'Comment reported successfully' });
  } catch (error) {
    console.error('Report comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's comments
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ 
      author: userId, 
      isDeleted: false 
    })
    .populate('post', 'title slug')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ 
      author: userId, 
      isDeleted: false 
    });

    res.json({
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
