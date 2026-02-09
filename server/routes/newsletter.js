const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Mock newsletter storage (in production, use a database)
let subscribers = [];

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if already subscribed
    if (subscribers.includes(email)) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Add subscriber
    subscribers.push(email);

    // Send welcome email (mock implementation)
    await sendWelcomeEmail(email);

    res.json({ 
      message: 'Successfully subscribed to newsletter',
      email: email
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Remove subscriber
    subscribers = subscribers.filter(sub => sub !== email);

    res.json({ 
      message: 'Successfully unsubscribed from newsletter',
      email: email
    });
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subscriber count (for admin)
router.get('/stats', async (req, res) => {
  try {
    res.json({
      totalSubscribers: subscribers.length,
      subscribers: subscribers // In production, don't expose emails
    });
  } catch (error) {
    console.error('Newsletter stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send newsletter campaign
router.post('/send-campaign', async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }

    // Send to all subscribers
    await sendCampaignEmails(subscribers, subject, content);

    res.json({ 
      message: 'Campaign sent successfully',
      sentTo: subscribers.length
    });
  } catch (error) {
    console.error('Newsletter campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to send welcome email
async function sendWelcomeEmail(email) {
  // Mock email sending - in production, use real email service
  console.log(`Welcome email sent to: ${email}`);
  
  // Example with nodemailer (configure with real SMTP)
  /*
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: 'noreply@yourblog.com',
    to: email,
    subject: 'Welcome to Our Newsletter!',
    html: `
      <h1>Welcome to Our Newsletter!</h1>
      <p>Thank you for subscribing to our newsletter. You'll receive the latest updates and exclusive content.</p>
      <p>Best regards,<br>The Team</p>
    `
  });
  */
}

// Helper function to send campaign emails
async function sendCampaignEmails(emails, subject, content) {
  console.log(`Sending campaign: "${subject}" to ${emails.length} subscribers`);
  
  // In production, implement bulk email sending with rate limiting
  for (const email of emails) {
    await sendCampaignEmail(email, subject, content);
  }
}

// Helper function to send individual campaign email
async function sendCampaignEmail(email, subject, content) {
  console.log(`Campaign email sent to: ${email}`);
  
  // Example implementation:
  /*
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: 'noreply@yourblog.com',
    to: email,
    subject: subject,
    html: content
  });
  */
}

module.exports = router;
