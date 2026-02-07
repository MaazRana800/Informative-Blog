# Informative Blog - Professional MERN Stack Application

A cutting-edge, full-stack informative blog application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring advanced animations, HD graphics, external API integrations, and a stunning modern UI designed to attract traffic and engage users.

## 🌟 Advanced Features

### Professional Design & Animations
- **HD Hero Section**: Full-screen hero with high-definition backgrounds and gradient overlays
- **Framer Motion Animations**: Smooth transitions, hover effects, and scroll-triggered animations
- **Infinite Scroll News**: Real-time technology news with continuous horizontal scroll
- **Glass Morphism UI**: Modern design with backdrop blur and transparency effects
- **Lazy Loading**: Optimized image loading with blur effects for better performance
- **Responsive Grid Layouts**: Beautiful layouts that adapt to all screen sizes

### External API Integrations
- **News API**: Live technology news from around the world
- **Wikipedia API**: AI and technology knowledge base articles
- **Tech Events**: Curated upcoming technology conferences and events
- **Real-time Updates**: Fresh content updated 24/7

### User Features
- **User Authentication**: Register and login with JWT-based authentication
- **Create Posts**: Write and publish blog posts with rich content
- **Edit Posts**: Update your existing posts
- **Delete Posts**: Remove posts you've created
- **Like Posts**: Like posts from other authors
- **Categories**: Browse posts by category with color-coded badges
- **Search**: Search through posts
- **Responsive Design**: Modern UI that works on all devices

### Post Features
- Title and content
- Excerpt/summary
- Categories and tags
- Featured images
- View counter
- Like system
- Draft/Published status
- Author information

### Admin Features
- Full CRUD operations on all posts
- Category management
- User role system

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Framer Motion** - Advanced animations
- **React Intersection Observer** - Scroll animations
- **React Lazy Load Image** - Image optimization
- **Lucide React** - Modern icons
- **date-fns** - Date formatting
- **Swiper** - Touch sliders

## Project Structure

```
informative/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context (Auth)
│       ├── pages/          # Page components
│       ├── App.js
│       └── index.js
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Entry point
└── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
cd c:\Users\DELL\Desktop\inforamtive
```

2. **Install all dependencies**
```bash
npm run install-all
```

This will install dependencies for the root, server, and client.

3. **Configure Environment Variables**

Create a `.env` file in the `server` directory:
```bash
cd server
copy .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/informative-blog
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
NEWS_API_KEY=your_newsapi_key_here
```

**Important**: 
- Change the `JWT_SECRET` to a secure random string in production
- Get a free News API key from [NewsAPI.org](https://newsapi.org/) and add it to `NEWS_API_KEY`
- News API key is optional - the app will work without it but won't show live news

4. **Start MongoDB**

Make sure MongoDB is running on your system:
- **Local MongoDB**: Start the MongoDB service
- **MongoDB Atlas**: Use your Atlas connection string in `MONGODB_URI`

5. **Run the Application**

**Development Mode** (runs both client and server):
```bash
npm run dev
```

**Or run separately**:

Server only:
```bash
npm run server
```

Client only:
```bash
npm run client
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination, filters)
- `GET /api/posts/:slug` - Get single post by slug
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### External APIs
- `GET /api/external/news` - Get latest tech news (params: category, page)
- `GET /api/external/wikipedia` - Get Wikipedia articles (params: query)
- `GET /api/external/tech-events` - Get upcoming tech events

## Usage Guide

### Creating Your First Post

1. Register an account or login
2. Click "Create Post" in the navigation
3. Fill in the post details:
   - Title (required)
   - Excerpt (required)
   - Category (required)
   - Content (required)
   - Tags (optional)
   - Featured Image URL (optional)
4. Check "Publish immediately" or save as draft
5. Click "Create Post"

### Creating Categories

Categories can be created by any authenticated user. To create a category:
1. Use the API endpoint or create through the application
2. Provide a name, description, and color

### Managing Your Posts

- View all your posts in the Profile page
- Edit posts by clicking the "Edit" button
- Delete posts with the "Delete" button
- Toggle publish status when editing

## Default User Roles

- **user**: Can create, edit, and delete their own posts
- **admin**: Can manage all posts and categories

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes
- Input validation
- CORS enabled

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`, models in `server/models/`
2. **Frontend**: Add components in `client/src/components/`, pages in `client/src/pages/`

### Database Models

- **User**: username, email, password, role, avatar, bio
- **Post**: title, slug, content, excerpt, author, category, tags, featuredImage, published, views, likes
- **Category**: name, slug, description, color

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in your `.env` file
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` file
- Kill the process using the port

### CORS Issues
- Ensure the proxy is set correctly in `client/package.json`
- Check CORS configuration in `server/server.js`

## � Deployment

Ready to go live? Multiple deployment options available:

### Quick Deploy (5 minutes)
See **[DEPLOY_QUICK.md](DEPLOY_QUICK.md)** for fastest deployment

### Full Deployment Guide
See **[DEPLOYMENT.md](DEPLOYMENT.md)** for comprehensive instructions including:
- Vercel + Railway deployment
- Netlify + Render deployment
- Docker deployment
- VPS deployment (DigitalOcean/AWS)
- MongoDB Atlas setup
- Environment configuration

### Deployment Files Included
- `vercel.json` - Vercel configuration
- `netlify.toml` - Netlify configuration
- `render.yaml` - Render Blueprint
- `railway.json` - Railway configuration
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose setup

## �📖 Advanced Features Documentation

For detailed information about the advanced features, animations, and API integrations, see:
- **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** - Complete guide to modern UI features

## Future Enhancements

- ✅ HD Graphics and animations
- ✅ External API integrations
- ✅ Infinite scroll animations
- ✅ Modern glass morphism UI
- ✅ Lazy loading images
- [ ] Rich text editor (Quill/TinyMCE)
- [ ] Image upload functionality
- [ ] Comments system
- [ ] User profiles with avatars
- [ ] Social sharing
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] SEO optimization
- [ ] Analytics dashboard
- [ ] Dark/Light theme toggle

## License

ISC

## Author

Created as a MERN stack blog application template.

---

**Happy Blogging! 📝**
