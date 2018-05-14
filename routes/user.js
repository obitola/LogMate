const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  google_id: {
    type: String,
    trim: true,
    unique: true,
    require: true
  },

  name: {
    type: String,
    trim: true,
    require: true
  },

  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;