# Custom Domain Setup Guide

## 🌐 Overview
This guide will help you set up a custom domain for your MERN blog application.

## 🛒 Step 1: Buy a Domain Name

### Recommended Domain Registrars:
- **Namecheap** (namecheap.com) - Affordable and user-friendly
- **GoDaddy** (godaddy.com) - Popular with good support
- **Cloudflare** (cloudflare.com) - Free DNS management
- **Google Domains** (domains.google.com) - Simple and reliable

### Tips for Choosing a Domain:
- Keep it short and memorable
- Use .com, .blog, or .tech extensions
- Avoid numbers and hyphens if possible
- Check for trademark conflicts

## 🔧 Step 2: Configure DNS Settings

### For Vercel (Frontend):
1. Go to your **Vercel Dashboard**
2. Select your project: `informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app`
3. Click **"Settings"** → **"Domains"**
4. Add your custom domain (e.g., `yourblog.com`)
5. Vercel will show you DNS records to add

### DNS Records to Add:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### For Railway (Backend API):
1. Go to your **Railway Dashboard**
2. Select your project: `informative-blog-web`
3. Click **"Settings"** → **"Custom Domains"**
4. Add your API domain (e.g., `api.yourblog.com`)

## 📧 Step 3: Configure Email (Optional)

### Professional Email Options:
- **Google Workspace** - $6/user/month
- **Microsoft 365** - $6/user/month
- **Zoho Mail** - Free tier available
- **ProtonMail** - Privacy-focused

### Email DNS Records:
```
Type: MX
Name: @
Value: aspmx.l.google.com (Priority: 1)

Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com ~all"
```

## 🔒 Step 4: SSL Certificate

### Automatic SSL:
- **Vercel** provides free SSL certificates automatically
- **Railway** provides free SSL certificates automatically
- Certificates are renewed automatically

### Manual SSL (if needed):
- Use **Let's Encrypt** (free)
- Or purchase from your domain registrar

## 🚀 Step 5: Update Application URLs

### Frontend URLs to Update:
1. **CORS Settings** in `server/server.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://yourblog.com',
    'https://www.yourblog.com',
    /\.vercel\.app$/
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

2. **SEO Component** in `client/src/components/SEO.js`:
```javascript
const siteUrl = url || 'https://yourblog.com';
```

3. **Environment Variables** in Vercel:
```
REACT_APP_API_URL = https://api.yourblog.com
```

### Backend URLs to Update:
1. **Sitemap Generation** in `server/routes/sitemap.js`:
```javascript
const baseUrl = 'https://yourblog.com';
```

## 📊 Step 6: Analytics and Monitoring

### Google Analytics Setup:
1. Create a **Google Analytics 4** property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to your website:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Search Console Setup:
1. Add your domain to **Google Search Console**
2. Verify ownership using DNS record
3. Submit your sitemap: `https://yourblog.com/api/sitemap/sitemap.xml`

## 🔍 Step 7: SEO Optimization

### Meta Tags Update:
Update your SEO component with your domain:
```javascript
const siteUrl = 'https://yourblog.com';
const siteImage = 'https://yourblog.com/og-image.jpg';
```

### Sitemap Submission:
1. Go to **Google Search Console**
2. Submit your sitemap: `https://yourblog.com/api/sitemap/sitemap.xml`
3. Monitor indexing status

## 🛡️ Step 8: Security Considerations

### DNS Security:
- Enable **DNSSEC** if your registrar supports it
- Use **DMARC** records for email security
- Set up **DNS CAA** records for SSL certificates

### Firewall Rules:
- Configure **Cloudflare** (if using) for DDoS protection
- Set up **WAF** rules for additional security

## ⚡ Step 9: Performance Optimization

### CDN Setup:
- **Vercel Edge Network** (automatic)
- **Cloudflare CDN** (optional, for additional optimization)
- **Image CDN** for optimized image delivery

### Caching Strategy:
- Browser caching headers (already configured)
- CDN caching for static assets
- Database query optimization

## 📱 Step 10: Testing

### Pre-Launch Checklist:
- [ ] SSL certificate is working
- [ ] All pages load correctly
- [ ] Forms are submitting properly
- [ ] Mobile responsiveness is good
- [ ] Page speed is acceptable
- [ ] SEO meta tags are correct
- [ ] Sitemap is accessible
- [ ] Analytics are tracking

### Tools for Testing:
- **Google PageSpeed Insights** - Performance testing
- **GTmetrix** - Speed and optimization
- **Mobile-Friendly Test** - Mobile compatibility
- **SSL Labs** - SSL certificate test

## 🎯 Step 11: Launch

### Go-Live Process:
1. **Update all URLs** in your code
2. **Deploy changes** to Vercel and Railway
3. **Update DNS records** at your registrar
4. **Wait for propagation** (24-48 hours)
5. **Test thoroughly** on the new domain
6. **Submit to search engines**
7. **Monitor performance** and analytics

## 🔄 Ongoing Maintenance

### Monthly Tasks:
- Check SSL certificate renewal
- Monitor website performance
- Review analytics data
- Update security patches
- Backup important data

### Quarterly Tasks:
- Review SEO performance
- Update content strategy
- Optimize page speed
- Check for broken links
- Review security logs

## 🆘 Troubleshooting

### Common Issues:
1. **DNS Propagation Delay** - Wait 24-48 hours
2. **SSL Certificate Issues** - Check DNS records
3. **CORS Errors** - Update allowed origins
4. **Mixed Content Errors** - Use HTTPS for all resources
5. **Redirect Issues** - Configure proper redirects

### Support Resources:
- **Vercel Documentation** - vercel.com/docs
- **Railway Documentation** - docs.railway.app
- **Google Search Console Help** - support.google.com/webmasters

---

## 🎉 Congratulations!

Once you complete these steps, your blog will have:
- ✅ Professional custom domain
- ✅ Free SSL certificate
- ✅ Better SEO ranking
- ✅ Professional email (optional)
- ✅ Analytics and monitoring
- ✅ Enhanced security
- ✅ Optimized performance

Your blog will look more professional and be easier for users to remember and share!
