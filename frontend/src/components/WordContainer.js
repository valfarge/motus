import React, { useEffect, useRef, useState } from 'react';

const WordContainer = ({ word, currentGuess, attempts, newAttemptClass, handleInputChange, handleGuessSubmit }) => {
  const inputsRef = useRef([]);
  const [backspaceCount, setBackspaceCount] = useState(0);

  // Mettre le focus sur la deuxième case (index 1) au chargement
  useEffect(() => {
    if (inputsRef.current[1]) {
      inputsRef.current[1].focus();
    }
  }, []);

  // Gérer les événements de touche
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      setBackspaceCount(prevCount => prevCount + 1);
      if (currentGuess[index] === '' && index > 1 && backspaceCount >= 1) {
        inputsRef.current[index - 1].focus();
        handleInputChange(index - 1, '');
        setBackspaceCount(0);
      } else {
        handleInputChange(index, '');
      }
    } else if (e.key === 'Enter') {
      handleGuessSubmit();
    }
  };

  // Gérer les changements d'entrée
  const handleInput = (e, index) => {
    if (/^[a-zA-Z]$/.test(e.target.value)) {
      setBackspaceCount(0); // Réinitialiser le compteur de backspace sur toute autre touche
      handleInputChange(index, e.target.value.toUpperCase());
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  return (
    <div className="word-container">
      {attempts.map((attempt, attemptIndex) => (
        <div key={attemptIndex} className={`attempt-row ${newAttemptClass}`}>
          {attempt.map((letter, index) => (
            <span
              key={index}
              className={`letter-box ${letter.color}`}
              style={{ backgroundColor: letter.color === 'red' ? 'red' : letter.color === 'yellow' ? 'yellow' : 'blue' }}
            >
              {letter.letter}
            </span>
          ))}
        </div>
      ))}
      <div className="attempt-row">
        {word.split('').map((letter, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="letter-box"
            value={index === 0 ? letter : currentGuess[index]}
            onChange={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => inputsRef.current[index] = el}
            style={{
              backgroundColor: index === 0 ? 'red' : 'blue',
              color: 'white',
            }}
            readOnly={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default WordContainer;
