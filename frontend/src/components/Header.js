import React from 'react';

const Header = ({ user, onLogout, onStartNewGame, onDifficultyChange, difficulty }) => {
  return (
    <div className="header">
      <div className="user-info">
        <span>Utilisateur: {user?.username} (ID: {user?._id})</span>
        <button onClick={onLogout}>Déconnexion</button>
        <button onClick={onStartNewGame} className="start-button">Démarrer la partie</button>
        <label htmlFor="difficulty" className="difficulty-label">Niveau de difficulté :</label>
        <select id="difficulty" value={difficulty} onChange={onDifficultyChange} className="difficulty-select">
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </div>
    </div>
  );
};

export default Header;
