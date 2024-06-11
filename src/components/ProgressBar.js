import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
