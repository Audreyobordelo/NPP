const express = require('express');
const router = express.Router();
const Article = require('../../models/article.js');
const Media = require('../../models/media.js');
const uploadCloud = require('../../config/cloudinary.js');

// on affiche la page 
router.get('/all',(req, res) => {
  // si pas de compte, on redirige
  if (!req.user) {
    res.redirect('/');
    return;
  }
  // sinon on affiche la page
  res.render('article/all', { media: req.user });
});

//All : afficher tous les articles d'un media
router.get('/id/:id', function (req, res, next) {
    const id = req.params.id;
    Article.findById(id)
      .populate('article.mediaId')
      .then((article) => {
         console.log('article', article);
        res.render('article/all', {
           title : Article.title,
         author: Article.author,
        });
      })
       .catch(next);
     ;
  });

module.exports = router;
