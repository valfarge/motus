import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/game', { state: { user: res.data.user } });
    } catch (err) {
      console.error(err.response.data);
      setMessage('Erreur lors de la création du compte. Veuillez réessayer.');
    }
  };

  return (
    <div className="container">
      <div className="inner-container">
        <div className="center">
          {message && <p className="error-message">{message}</p>}
          <h2>Créer un compte</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">S'inscrire</button>
          </form>
          <button onClick={() => navigate('/')}>Déjà un compte ? Se connecter</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
