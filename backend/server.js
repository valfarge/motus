const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const dotenv = require('dotenv');
const userRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

dotenv.config();

const app = express();

// Middleware pour analyser les corps de requêtes JSON
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
const mongoURI = config.get('mongoURI');
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
