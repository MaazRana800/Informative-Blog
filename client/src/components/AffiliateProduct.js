import React from 'react';
import { ExternalLink, Star, DollarSign } from 'lucide-react';

const AffiliateProduct = ({ 
  product,
  className = ''
}) => {
  const {
    name,
    description,
    price,
    rating,
    image,
    affiliateUrl,
    features,
    discount,
    tag
  } = product;

  const handleAffiliateClick = () => {
    // Track affiliate click for analytics
    if (window.gtag) {
      window.gtag('event', 'affiliate_click', {
        product_name: name,
        product_price: price
      });
    }
  };

  return (
    <div className={`affiliate-product bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          {discount}% OFF
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        {tag && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
            {tag}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({rating})</span>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3">{description}</p>

        {/* Features */}
        {features && features.length > 0 && (
          <ul className="text-sm text-gray-600 mb-3 space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${price}
              </span>
              {discount && (
                <span className="text-sm text-gray-500 line-through">
                  ${Math.round(price * (1 + discount / 100))}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <DollarSign size={12} />
              Commission available
            </div>
          </div>
          
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAffiliateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <ExternalLink size={14} />
            View Deal
          </a>
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 italic">
          This is an affiliate link. We may earn a commission at no cost to you.
        </div>
      </div>
    </div>
  );
};

export default AffiliateProduct;
