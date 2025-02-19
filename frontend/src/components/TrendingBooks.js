import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/TrendingBooks.css';
import bookimage from "../assest/bookimage1.png"
import Title from './Title';

const TrendingBooks = () => {
  const navigate = useNavigate();

  const gradients = [
    'linear-gradient(180deg, #011035 0%, #021F68 50%, #011035 100%)',
    'linear-gradient(180deg, #350110 0%, #680221 50%, #350110 100%)',
    'linear-gradient(180deg, #103501 0%, #216802 50%, #103501 100%)'
  ];

  const trendingBooks = [
    {
      id: 1,
      image: bookimage,
      category: 'Fiction',
      name: 'The Great Adventure',
    },
    {
      id: 2,
      image: bookimage,
      category: 'Mystery',
      name: 'Silent Shadows',
    },
    {
      id: 3,
      image: bookimage,
      category: 'Romance',
      name: 'Eternal Love',
    }
  ];

  return (
    <div className="trending-container-main">
        <Title title="Trending Books" buttonText="See All" />
      <div className="trending-container">
        {trendingBooks.map((book, index) => (
          <div 
            key={book.id} 
            className="book-card"
            style={{ background: gradients[index] }}
          >
            <div className="book-image">
              <img src={book.image} alt={book.name} />
            </div>
            <div className="book-details">
              <div className="book-info">
                <span className="book-category">{book.category}</span>
                <h3 className="book-name">{book.name}</h3>
              </div>
              <button
                className="shop-now-btn"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingBooks;
