import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Globe, Award, Edit2, Settings, Eye, Heart, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import API_URL from '../config/api';

const EnhancedProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profiles/${username}`);
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        setRecentPosts(data.recentPosts || []);
        setRecentComments(data.recentComments || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profiles/${username}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600">Profile not found</h2>
        <p className="text-gray-500 mt-2">This user profile doesn't exist or is private.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile.userId.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.userId.username}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail size={16} />
                {profile.userId.email}
              </p>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar size={16} />
                Joined {new Date(profile.userId.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Edit2 size={16} />
                Edit Profile
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Settings size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Location & Website */}
        <div className="flex flex-wrap gap-6 mt-6">
          {profile.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              {profile.location}
            </div>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Globe size={16} />
              {profile.website}
            </a>
          )}
        </div>

        {/* Skills & Interests */}
        {(profile.skills.length > 0 || profile.interests.length > 0) && (
          <div className="mt-6">
            {profile.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.interests.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <Award size={14} />
                  {badge.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <FileText className="mx-auto text-blue-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.postsCount}</div>
            <div className="text-gray-600 text-sm">Posts</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <MessageCircle className="mx-auto text-green-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.commentsCount}</div>
            <div className="text-gray-600 text-sm">Comments</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Eye className="mx-auto text-purple-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.totalViews[0]?.total || 0}</div>
            <div className="text-gray-600 text-sm">Views</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Heart className="mx-auto text-red-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.totalLikes[0]?.total || 0}</div>
            <div className="text-gray-600 text-sm">Likes</div>
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post._id} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.likesCount} likes</span>
                  <span>•</span>
                  <span>{post.viewsCount} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Comments</h2>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="text-gray-700 mb-2">{comment.content}</div>
                <div className="text-sm text-gray-500">
                  On <span className="font-medium">{comment.post.title}</span> • {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProfile;
