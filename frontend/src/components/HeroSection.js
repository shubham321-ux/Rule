import React from 'react';
import './css/HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <p className="subtitle">Welcome to Our Collection</p>
        <h1 className="title">Discover Amazing Books</h1>
        <p className="description">Explore our curated selection of books that will inspire and enlighten you.</p>
        <button className="cta-button">
          Explore Now
        </button>
      </div>
      <div className="floating-image">
        {/* <img src="/path-to-your-image.jpg" alt="Decorative" /> */}
      </div>
    </div>
  );
};

export default HeroSection;
