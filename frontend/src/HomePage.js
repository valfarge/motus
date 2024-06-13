import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import motusImage from './assets/motus.jpg';

function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data && res.data.token && res.data.user) {
        console.log('Login successful', res.data);
        localStorage.setItem('token', res.data.token);
        navigate('/game', { state: { user: res.data.user } });
      } else {
        console.error('Login response is missing expected data', res);
        setMessage('Erreur de connexion. Veuillez vérifier vos informations.');
      }
    } catch (err) {
      console.error('Login failed', err.response ? err.response.data : err.message);
      setMessage('Erreur de connexion. Veuillez vérifier vos informations.');
    }
  };

  return (
    <div className="container">
      <div className="inner-container">
        <div className="left">
          <img src={motusImage} alt="Motus" className="rounded-image" />
        </div>
        <div className="right">
          {message && <p className="error-message">{message}</p>}
          <h2>Se connecter</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit">Se connecter</button>
          </form>
          <button onClick={() => navigate('/register')}>Pas de compte ? S'inscrire</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
