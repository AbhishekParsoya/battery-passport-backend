const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileName: String,
  s3Key: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', documentSchema);
