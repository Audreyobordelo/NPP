const express = require('express');
const router = express.Router();
const Article = require('../../models/article.js');
const Media = require('../../models/media.js');
const uploadCloud = require('../../config/cloudinary.js');


//New article

router.get('/new', (req, res, next) => {
 console.log(' TEST')
  
  res.render('article/new');
});

/*
router.post('/new', uploadCloud.single('pic'), function (req, res, next) {
  if (!req.user) {
    return next(new Error('You must be logged to create an article'));
  }

  Article.create({
    title: req.body.title,
    picFeatured: req.body.picFeatured,
    picCaption: req.body.picCaption,
    author: req.body.author,
    article : req.body.article,
    tags : req.body.tags,
  })
    .then(article => {

      
      
        //Media.find({
        //‘’ : { $in : [
        //mongoose.Types.ObjectId(req.params.id)
        //]
        //}
      


        res.redirect('/all');
      })
    .catch(next)
  ;
});

*/


router.post("/create-article", uploadCloud.single('profile-pic'), (req, res, next) => {
  const title = req.body.title;
  const picFeatured= req.body.picFeatured;
  const picCaption= req.body.picCaption;
  const author= req.body.author;
  const article = req.body.article;
  const tags = req.body.tags;
  const articles = new Article({
    title,
    picFeatured,
    picCaption,
    author,
    article,
    tags,
  });
    articles

    // enregistrement sur la bdd de l'article
     .save()
      
     .then(artic => {
      console.log(artic);

    
        Media.findByIdAndUpdate(req.user._id, { $push: { articles : artic._id }})
        .then(
          res.redirect("all")
        )
        
        .catch((err) => {
          next(err);
        })
  
      
     })


     .catch(next)
});

//Media.findByIdAndUpdate(mediaId, { articles :  }, options, callback)

//Media.findByIdAndUpdate({ articles : req.user._id }, { $push: { articles : })
//      console.log('article', article);
      

//router.post('/reviews/add', (req, res, next) => {
//  const { user, comments } = req.body;
//  Book.update({ _id: req.query.book_id }, { $push: { reviews: { user, comments }}})
//  .then(book => {
//      res.redirect('/books');
//    })
//    .catch((err) => {
//      next(err);
//    })
//  ;



module.exports = router;