import React from 'react';

const SequenceDisplay = ({ sequence, currentIndex }) => {
  return (
    <div>
      {sequence.split('').map((char, index) => (
        <span key={index} style={{ color: index === currentIndex ? 'red' : 'black' }}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default SequenceDisplay;
