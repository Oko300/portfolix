const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One portfolio per user
  },
  title: {
    type: String,
    required: true,
  },
  summary: String,
  isPublic: {
    type: Boolean,
    default: false,
  },
  publicSlug: {
    type: String,
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness for non-null
  },
  template: {
    type: String,
    enum: ['default', 'resume', 'college', 'creative'],
    default: 'default',
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);