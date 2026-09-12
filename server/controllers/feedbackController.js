const Feedback = require('../models/Feedback');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// @desc    Add new feedback to a portfolio or a specific work
// @route   POST /api/feedback/add
// @access  Private (Teacher/Peer - authenticated user)
const addFeedback = async (req, res) => {
  const { portfolioId, workId, message } = req.body;

  if (!portfolioId || !message) {
    return res.status(400).json({ message: 'Portfolio ID and message are required' });
  }

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  // Ensure the author is not the student owning the portfolio (self-feedback not allowed via this route)
  if (portfolio.userId.toString() === req.user.id) {
    return res.status(403).json({ message: 'Students cannot leave feedback on their own portfolio' });
  }

  const feedback = await Feedback.create({
    portfolioId,
    workId: workId || null,
    authorId: req.user.id,
    authorRole: req.user.role,
    message,
  });

  if (feedback) {
    res.status(201).json(feedback);
  } else {
    res.status(400).json({ message: 'Invalid feedback data' });
  }
};

// @desc    Get all feedback for a portfolio
// @route   GET /api/feedback/portfolio/:portfolioId
// @access  Private (Student, Teacher, Admin)
const getFeedbackForPortfolio = async (req, res) => {
  const { portfolioId } = req.params;

  const portfolio = await Portfolio.findById(portfolioId);

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  // Authorization check: Only the owner of the portfolio (student), or a teacher/admin can view
  if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view this portfolio' });
  }

  const feedback = await Feedback.find({ portfolioId })
    .populate('authorId', 'name avatar role')
    .sort({ createdAt: -1 });
  res.status(200).json(feedback);
};

// @desc    Delete feedback (author or admin only)
// @route   DELETE /api/feedback/delete/:id
// @access  Private (Author or Admin only)
const deleteFeedback = async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findById(id);

  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  // Check if current user is the author or an admin
  if (feedback.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this feedback' });
  }

  await feedback.deleteOne();
  res.status(200).json({ message: 'Feedback removed' });
};

module.exports = { addFeedback, getFeedbackForPortfolio, deleteFeedback };