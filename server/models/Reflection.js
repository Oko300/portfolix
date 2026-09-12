const mongoose = require('mongoose');

const ReflectionSchema = new mongoose.Schema({
  workId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Work',
    required: true,
    unique: true, // One reflection per work
  },
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  },
  whatILearned: {
    type: String,
    required: true,
  },
  whatIdDoDifferently: String,
  skillsDemonstrated: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reflection', ReflectionSchema);