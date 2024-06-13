const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');

const router = express.Router();

// Route de registre
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Utilisateur déjà enregistré avec cet email' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Nom d\'utilisateur déjà pris' });
    }

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, username: user.username } };
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '4h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { username: user.username, _id: user._id } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
});

// Route de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    const payload = { user: { id: user.id, username: user.username } };
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { username: user.username, _id: user._id } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
});

module.exports = router;
