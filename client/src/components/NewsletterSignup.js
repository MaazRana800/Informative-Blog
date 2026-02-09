import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import API_URL from '../config/api';

const NewsletterSignup = ({ 
  title = "Get the Latest Updates",
  description = "Join our newsletter for exclusive content and tips.",
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        setError(data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`newsletter-signup bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <CheckCircle className="mx-auto text-green-600 mb-3" size={48} />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Successfully Subscribed!</h3>
        <p className="text-green-600">Check your email for confirmation.</p>
      </div>
    );
  }

  return (
    <div className={`newsletter-signup bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white ${className}`}>
      <div className="text-center">
        <Mail className="mx-auto mb-3" size={32} />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100 mb-4">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <>
                <Send size={16} />
                Subscribe
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="text-red-200 text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="text-xs text-blue-100 text-center">
          Join 10,000+ subscribers. No spam, unsubscribe anytime.
        </div>
      </form>
    </div>
  );
};

export default NewsletterSignup;
