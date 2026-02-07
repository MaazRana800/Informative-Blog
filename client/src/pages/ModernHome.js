import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { 
  Calendar, User, Eye, Heart, ArrowRight, TrendingUp, 
  Sparkles, Zap, Globe, Clock, MapPin, ExternalLink,
  BookOpen, Brain, Cpu, Rocket
} from 'lucide-react';
import { format } from 'date-fns';
import './ModernHome.css';

const ModernHome = () => {
  const [posts, setPosts] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [wikiArticles, setWikiArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuredRef, featuredInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [newsRef, newsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [wikiRef, wikiInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [eventsRef, eventsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    fetchAllData();
  }, [selectedCategory]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPosts(),
      fetchNews(),
      fetchWikipedia(),
      fetchEvents(),
      fetchCategories()
    ]);
    setLoading(false);
  };

  const fetchPosts = async () => {
    try {
      const params = { page: 1, limit: 6 };
      if (selectedCategory) params.category = selectedCategory;
      const response = await axios.get('/api/posts', { params });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/external/news', {
        params: { category: 'technology' }
      });
      setNewsArticles(response.data.articles.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  const fetchWikipedia = async () => {
    try {
      const response = await axios.get('/api/external/wikipedia', {
        params: { query: 'Artificial Intelligence Technology' }
      });
      setWikiArticles(response.data.articles);
    } catch (error) {
      console.error('Failed to fetch Wikipedia:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/external/tech-events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.03, 
      y: -8,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className="modern-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        >
          <Sparkles size={48} />
        </motion.div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  return (
    <div className="modern-home">
      {/* Hero Section with HD Background */}
      <motion.section 
        ref={heroRef}
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt="Technology Background"
            effect="blur"
            className="hero-bg-image"
          />
        </div>
        
        <div className="container hero-content">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-text"
          >
            <motion.div 
              className="hero-badge"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={20} />
              <span>Welcome to the Future</span>
            </motion.div>
            
            <h1 className="hero-title">
              Discover the World of
              <span className="gradient-text"> Technology & AI</span>
            </h1>
            
            <p className="hero-description">
              Explore cutting-edge insights, breaking news, and comprehensive knowledge 
              about artificial intelligence, technology innovations, and upcoming events
            </p>
            
            <div className="hero-actions">
              <Link to="/create" className="btn-hero primary">
                <Rocket size={20} />
                Start Creating
              </Link>
              <a href="#featured" className="btn-hero secondary">
                <TrendingUp size={20} />
                Explore Content
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="stat-item">
              <BookOpen size={32} />
              <h3>{posts.length}+</h3>
              <p>Articles</p>
            </div>
            <div className="stat-item">
              <Brain size={32} />
              <h3>{categories.length}+</h3>
              <p>Categories</p>
            </div>
            <div className="stat-item">
              <Globe size={32} />
              <h3>24/7</h3>
              <p>Updates</p>
            </div>
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={24} style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Posts Section */}
      <section id="featured" className="section featured-section" ref={featuredRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <div className="section-title-wrapper">
              <Zap className="section-icon" />
              <h2 className="section-title">Featured Articles</h2>
            </div>
            <p className="section-subtitle">
              Handpicked stories from our community
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="category-filter-modern"
            variants={containerVariants}
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
          >
            <motion.button
              variants={itemVariants}
              className={`category-chip ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category._id}
                variants={itemVariants}
                className={`category-chip ${selectedCategory === category._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category._id)}
                style={{ 
                  '--chip-color': category.color,
                  backgroundColor: selectedCategory === category._id ? category.color : 'transparent',
                  borderColor: category.color
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            className="posts-grid-modern"
            variants={containerVariants}
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
          >
            {posts.map((post, index) => (
              <motion.article
                key={post._id}
                variants={itemVariants}
                className="post-card-modern"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <Link to={`/post/${post.slug}`}>
                  <motion.div variants={cardHoverVariants} className="card-content-wrapper">
                    <div className="post-image-modern">
                      <LazyLoadImage
                        src={post.featuredImage || `https://images.unsplash.com/photo-${1550751827 + index}-4bd374c3f58b?w=800&q=80`}
                        alt={post.title}
                        effect="blur"
                        className="post-img"
                      />
                      <div className="post-overlay">
                        <motion.div
                          className="overlay-icon"
                          whileHover={{ scale: 1.2, rotate: 90 }}
                        >
                          <ArrowRight size={24} />
                        </motion.div>
                      </div>
                      <div className="post-category-badge" style={{ backgroundColor: post.category?.color }}>
                        {post.category?.name}
                      </div>
                    </div>
                    
                    <div className="post-content-modern">
                      <h3 className="post-title-modern">{post.title}</h3>
                      <p className="post-excerpt-modern">{post.excerpt}</p>
                      
                      <div className="post-meta-modern">
                        <div className="meta-left">
                          <User size={16} />
                          <span>{post.author?.username}</span>
                        </div>
                        <div className="meta-right">
                          <span><Eye size={14} /> {post.views}</span>
                          <span><Heart size={14} /> {post.likes?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="post-footer-modern">
                        <span className="post-date-modern">
                          <Calendar size={14} />
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech News Section with Infinite Scroll Animation */}
      <section className="section news-section" ref={newsRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={newsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <div className="section-title-wrapper">
              <TrendingUp className="section-icon" />
              <h2 className="section-title">Latest Tech News</h2>
            </div>
            <p className="section-subtitle">
              Real-time updates from around the world
            </p>
          </motion.div>

          <div className="news-scroll-container">
            <motion.div 
              className="news-scroll-track"
              animate={{ x: [0, -1000] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {[...newsArticles, ...newsArticles].map((article, index) => (
                <motion.a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-card"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="news-image">
                    <LazyLoadImage
                      src={article.image || 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400'}
                      alt={article.title}
                      effect="blur"
                    />
                  </div>
                  <div className="news-content">
                    <span className="news-source">{article.source}</span>
                    <h4>{article.title}</h4>
                    <p>{article.description?.substring(0, 100)}...</p>
                    <div className="news-footer">
                      <Clock size={14} />
                      <span>{format(new Date(article.publishedAt), 'MMM dd')}</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wikipedia Knowledge Section */}
      <section className="section wiki-section" ref={wikiRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={wikiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <div className="section-title-wrapper">
              <Brain className="section-icon" />
              <h2 className="section-title">Knowledge Base</h2>
            </div>
            <p className="section-subtitle">
              In-depth information from Wikipedia
            </p>
          </motion.div>

          <motion.div 
            className="wiki-grid"
            variants={containerVariants}
            initial="hidden"
            animate={wikiInView ? "visible" : "hidden"}
          >
            {wikiArticles.map((article, index) => (
              <motion.a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="wiki-card"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              >
                {article.image && (
                  <div className="wiki-image">
                    <LazyLoadImage
                      src={article.image}
                      alt={article.title}
                      effect="blur"
                    />
                  </div>
                )}
                <div className="wiki-content">
                  <h3>{article.title}</h3>
                  <p>{article.extract?.substring(0, 200)}...</p>
                  <div className="wiki-link">
                    Read more on Wikipedia
                    <ExternalLink size={16} />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Timeline */}
      <section className="section events-section" ref={eventsRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={eventsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <div className="section-title-wrapper">
              <Cpu className="section-icon" />
              <h2 className="section-title">Upcoming Tech Events</h2>
            </div>
            <p className="section-subtitle">
              Don't miss these exciting technology conferences
            </p>
          </motion.div>

          <motion.div 
            className="events-timeline"
            variants={containerVariants}
            initial="hidden"
            animate={eventsInView ? "visible" : "hidden"}
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className="event-item"
                whileHover={{ x: 10 }}
              >
                <div className="event-date">
                  <Calendar size={24} />
                  <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                </div>
                
                <div className="event-card">
                  <div className="event-image">
                    <LazyLoadImage
                      src={event.image}
                      alt={event.title}
                      effect="blur"
                    />
                    <div className="event-category">{event.category}</div>
                  </div>
                  
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-location">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                
                {index < events.length - 1 && <div className="timeline-connector"></div>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <Rocket size={64} className="cta-icon" />
            <h2>Ready to Share Your Knowledge?</h2>
            <p>Join our community and start creating amazing content today</p>
            <Link to="/register" className="btn-cta">
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;
