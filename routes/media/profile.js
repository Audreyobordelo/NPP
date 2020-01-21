const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

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
  const profilePic = req.file ? req.file.url : req.user.profilePic;

  // if : req.file && req.file.url; 
  // if else : req.file ? req.file.url : null // opérateur ternair

  // on vérifie que les champs obligatoires ne sont pas vides 
  if (name === "" || password === "" || email === "") {
    res.render("media/profile", { message: "Hold on there! You need to enter a media name, an email address and a password to register" });
    return;
  }

  Media.findOne({ email })
    .then(media => {
      // on vérifie si l'adresse n'est pas déjà enregistrée
      if (media !== null && JSON.stringify(media._id) !== JSON.stringify(req.user._id)) {
        res.render("media/profile", { "message": "Oh-oh! This email address is already registered." });
        return;
      }

      // un même mdp est encrypté toujours pareil pour 1 même "secret"
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
    

      // update
      Media.update({_id: req.user.id}, {$set: {name,email,password,profilePic}})
      .then(updatedMedia => {console.log("yAY, on a updaté : ", updatedMedia);
      res.redirect('media/profile');
    })
      .catch(err => {
        next(err);
      })

    })
    .catch(err => {
      next(err)
    });
});

// il faut exporter pour que ça marche :p
module.exports = profileRouter;