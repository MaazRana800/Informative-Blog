const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user.id })
      .populate('userId', 'username email')
      .populate('stats');

    if (!profile) {
      // Create profile if it doesn't exist
      profile = new UserProfile({ userId: req.user.id });
      await profile.save();
      await profile.populate('userId', 'username email');
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's public profile by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await UserProfile.findOne({ userId: user._id })
      .populate('userId', 'username email createdAt')
      .select('-notificationSettings -socialLinks.email');

    if (!profile || !profile.isPublic) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Get user's recent posts
    const recentPosts = await Post.find({ author: user._id })
      .select('title slug createdAt likesCount viewsCount')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user's recent comments
    const recentComments = await Comment.find({ author: user._id, isDeleted: false })
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      profile,
      recentPosts,
      recentComments
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/me', auth, upload.single('avatar'), async (req, res) => {
  try {
    const updates = req.body;
    
    // Handle avatar upload
    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    // Parse JSON fields
    if (updates.socialLinks) {
      updates.socialLinks = JSON.parse(updates.socialLinks);
    }
    if (updates.skills) {
      updates.skills = JSON.parse(updates.skills);
    }
    if (updates.interests) {
      updates.interests = JSON.parse(updates.interests);
    }
    if (updates.notificationSettings) {
      updates.notificationSettings = JSON.parse(updates.notificationSettings);
    }

    let profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      updates,
      { new: true, upsert: true }
    ).populate('userId', 'username email');

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's activity/stats
router.get('/:username/stats', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await UserProfile.findOne({ userId: user._id });
    
    const stats = {
      postsCount: await Post.countDocuments({ author: user._id }),
      commentsCount: await Comment.countDocuments({ author: user._id, isDeleted: false }),
      totalViews: await Post.aggregate([
        { $match: { author: user._id } },
        { $group: { _id: null, total: { $sum: '$viewsCount' } } }
      ]),
      totalLikes: await Post.aggregate([
        { $match: { author: user._id } },
        { $group: { _id: null, total: { $sum: '$likesCount' } } }
      ]),
      joinDate: user.createdAt
    };

    // Update profile stats
    if (profile) {
      profile.stats.postsCount = stats.postsCount;
      profile.stats.commentsCount = stats.commentsCount;
      profile.stats.viewsCount = stats.totalViews[0]?.total || 0;
      profile.stats.likesReceived = stats.totalLikes[0]?.total || 0;
      await profile.save();
      await profile.checkBadges();
    }

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    })
    .select('username email createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ username: 1 });

    const profiles = await UserProfile.find({
      userId: { $in: users.map(u => u._id) },
      isPublic: true
    }).populate('userId', 'username email createdAt');

    res.json(profiles);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow user (placeholder for future implementation)
router.post('/:username/follow', auth, async (req, res) => {
  try {
    // This would require a Follow model
    res.json({ message: 'Follow feature coming soon!' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
