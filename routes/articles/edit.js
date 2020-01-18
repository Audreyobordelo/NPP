const express = require('express');
const router = express.Router();
const Article = require('../../models/article.js');
const Media = require('../../models/media.js');
const uploadCloud = require('../../config/cloudinary.js');


router.get('/edit', (req, res, next) => {
  console.log(' TEST')
   
   res.render('article/edit');
 });
 


 


//Edit un article


router.post('edit-article/:article.id', uploadCloud.single('image'), function (req, res, next) {
    if (!req.user) return next(new Error('You must be logged to edit an article'));
  
    const id = req.params.id;
  
    Article.update({ _id: id }, { $push: { article: {
      title: req.body.title,
      picFeatured: req.body.picFeatured,
      picCaption: req.picCaption,
      author: req.body.author,
      article : req.body.article,
      tags : req.body.tags,
    }}})
      .then(book => {
        res.redirect(`/article/${id}`);
      })
      .catch(next)
    ;
  })




module.exports = router;