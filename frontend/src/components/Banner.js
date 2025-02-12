import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Banner.css";
import disscount from "../assest/discount.svg";

const Banner = ({ banners }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      }
      touchStartX.current = touchEndX;
    }
  };

  const handleImageClick = (productId) => {
    navigate(`/products`);
  };

  return (
    <div
      className="banner-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      ref={scrollRef}
    >
      <div
        className="banner-scroll"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="banner-image"
            onClick={() => handleImageClick(banner.productId)}
          >
            <img src={banner.imageUrl} alt={`Banner ${index + 1}`} />
            <div className="discount-overlay">
              <div className="discount-box">
                <div className="discount-image">
                  <img src={disscount} alt="Discount" />
                </div>
                <span className="discount-percentage">
                  {banner.discount}% OFF
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="banner-dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
