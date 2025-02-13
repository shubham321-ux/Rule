import React from 'react';
import './css/Loading.css';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="loading-ball"></div>
        <div className="loading-ball"></div>
        <div className="loading-ball"></div>
      </div>
    </div>
  );
};

export default Loading;
