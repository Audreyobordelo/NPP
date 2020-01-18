const express = require('express');
const router = express.Router();

const Media = require('../../models/media.js');

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const uploadCloud = require('../../config/cloudinary.js');

const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

/////////////////////////////////
// SIGNUP
///////////

// on affiche la page 
router.get('/signup',(req, res) => {
  res.render('authentification/signup');
});

// une fois que l'utilisateur a envoyé le form 
router.post("/signup", uploadCloud.single('profile-pic'), (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const profilePic = req.file && req.file.url;
  // req.file ? req.file.url : null 

  // on vérifie que les champs obligatoires ne sont pas vides 
  if (name === "" || password === "" || email === "") {
    res.render("authentification/signup", { message: "Hold on there! You need to enter a media name, an email address and a password to register" });
    return;
  }

  Media.findOne({ email })
    .then(media => {
      // on vérifie si l'adresse n'est pas déjà enregistrée
      if (media !== null) {
        res.render("authentification/signup", { "message": "Oh-oh! This email address is already registered." });
        return;
      }

      // c'est ok, on encrypte le mdp
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      // on enregistre le média dans notre base de données
      const newMedia = new Media({
        name,
        email,
        password: hashPass,
        profilePic
      });

      newMedia.save()
        .then(user => {
          // on crée la session de l'utilisateur pour le connecter right away
          req.login(user, err => {
            if (err) {
              return next(err)
            };
            res.redirect('/article/all');
          });
        })
        .catch(err => {
          next(err)
        });
    })
    .catch(err => {
      next(err)
    });
});

/////////////////////////////////
// LOGIN
///////////

// on affiche la page
router.get("/login", (req, res, next) => {
  res.render("authentification/login", { "message": req.flash("error") });
});

// on se login avec passport
router.post("/login", passport.authenticate("local", {
  successRedirect: "/article/all",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("all", { media: req.media });
});

// pour le logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
