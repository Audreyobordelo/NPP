require('./media.js');

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ArticleSchema = Schema({
  title: String,
  picFeatured: String,
  picCaption: String,
  author: String,
  article: String,
  tags: Array
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;