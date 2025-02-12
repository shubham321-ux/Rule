import React from 'react';
import './css/Loading.css';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="loading-text"></div>
      </div>
    </div>
  );
};

export default Loading;
