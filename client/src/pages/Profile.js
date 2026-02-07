import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/api/posts', {
        params: { published: 'all' }
      });
      const userPosts = response.data.posts.filter(post => post.author._id === user.id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={64} />
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <div className="profile-details">
              <span><Mail size={16} /> {user.email}</span>
              <span className="profile-role">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>My Posts</h2>
              <Link to="/create" className="btn btn-primary">Create New Post</Link>
            </div>

            {posts.length === 0 ? (
              <div className="no-posts">
                <p>You haven't created any posts yet.</p>
                <Link to="/create" className="btn btn-primary">Create Your First Post</Link>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <div key={post._id} className="post-item">
                    <div className="post-item-content">
                      <div className="post-item-header">
                        <Link to={`/post/${post.slug}`}>
                          <h3>{post.title}</h3>
                        </Link>
                        <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="post-item-excerpt">{post.excerpt}</p>
                      <div className="post-item-meta">
                        <span><Calendar size={14} /> {format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                        <span>Views: {post.views}</span>
                        <span>Likes: {post.likes?.length || 0}</span>
                      </div>
                    </div>
                    <div className="post-item-actions">
                      <Link to={`/edit/${post._id}`} className="btn btn-secondary btn-sm">
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(post._id)} className="btn btn-danger btn-sm">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
