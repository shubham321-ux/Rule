import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; 
import './css/Lazyimage.css'; 

const LazyImage = ({ src, alt, className, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoaded = () => {
    setIsLoading(false); // Hide the loading animation when the image is fully loaded
  };

  return (
    <div className={`lazy-image-container ${className}`} {...rest}>
      {isLoading && (
        <div className="loading-placeholder">
          <div className="animated-wave"></div>
        </div>
      )}
      <LazyLoadImage
        alt={alt}
        src={src}
        effect="blur" 
        afterLoad={handleImageLoaded} // Callback when the image has loaded
        className="lazy-loaded-image"
      />
    </div>
  );
};

export default LazyImage;
