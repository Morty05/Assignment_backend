const mongoose = require('mongoose');
const CarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [String],
  images: [String],  // up to 10 images stored as an array of URLs or file paths
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to the User model
  },
});
module.exports = mongoose.model('Car', CarSchema);
