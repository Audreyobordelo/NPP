const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const mediaSchema = new Schema({
  name: String,
  email:    String,
  password: String,
  profilePic: String,
  articles: [{type: Schema.Types.ObjectId, ref: 'Article'}]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
