const express = require('express');
const profileRouter = express.Router();

const Media = require('../../models/media.js');

const uploadCloud = require('../../config/cloudinary.js');

// // on affiche le profil
// profileRouter.get('/profile',(req, res) => {
//   res.render('media/profile');
// });

// on récupère les infos
profileRouter.get('/profile', (req, res) => {
  if (!req.user) {
    res.redirect('/');
    return;
  };

  Media.findOne({_id: req.user.id})
  .then((media) => {
    res.render('media/profile', { media: req.user });
  })
  .catch ((err) => {
    console.log(err);
  });
});

// quand l'utilisateur valide ses modif
profileRouter.post("/profile", uploadCloud.single('profile-pic'), (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const profilePic = req.file && req.file.url;
  // req.file ? req.file.url : null 

  // on vérifie que les champs obligatoires ne sont pas vides 
  if (name === "" || password === "" || email === "") {
    res.render("media/profile", { message: "Hold on there! You need to enter a media name, an email address and a password to register" });
    return;
  }

  Media.findOne({ email })
    .then(media => {
      // on vérifie si l'adresse n'est pas déjà enregistrée
      if (media !== null) {
        res.render("media/profile", { "message": "Oh-oh! This email address is already registered." });
        return;
      }

      if (media.password !== req.body.password) {
      // si mdp est modifié, on encrypte le nouveau mdp
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      }

      // si pas de file, on change pas photo de profil

      // update


    })
    .catch(err => {
      next(err)
    });
});

// il faut exporter pour que ça marche :p
module.exports = profileRouter;