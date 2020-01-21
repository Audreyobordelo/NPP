require('./media.js');

const mongoose = require('mongoose');
const {Schema}   = mongoose;

const ArticleSchema = new Schema({
  mediaId: {type: Schema.Types.ObjectId, ref: 'Media'},
  title: String,
  picFeatured: String,
  picCaption: String,
  author: String,
  article: String,
  tags: Array
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;