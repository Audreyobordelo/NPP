const express = require('express');
const profileRouter = express.Router();

const Media = require('../../models/media.js');

const uploadCloud = require('../../config/cloudinary.js');

// on affiche le profil
profileRouter.get('/profile',(req, res) => {
  res.render('media/profile');
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

      // c'est ok, on encrypte le nouveau mdp
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      

    })
    .catch(err => {
      next(err)
    });
});

// il faut exporter pour que ça marche :p
module.exports = profileRouter;