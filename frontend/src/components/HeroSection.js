import React from 'react';
import './css/HeroSection.css';
import books from "../assest/bookgroup.png"
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
    const navigate = useNavigate();
    const handleExploreNow = () => {
        navigate('/products');
    };
  return (<div className='main-hero'>
    <div className="hero-container">
      <div className="hero-content">
        <p className="subtitle">Welcome to Our Collection</p>
        <h1 className="title">Discover Amazing Books</h1>
        <p className="description-hero">Explore our curated selection of books that will inspire and enlighten you.</p>
        <button className="cta-button"
        onClick={handleExploreNow}
        >
          Explore Now
        </button>
      </div>
      <div className="floating-image">
        <img src={books} alt="Decorative" />
      </div>
    </div>
    </div>
  );
};

export default HeroSection;
