const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['academic', 'skill', 'extracurricular', 'project'],
    required: true,
  },
  fileUrl: String,
  fileType: String, // e.g., 'image/jpeg', 'application/pdf', 'video/mp4', 'text/plain'
  thumbnailUrl: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Work', WorkSchema);