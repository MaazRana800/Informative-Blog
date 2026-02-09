const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
    website: String
  },
  skills: [{
    type: String,
    maxlength: 50
  }],
  interests: [{
    type: String,
    maxlength: 50
  }],
  location: {
    type: String,
    maxlength: 100
  },
  website: {
    type: String,
    maxlength: 200
  },
  stats: {
    postsCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    likesReceived: {
      type: Number,
      default: 0
    }
  },
  badges: [{
    type: String,
    enum: ['early_adopter', 'top_contributor', 'helpful_member', 'expert_writer', 'community_leader']
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  notificationSettings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    commentNotifications: {
      type: Boolean,
      default: true
    },
    followNotifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Update stats when user creates content
userProfileSchema.methods.updateStats = async function(type, increment = 1) {
  switch(type) {
    case 'post':
      this.stats.postsCount += increment;
      break;
    case 'comment':
      this.stats.commentsCount += increment;
      break;
    case 'view':
      this.stats.viewsCount += increment;
      break;
    case 'like':
      this.stats.likesReceived += increment;
      break;
  }
  return this.save();
};

// Check and award badges
userProfileSchema.methods.checkBadges = function() {
  const badges = [];
  
  if (this.stats.postsCount >= 1) badges.push('early_adopter');
  if (this.stats.postsCount >= 10) badges.push('expert_writer');
  if (this.stats.commentsCount >= 25) badges.push('helpful_member');
  if (this.stats.likesReceived >= 50) badges.push('top_contributor');
  if (this.stats.postsCount >= 20 && this.stats.commentsCount >= 50) badges.push('community_leader');
  
  this.badges = [...new Set([...this.badges, ...badges])];
  return this.save();
};

module.exports = mongoose.model('UserProfile', userProfileSchema);
