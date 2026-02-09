const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

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
