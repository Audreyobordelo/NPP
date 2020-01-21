const express = require('express');
const router = express.Router();
const Article = require('../../models/article.js');
const Media = require('../../models/media.js');
const uploadCloud = require('../../config/cloudinary.js');
const moment = require('moment');

//All : afficher tous les articles d'un media
router.get('/all', function (req, res, next) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  const id = req.user._id;
  Media.findById(id)
      .populate('articles')
      .then((media) => {
        const articlesMod = media.articles.map(art => {
          art.updatedAt = moment(art.updated_at).format("DD/MM/YYYY at h:mm:ss a");
          art.createdAt = moment(art.created_at).format("DD/MM/YYYY at h:mm:ss a");
          return art;
        });
        console.log(articlesMod);
        
        res.render('article/all', {
          name: media.name,
          profilePic: media.profilePic,
          articles: articlesMod
        });
        
      })
      .catch(next);
  });

module.exports = router;
