import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import Header from './components/Header';
import WordContainer from './components/WordContainer';
import ScoreBoard from './components/ScoreBoard';
import './GamePage.css';

// Fonction pour supprimer les accents d'une chaîne de caractères
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function GamePage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [word, setWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState('');
  const [newAttemptClass, setNewAttemptClass] = useState('');
  const [isWordFound, setIsWordFound] = useState(false);
  const [score, setScore] = useState(100); // Score initial
  const [difficulty, setDifficulty] = useState('medium'); // Difficulté par défaut
  const scoreBoardRef = useRef(null); // Référence pour le ScoreBoard
  const navigate = useNavigate();
  const location = useLocation();

  // Vérification de l'authentification de l'utilisateur au chargement de la page
  useEffect(() => {
    const userFromState = location.state?.user;
    if (userFromState) {
      setUser(userFromState);
    } else {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/', { state: { message: 'Veuillez vous enregistrer ou vous connecter pour accéder à la page de jeu.' } });
          return;
        }
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { 'x-auth-token': token }
          });
          if (res.data && res.data.username && res.data._id) {
            setUser(res.data);
          } else {
            throw new Error('Les données utilisateur sont incomplètes');
          }
        } catch (err) {
          console.error(err);
          navigate('/', { state: { message: 'Veuillez vous enregistrer ou vous connecter pour accéder à la page de jeu.' } });
        }
      };
      checkAuth();
    }
  }, [navigate, location.state]);

  // Démarrer une nouvelle partie
  const startNewGame = async () => {
    setLoading(true);
    setMessage('');
    setIsWordFound(false); // Réinitialiser le statut de mot trouvé
    setScore(100); // Réinitialiser le score pour une nouvelle partie
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/game/new', { difficulty }, {
        headers: { 'x-auth-token': token }
      });
      if (res.data && res.data.word) {
        setWord(removeAccents(res.data.word.toUpperCase()));
        setCurrentGuess(new Array(res.data.word.length).fill(''));
        setAttempts([]);
        setNewAttemptClass(''); // Réinitialiser la classe au début d'une nouvelle partie
      } else {
        throw new Error('Réponse invalide du serveur');
      }
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du démarrage de la partie:', err.message);
      setMessage(`Erreur lors du démarrage de la partie: ${err.message}`);
      setLoading(false);
    }
  };

  // Gestion des changements d'entrée
  const handleInputChange = (index, value) => {
    if (/^[a-zA-Z]$/.test(value) || value === '') {
      setCurrentGuess(prevGuess => {
        const newGuess = [...prevGuess];
        if (index !== 0) { // Empêcher la modification de la première lettre
          newGuess[index] = value.toUpperCase();
        }
        return newGuess;
      });
    }
  };

  // Soumettre une proposition de mot
  const handleGuessSubmit = async () => {
    if (isWordFound) return; // Ne rien faire si le mot est déjà trouvé

    const guessWord = word[0] + currentGuess.slice(1).join(''); // Assurer que la première lettre est toujours incluse

    if (guessWord.length !== word.length) {
      setMessage('Le mot doit comporter le même nombre de lettres.');
      return;
    }

    const newFeedback = guessWord.split('').map((letter, index) => {
      if (letter === word[index]) {
        return { letter, color: 'red' };
      } else if (word.includes(letter)) {
        return { letter, color: 'yellow' };
      } else {
        return { letter, color: 'blue' };
      }
    });

    setAttempts(prevAttempts => [...prevAttempts, newFeedback]);

    if (guessWord === word) {
      setMessage('Félicitations ! Vous avez trouvé le mot.');
      setIsWordFound(true); // Marquer le mot comme trouvé
      // Sauvegarder le score
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/game/save-score', { score }, {
          headers: { 'x-auth-token': token }
        });
        if (scoreBoardRef.current) {
          scoreBoardRef.current.fetchScores(); // Mettre à jour le tableau des scores
        }
      } catch (err) {
        console.error('Erreur lors de la sauvegarde du score:', err.message);
      }
    } else {
      const newGuess = newFeedback.map(fb => fb.color === 'red' ? fb.letter : '');
      setCurrentGuess(newGuess);
      setNewAttemptClass('new-attempt');
      // Diminuer le score pour chaque tentative incorrecte
      setScore(prevScore => Math.max(0, prevScore - 10));
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Changement de niveau de difficulté
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container">
      {isWordFound && <Confetti />}
      <Header user={user} onLogout={handleLogout} onStartNewGame={startNewGame} onDifficultyChange={handleDifficultyChange} difficulty={difficulty} />
      <div className="inner-container">
        <div className="center">
          {message && <p className="error-message">{message}</p>}
          {word && (
            <>
              <WordContainer
                word={word}
                currentGuess={currentGuess}
                attempts={attempts}
                newAttemptClass={newAttemptClass}
                handleInputChange={handleInputChange}
                handleGuessSubmit={handleGuessSubmit}
              />
            </>
          )}
          {!isWordFound && (
            <button onClick={handleGuessSubmit} className="guess-button">Valider le mot</button>
          )}
        </div>
      </div>
      <ScoreBoard ref={scoreBoardRef} /> {/* Ajout du tableau de classement */}
    </div>
  );
}

export default GamePage;
