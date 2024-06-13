import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import './ScoreBoard.css';

const ScoreBoard = forwardRef((props, ref) => {
  const [scores, setScores] = useState([]);

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/game/scores', {
        headers: { 'x-auth-token': token }
      });
      setScores(res.data);
    } catch (err) {
      console.error('Error fetching scores:', err);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchScores,
  }));

  return (
    <div className="scoreboard">
      <h2>Classement</h2>
      <table>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.username}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ScoreBoard;
