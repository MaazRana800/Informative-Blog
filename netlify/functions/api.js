const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

// Import all your routes
const authRoutes = require('../../server/routes/auth');
const postRoutes = require('../../server/routes/posts');
const categoryRoutes = require('../../server/routes/categories');
const externalRoutes = require('../../server/routes/external');
const sitemapRoutes = require('../../server/routes/sitemap');
const profileRoutes = require('../../server/routes/profiles');
const commentRoutes = require('../../server/routes/comments');
const searchRoutes = require('../../server/routes/search');
const newsletterRoutes = require('../../server/routes/newsletter');

const app = express();

// CORS configuration for Netlify
const corsOptions = {
  origin: [
    process.env.URL, // Netlify will set this
    'http://localhost:3000',
    /\.netlify\.app$/
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://railway.app", "https://vercel.app", "https://\.netlify\.app$"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/informative-blog', {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const mongoStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'healthy',
    mongodb: {
      status: mongoStates[mongoState],
      readyState: mongoState
    },
    server: 'netlify-functions',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/sitemap', sitemapRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Root endpoint
app.get('/api/', (req, res) => {
  res.json({ 
    message: 'Welcome to Informative Blog API on Netlify',
    timestamp: new Date().toISOString(),
    status: 'operational',
    platform: 'netlify-functions'
  });
});

// Export for serverless
module.exports.handler = serverless(app);
