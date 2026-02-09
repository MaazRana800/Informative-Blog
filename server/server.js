const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app',
    /\.vercel\.app$/
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
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://railway.app", "https://vercel.app"],
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

// Data sanitization
app.use(mongoSanitize());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
app.use('/uploads', express.static('uploads', {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true
}));

// Performance headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache control for API responses
  if (req.path.startsWith('/api/external/')) {
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes for external APIs
  } else if (req.path.startsWith('/api/posts') || req.path.startsWith('/api/categories')) {
    res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute for posts/categories
  }
  
  next();
});

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
  console.log('Retrying connection in 5 seconds...');
  setTimeout(() => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/informative-blog')
      .then(() => console.log('MongoDB connected on retry'))
      .catch((retryErr) => console.error('MongoDB retry failed:', retryErr));
  }, 5000);
});

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const externalRoutes = require('./routes/external');
const sitemapRoutes = require('./routes/sitemap');

// MongoDB connection status endpoint
app.get('/api/status', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const mongoStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    mongodb: {
      status: mongoStates[mongoState],
      readyState: mongoState
    },
    server: 'running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/sitemap', sitemapRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Informative Blog API',
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
