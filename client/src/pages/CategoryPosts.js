import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { Calendar, User, Eye, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import './Home.css';

const CategoryPosts = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndPosts();
  }, [slug]);

  const fetchCategoryAndPosts = async () => {
    try {
      setLoading(true);
      const categoryResponse = await axios.get(`${API_URL}/api/categories/${slug}`);
      setCategory(categoryResponse.data);

      const postsResponse = await axios.get(`${API_URL}/api/posts`, {
        params: { category: categoryResponse.data._id }
      });
      setPosts(postsResponse.data.posts);
    } catch (error) {
      console.error('Failed to fetch category posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="home">
      <div className="hero" style={{ background: category?.color || '#3b82f6' }}>
        <div className="container">
          <Link to="/" className="back-link" style={{ color: 'white', marginBottom: '1rem' }}>
            <ArrowLeft size={20} />
            Back to All Posts
          </Link>
          <h1>{category?.name}</h1>
          <p>{category?.description || `Browse all posts in ${category?.name}`}</p>
        </div>
      </div>

      <div className="container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found in this category yet.</p>
            <Link to="/create" className="btn btn-primary">Create Post</Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post._id} className="post-card">
                {post.featuredImage && (
                  <div className="post-image">
                    <img src={post.featuredImage} alt={post.title} />
                  </div>
                )}
                <div className="post-content">
                  <div className="post-category" style={{ backgroundColor: post.category?.color }}>
                    {post.category?.name}
                  </div>
                  <h2 className="post-title">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <div className="post-author">
                      <User size={16} />
                      <span>{post.author?.username}</span>
                    </div>
                    <div className="post-stats">
                      <span><Eye size={16} /> {post.views}</span>
                      <span><Heart size={16} /> {post.likes?.length || 0}</span>
                    </div>
                  </div>
                  <div className="post-footer">
                    <span className="post-date">
                      <Calendar size={16} />
                      {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <Link to={`/post/${post.slug}`} className="read-more">
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPosts;
