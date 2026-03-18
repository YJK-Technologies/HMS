import React from 'react';
import './Loading.css';

const MyComponent = () => {
  return (
        <div className="loader-container">
        <div className="heart-rate">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="150px"
        height="73px"
        viewBox="0 0 150 73"
      >
        <polyline
          className="heartbeat-line"
          fill="none"
          stroke="#00ff99"
          strokeWidth="3"
          strokeMiterlimit="10"
          points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 
                  57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 
                  84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
        />
      </svg>
      <div className="fade-in"></div>
      <div className="fade-out"></div>
    </div>
    <p className="loading-text">Loading...</p>
    </div>
  
  );
};

export default MyComponent;
