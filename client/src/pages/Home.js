import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { Calendar, User, Eye, Heart, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 9 };
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await axios.get(`${API_URL}/api/posts`, { params });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>Welcome to Informative Blog</h1>
          <p>Discover insightful articles and share your knowledge with the world</p>
        </div>
      </div>

      <div className="container">
        <div className="categories-filter">
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('')}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              className={`category-btn ${selectedCategory === category._id ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category._id)}
              style={{ borderColor: category.color }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found. Be the first to create one!</p>
            <Link to="/create" className="btn btn-primary">Create Post</Link>
          </div>
        ) : (
          <>
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

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
