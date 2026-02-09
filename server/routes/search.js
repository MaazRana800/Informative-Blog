const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Comment = require('../models/Comment');

// Advanced search
router.get('/', async (req, res) => {
  try {
    const {
      q: query,
      type = 'all',
      category,
      author,
      dateFrom,
      dateTo,
      sortBy = 'relevance',
      page = 1,
      limit = 10
    } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let results = {
      posts: [],
      users: [],
      comments: [],
      total: 0
    };

    // Build date filter
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }

    // Search posts
    if (type === 'all' || type === 'posts') {
      let postQuery = {
        $or: [
          { title: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
          { excerpt: { $regex: searchRegex } }
        ],
        ...dateFilter
      };

      if (category) {
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          postQuery.category = categoryDoc._id;
        }
      }

      if (author) {
        const authorDoc = await User.findOne({ username: author });
        if (authorDoc) {
          postQuery.author = authorDoc._id;
        }
      }

      // Sort options
      let sortOptions = {};
      switch (sortBy) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'popular':
          sortOptions = { likesCount: -1, viewsCount: -1 };
          break;
        case 'trending':
          sortOptions = { viewsCount: -1, likesCount: -1, createdAt: -1 };
          break;
        default: // relevance
          sortOptions = { $score: { $meta: 'textScore' } };
      }

      const posts = await Post.find(postQuery)
        .populate('author', 'username')
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

      results.posts = posts;
      results.total += await Post.countDocuments(postQuery);
    }

    // Search users
    if (type === 'all' || type === 'users') {
      const users = await User.find({
        username: { $regex: searchRegex }
      })
      .select('username email createdAt')
      .skip(skip)
      .limit(limitNum);

      const userIds = users.map(u => u._id);
      const profiles = await UserProfile.find({
        userId: { $in: userIds },
        isPublic: true
      }).populate('userId', 'username email createdAt');

      results.users = profiles;
      results.total += users.length;
    }

    // Search comments
    if (type === 'all' || type === 'comments') {
      const comments = await Comment.find({
        content: { $regex: searchRegex },
        isDeleted: false,
        ...dateFilter
      })
      .populate('author', 'username')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

      results.comments = comments;
      results.total += await Comment.countDocuments({
        content: { $regex: searchRegex },
        isDeleted: false,
        ...dateFilter
      });
    }

    // Pagination for combined results
    const totalPages = Math.ceil(results.total / limitNum);

    res.json({
      query,
      type,
      results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: results.total,
        pages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search suggestions/autocomplete
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query, type = 'all' } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchRegex = new RegExp(query, 'i');
    const suggestions = [];

    // Post title suggestions
    if (type === 'all' || type === 'posts') {
      const posts = await Post.find({
        title: { $regex: searchRegex }
      })
      .select('title slug')
      .limit(5);

      posts.forEach(post => {
        suggestions.push({
          type: 'post',
          title: post.title,
          url: `/post/${post.slug}`
        });
      });
    }

    // User suggestions
    if (type === 'all' || type === 'users') {
      const users = await User.find({
        username: { $regex: searchRegex }
      })
      .select('username')
      .limit(5);

      users.forEach(user => {
        suggestions.push({
          type: 'user',
          title: user.username,
          url: `/profile/${user.username}`
        });
      });
    }

    // Category suggestions
    if (type === 'all' || type === 'categories') {
      const categories = await Category.find({
        name: { $regex: searchRegex }
      })
      .select('name slug')
      .limit(5);

      categories.forEach(category => {
        suggestions.push({
          type: 'category',
          title: category.name,
          url: `/category/${category.slug}`
        });
      });
    }

    res.json({ suggestions: suggestions.slice(0, 10) });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trending searches
router.get('/trending', async (req, res) => {
  try {
    // This would typically be implemented with a search analytics system
    // For now, return mock trending searches based on popular content
    const trending = [
      { query: 'React', count: 125 },
      { query: 'JavaScript', count: 98 },
      { query: 'Web Development', count: 87 },
      { query: 'Node.js', count: 76 },
      { query: 'Machine Learning', count: 65 },
      { query: 'Python', count: 54 },
      { query: 'CSS', count: 43 },
      { query: 'HTML', count: 32 },
      { query: 'Database', count: 28 },
      { query: 'API', count: 21 }
    ];

    res.json({ trending });
  } catch (error) {
    console.error('Trending searches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search within a specific post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const comments = await Comment.find({
      post: postId,
      content: { $regex: searchRegex },
      isDeleted: false
    })
    .populate('author', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

    const total = await Comment.countDocuments({
      post: postId,
      content: { $regex: searchRegex },
      isDeleted: false
    });

    res.json({
      comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Search post comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
