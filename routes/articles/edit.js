const express = require('express');
const router = express.Router();
const Article = require('../../models/article.js');
const Media = require('../../models/media.js');
const uploadCloud = require('../../config/cloudinary.js');


router.get('/edit-article/:articleId', (req, res, next) => {
  const articleId = req.params.articleId;
   Article.findById(articleId)
    .then(articleFromDatabase => {
      console.log(articleFromDatabase)
      res.render('article/edit-article', { articleFromDatabase });
    })
   .catch(next);
})
//Edit un article

router.post('/edit-article/:articleId', uploadCloud.single('image'), function (req, res, next) {
    if (!req.user) return next(new Error('You must be logged to edit an article'));
  
    const id = req.params.articleId;
    
    Article.update({ _id: id }, req.body)
      .then(
        res.redirect("/article/all")
      )
      .catch(next)
    ;
  })




module.exports = router;
