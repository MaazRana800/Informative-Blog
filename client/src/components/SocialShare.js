import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2, 
  MessageCircle,
  Send,
  Check
} from 'lucide-react';

const SocialShare = ({ 
  url, 
  title, 
  description, 
  image,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleEmailShare = () => {
    const subject = `Check out this article: ${title}`;
    const body = `I thought you might find this interesting:\n\n${title}\n${description}\n\nRead more here: ${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  return (
    <div className={`social-share ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Native Share (mobile) */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 size={16} />
            <span className="text-sm">Share</span>
          </button>
        )}

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          title="Share on Facebook"
        >
          <Facebook size={16} />
          <span className="text-sm hidden sm:inline">Facebook</span>
        </a>

        {/* Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          title="Share on Twitter"
        >
          <Twitter size={16} />
          <span className="text-sm hidden sm:inline">Twitter</span>
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin size={16} />
          <span className="text-sm hidden sm:inline">LinkedIn</span>
        </a>

        {/* Reddit */}
        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          title="Share on Reddit"
        >
          <MessageCircle size={16} />
          <span className="text-sm hidden sm:inline">Reddit</span>
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          title="Share on WhatsApp"
        >
          <Send size={16} />
          <span className="text-sm hidden sm:inline">WhatsApp</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          title="Copy link"
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
          <span className="text-sm hidden sm:inline">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
        </button>

        {/* Email */}
        <button
          onClick={handleEmailShare}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          title="Share via email"
        >
          <Send size={16} />
          <span className="text-sm hidden sm:inline">Email</span>
        </button>
      </div>

      {/* Share Stats (optional) */}
      <div className="mt-3 text-sm text-gray-500">
        <span>Share this article with your network</span>
      </div>
    </div>
  );
};

export default SocialShare;
