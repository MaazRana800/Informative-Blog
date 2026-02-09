const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // For development, use ethereal.email (test email service)
    if (process.env.NODE_ENV === 'development') {
      nodemailer.createTestAccount((err, account) => {
        if (err) {
          console.error('Failed to create test email account:', err);
          return;
        }

        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });

        this.isConfigured = true;
        console.log('Email service configured with Ethereal test account');
      });
    } else {
      // For production, configure with real SMTP service
      if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        this.transporter = nodemailer.createTransporter({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT || 587,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        this.isConfigured = true;
        console.log('Email service configured with production SMTP');
      } else {
        console.log('Email service not configured - using mock emails');
      }
    }
  }

  async sendEmail(options) {
    if (!this.isConfigured) {
      console.log('Mock email sent:', options);
      return { messageId: 'mock-' + Date.now() };
    }

    try {
      const info = await this.transporter.sendMail({
        from: options.from || '"Informative Blog" <noreply@informativeblog.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      });

      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail, username) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Informative Blog</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Informative Blog! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${username},</p>
            <p>Thank you for joining our community of knowledge sharers! We're excited to have you on board.</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>Create and publish blog posts</li>
              <li>Engage with other community members</li>
              <li>Share your knowledge and expertise</li>
              <li>Discover interesting content</li>
            </ul>
            <a href="https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app" class="button">Get Started</a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy blogging!</p>
            <p>The Informative Blog Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}. If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to Informative Blog! 🎉',
      html,
      text: `Welcome to Informative Blog, ${username}! Thank you for joining our community. Visit https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app to get started.`
    });
  }

  async sendNewPostEmail(userEmail, username, postTitle, postUrl) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Post Published</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Post Published! 📝</h1>
          </div>
          <div class="content">
            <p>Hi ${username},</p>
            <p>A new post has been published that might interest you:</p>
            <h3>${postTitle}</h3>
            <a href="${postUrl}" class="button">Read Post</a>
            <p>Stay updated with the latest content from our community.</p>
            <p>Happy reading!</p>
            <p>The Informative Blog Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}. <a href="https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `New Post: ${postTitle}`,
      html,
      text: `Hi ${username}, a new post "${postTitle}" has been published. Read it here: ${postUrl}`
    });
  }

  async sendCommentNotificationEmail(userEmail, username, commenterName, postTitle, commentContent, postUrl) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Comment on Your Post</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .comment { background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Comment! 💬</h1>
          </div>
          <div class="content">
            <p>Hi ${username},</p>
            <p>${commenterName} commented on your post "${postTitle}":</p>
            <div class="comment">
              <p>${commentContent}</p>
            </div>
            <a href="${postUrl}" class="button">View Comment</a>
            <p>Engage with your readers and keep the conversation going!</p>
            <p>The Informative Blog Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}. <a href="https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `New comment on "${postTitle}"`,
      html,
      text: `Hi ${username}, ${commenterName} commented on your post "${postTitle}": "${commentContent}". View it here: ${postUrl}`
    });
  }

  async sendPasswordResetEmail(userEmail, username, resetToken) {
    const resetUrl = `https://informative-vlog-n7lhvubg7-maazrana800s-projects.vercel.app/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset 🔐</h1>
          </div>
          <div class="content">
            <p>Hi ${username},</p>
            <p>You requested a password reset for your Informative Blog account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>The Informative Blog Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}. If you didn't request this reset, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Password Reset Request',
      html,
      text: `Hi ${username}, reset your password here: ${resetUrl}. This link expires in 1 hour.`
    });
  }
}

module.exports = new EmailService();
