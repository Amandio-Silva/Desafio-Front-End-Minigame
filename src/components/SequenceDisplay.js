import React from 'react';
import './SequenceDisplay.css';

const SequenceDisplay = ({ sequence, currentIndex }) => {
  return (
    <div className="sequence-container">
      {sequence.split('').map((char, index) => (
        <div
          key={index}
          className={`sequence-char ${index === currentIndex ? 'active' : ''}`}
        >
          {char}
        </div>
      ))}
    </div>
  );
};

export default SequenceDisplay;
