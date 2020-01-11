const express = require('express');
const router = express.Router();

const Media = require('../../models/media.js');

const uploadCloud = require('../../config/cloudinary.js');

// on affiche le profil
router.get('/profile',(req, res) => {
  res.render('media/profile');
});

