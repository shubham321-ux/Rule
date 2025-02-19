import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Title.css';

const Title = ({ title, buttonText = "See All" }) => {
  const navigate = useNavigate();

  return (
    <div className="title-container">
      <h2 className="title-text">{title}</h2>
      <button 
        className="see-all-button"
        onClick={() => navigate('/products')}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Title;
