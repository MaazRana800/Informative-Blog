import React, { useEffect } from 'react';

const AdUnit = ({ 
  slot, 
  format = 'auto', 
  responsive = 'true',
  className = '',
  style = {}
}) => {
  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5984996181039634';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad to Google
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  const defaultStyle = {
    display: 'block',
    textAlign: 'center',
    ...style
  };

  return (
    <div className={`ad-unit ${className}`} style={defaultStyle}>
      <ins
        className="adsbygoogle"
        style={defaultStyle}
        data-ad-client="ca-pub-5984996181039634"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive === 'true'}
      />
    </div>
  );
};

export default AdUnit;
