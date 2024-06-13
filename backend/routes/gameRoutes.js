const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();
const User = require('../models/User');

// Fonction pour obtenir un mot en fonction de la difficulté
const getWordByDifficulty = async (difficulty) => {
  let minLength, maxLength;
  if (difficulty === 'easy') { // Facile
    minLength = 4;
    maxLength = 5;
  } else if (difficulty === 'medium') { // Moyen
    minLength = 6;
    maxLength = 7;
  } else if (difficulty === 'hard') { // Difficile
    minLength = 8;
    maxLength = 9;
  }

  try {
    const response = await axios.get('https://trouve-mot.fr/api/random');
    const word = response.data[0].name;

    if (word.length >= minLength && word.length <= maxLength) {
      return word;
    } else {
      return await getWordByDifficulty(difficulty); // Réessayer si le mot ne correspond pas aux critères
    }
  } catch (error) {
    throw new Error('Erreur lors de la récupération du mot');
  }
};

// Route pour démarrer une nouvelle partie
router.post('/new', auth, async (req, res) => {
  const { difficulty } = req.body;
  try {
    const word = await getWordByDifficulty(difficulty);
    res.json({ word });
  } catch (error) {
    console.error('Erreur lors de la récupération du mot:', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération du mot' });
  }
});

// Route pour sauvegarder les scores
router.post('/save-score', auth, async (req, res) => {
  const { score } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.score = user.score ? user.score + score : score;
      await user.save();
      res.json({ message: 'Score sauvegardé' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score:', error.message);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde du score' });
  }
});

// Route pour récupérer les scores des utilisateurs
router.get('/scores', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'username score').sort({ score: -1 }).limit(10);
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des scores' });
  }
});

module.exports = router;
