const express = require('express');
const router = express.Router();

const Article = require('../models/article.js');

const uploadCloud = require('../config/cloudinary.js')


//New article

router.get('/new', function (req, res, next) {
    if (!req.media) {
      res.redirect('/login');
      return;
    }
  
    res.render('articles/new');
  });
  
  router.post('/', uploadCloud.single('pic'), function (req, res, next) {
    if (!req.media) {
      return next(new Error('You must be logged to create an article'));
    }
  
    Article.create({
      title: req.body.title,
      picFeatured: req.body.picFeatured,
      picCaption: req.picCaption,
      author: req.body.author,
      article : req.body.article,
      tags : req.body.tags,
    })
      .then(article => {

        console.log('article', article);
          //Media.findByIdAndUpdate(mediaId, { articles :  }, options, callback)


          res.redirect('/')
        })
      .catch(next)
    ;
  });
  




module.exports = router;

/*
Product.find({
  ‘brand’ : { $in : [
    mongoose.Types.ObjectId(req.params.id)
  ]
  }