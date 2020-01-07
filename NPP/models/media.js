const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const MediaSchema = Schema({
  name: String,
  email:    String,
  password: String,
  profilePic: String
});

const Media = mongoose.model('Media', MediaSchema);
