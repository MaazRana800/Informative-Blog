const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app';
    
    // Get all posts and categories
    const posts = await Post.find().select('slug updatedAt');
    const categories = await Category.find().select('slug updatedAt');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/register</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Category pages -->
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Post pages -->
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/post/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  const baseUrl = 'https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app';
  
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /profile/
Disallow: /create/
Disallow: /edit/

Sitemap: ${baseUrl}/api/sitemap/sitemap.xml

# Allow search engines to crawl the site
Crawl-delay: 1`;

  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

module.exports = router;
