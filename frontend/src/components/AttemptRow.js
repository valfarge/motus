import React from 'react';

const AttemptRow = ({ attempt, isNewAttempt, newAttemptClass }) => (
  <div className={`attempt-row ${isNewAttempt ? newAttemptClass : ''}`}>
    {attempt.map((fb, index) => (
      <div
        key={index}
        className="letter-box"
        style={{
          backgroundColor: fb.color,
          color: 'white',
        }}
      >
        {fb.letter}
      </div>
    ))}
  </div>
);

export default AttemptRow;
