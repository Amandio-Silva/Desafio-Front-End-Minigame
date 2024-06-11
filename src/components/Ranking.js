import React from 'react';

const Ranking = ({ ranking }) => {
  return (
    <div className="ranking">
      <h2>Ranking</h2>
      <ul>
        {ranking.map((entry, index) => (
          <li key={index}>
            {entry.nick}: {entry.score} segundos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;
