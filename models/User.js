const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  googleId: String
});

mongoose.model('users', UserSchema); // Model class that represents the underlying mongodb collection
