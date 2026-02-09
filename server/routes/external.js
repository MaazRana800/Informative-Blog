const express = require('express');
const router = express.Router();
const axios = require('axios');

// Function to clean HTML tags from text
const cleanHtml = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
};

router.get('/news', async (req, res) => {
  try {
    const { category = 'technology', page = 1 } = req.query;
    
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: category,
        language: 'en',
        pageSize: 10,
        page: page,
        apiKey: process.env.NEWS_API_KEY || 'demo'
      }
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name,
      author: article.author
    }));

    res.json({ articles, totalResults: response.data.totalResults });
  } catch (error) {
    console.error('News API error:', error.message);
    res.json({ articles: [], totalResults: 0 });
  }
});

router.get('/wikipedia', async (req, res) => {
  try {
    const { query = 'Artificial Intelligence' } = req.query;
    
    // Use a single API call to get search results with extracts
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
        srlimit: 5,
        prop: 'extracts|pageimages',
        exintro: true,
        explaintext: true,
        piprop: 'thumbnail',
        pithumbsize: 300,
        redirects: 1
      },
      headers: {
        'User-Agent': 'Informative-Blog-App/1.0 (Educational Purpose)',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    const searchResults = response.data.query?.search || [];
    
    const articles = searchResults.map(item => ({
      title: item.title,
      extract: cleanHtml(item.snippet) || 'No excerpt available',
      url: `https://en.wikipedia.org/?curid=${item.pageid}`,
      image: null, // Skip images to avoid additional API calls
      snippet: cleanHtml(item.snippet)
    }));

    res.json({ articles });
  } catch (error) {
    console.error('Wikipedia API error:', error.message);
    // Return fallback data if API fails
    const fallbackArticles = [
      {
        title: 'Artificial Intelligence',
        extract: 'Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals.',
        url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
        image: null,
        snippet: 'AI is transforming how we interact with technology.'
      },
      {
        title: 'Machine Learning',
        extract: 'Machine learning is a branch of artificial intelligence that focuses on the use of data and algorithms to imitate the way that humans learn.',
        url: 'https://en.wikipedia.org/wiki/Machine_learning',
        image: null,
        snippet: 'ML enables computers to learn and improve from experience.'
      },
      {
        title: 'Technology',
        extract: 'Technology is the sum of techniques, skills, methods, and processes used in the production of goods or services.',
        url: 'https://en.wikipedia.org/wiki/Technology',
        image: null,
        snippet: 'Technology continues to shape our modern world.'
      }
    ];
    
    res.json({ articles: fallbackArticles });
  }
});

router.get('/tech-events', async (req, res) => {
  try {
    const events = [
      {
        id: 1,
        title: 'AI & Machine Learning Summit 2026',
        date: '2026-03-15',
        location: 'San Francisco, CA',
        description: 'Join industry leaders discussing the future of AI and ML technologies.',
        category: 'AI',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
      },
      {
        id: 2,
        title: 'Tech Innovation Conference',
        date: '2026-04-20',
        location: 'New York, NY',
        description: 'Explore cutting-edge innovations in technology and digital transformation.',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
      },
      {
        id: 3,
        title: 'Future of Computing Expo',
        date: '2026-05-10',
        location: 'London, UK',
        description: 'Discover the next generation of computing technologies and quantum computing.',
        category: 'Computing',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800'
      },
      {
        id: 4,
        title: 'Robotics & Automation Summit',
        date: '2026-06-05',
        location: 'Tokyo, Japan',
        description: 'Experience the latest in robotics, automation, and industrial AI.',
        category: 'Robotics',
        image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800'
      },
      {
        id: 5,
        title: 'Cybersecurity World Forum',
        date: '2026-07-18',
        location: 'Berlin, Germany',
        description: 'Learn about emerging threats and advanced security solutions.',
        category: 'Security',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'
      }
    ];

    res.json({ events });
  } catch (error) {
    console.error('Events error:', error.message);
    res.json({ events: [] });
  }
});

module.exports = router;
