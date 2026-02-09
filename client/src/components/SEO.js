import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author = 'Informative Blog'
}) => {
  const siteTitle = title ? `${title} | Informative Blog` : 'Informative Blog - Share Your Knowledge';
  const siteDescription = description || 'A modern blog platform for sharing knowledge, ideas, and stories on technology, science, and more.';
  const siteImage = image || 'https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app/og-image.jpg';
  const siteUrl = url || 'https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app';
  const siteKeywords = keywords || 'blog, technology, science, articles, informative, knowledge sharing, programming, AI, machine learning';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content="Informative Blog" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      <meta name="twitter:site" content="@informative_blog" />
      <meta name="twitter:creator" content="@informative_blog" />

      {/* Additional SEO */}
      <link rel="canonical" href={siteUrl} />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="application-name" content="Informative Blog" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? "BlogPosting" : "WebSite",
          "name": siteTitle,
          "description": siteDescription,
          "url": siteUrl,
          "image": siteImage,
          "author": {
            "@type": "Organization",
            "name": "Informative Blog"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Informative Blog"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
