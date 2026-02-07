import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, Eye, Heart, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts/${slug}`);
      setPost(response.data);
      setLikesCount(response.data.likes?.length || 0);
      if (user) {
        setLiked(response.data.likes?.includes(user.id));
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${post._id}/like`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${post._id}`);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2>Post not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go Home
        </Link>
      </div>
    );
  }

  const canEdit = user && (user.id === post.author._id || user.role === 'admin');

  return (
    <div className="post-detail">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          Back to Posts
        </Link>

        <article className="post-detail-content">
          <div className="post-header">
            <div className="post-category" style={{ backgroundColor: post.category?.color }}>
              {post.category?.name}
            </div>
            <h1>{post.title}</h1>
            
            <div className="post-meta-detail">
              <div className="post-author-detail">
                <User size={20} />
                <div>
                  <strong>{post.author?.username}</strong>
                  {post.author?.bio && <p>{post.author.bio}</p>}
                </div>
              </div>
              <div className="post-info">
                <span>
                  <Calendar size={16} />
                  {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                </span>
                <span>
                  <Eye size={16} />
                  {post.views} views
                </span>
              </div>
            </div>
          </div>

          {post.featuredImage && (
            <div className="post-featured-image">
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}

          <div className="post-body">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          <div className="post-actions">
            <button
              onClick={handleLike}
              className={`like-btn ${liked ? 'liked' : ''}`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {canEdit && (
              <div className="edit-actions">
                <Link to={`/edit/${post._id}`} className="btn btn-secondary">
                  <Edit size={18} />
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
