const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  issuer: String,
  issueDate: Date,
  description: String,
  imageUrl: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Badge', BadgeSchema);