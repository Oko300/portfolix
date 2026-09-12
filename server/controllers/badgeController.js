const Badge = require('../models/Badge');
const Portfolio = require('../models/Portfolio');

// @desc    Add a new badge
// @route   POST /api/badge/add
// @access  Private (Student only)
const addBadge = async (req, res) => {
  const { portfolioId, title, issuer, issueDate, description, imageUrl } = req.body;

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to add badge to this portfolio' });
  }

  const badge = await Badge.create({
    portfolioId,
    title,
    issuer,
    issueDate,
    description,
    imageUrl,
  });

  if (badge) {
    res.status(201).json(badge);
  } else {
    res.status(400).json({ message: 'Invalid badge data' });
  }
};

// @desc    Get all badges for a portfolio
// @route   GET /api/badge/list/:portfolioId
// @access  Private (Student, Teacher, Admin)
const getBadges = async (req, res) => {
  const { portfolioId } = req.params;

  const portfolio = await Portfolio.findById(portfolioId);

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  // Authorization check: Only the owner of the portfolio (student), or a teacher/admin can view
  if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view this portfolio' });
  }

  const badges = await Badge.find({ portfolioId }).sort({ issueDate: -1 });
  res.status(200).json(badges);
};

// @desc    Verify a badge (Teacher only)
// @route   PUT /api/badge/verify/:id
// @access  Private (Teacher only)
const verifyBadge = async (req, res) => {
  const { id } = req.params;

  const badge = await Badge.findById(id);

  if (!badge) {
    return res.status(404).json({ message: 'Badge not found' });
  }

  // Ensure teacher is logged in and not verifying their own (optional, but good practice)
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Not authorized to verify badges' });
  }

  badge.isVerified = true;
  badge.verifiedBy = req.user.id;

  const updatedBadge = await badge.save();
  res.status(200).json(updatedBadge);
};

// @desc    Delete a badge
// @route   DELETE /api/badge/delete/:id
// @access  Private (Student only)
const deleteBadge = async (req, res) => {
  const { id } = req.params;

  const badge = await Badge.findById(id);

  if (!badge) {
    return res.status(404).json({ message: 'Badge not found' });
  }

  const portfolio = await Portfolio.findById(badge.portfolioId);

  // Ensure student owns the portfolio associated with the badge
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this badge' });
  }

  await badge.deleteOne();
  res.status(200).json({ message: 'Badge removed' });
};

// @desc    Get count of badges for a portfolio
// @route   GET /api/badge/count/:portfolioId
// @access  Private (Student, Teacher, Admin)
const getBadgeCount = async (req, res) => {
  const { portfolioId } = req.params;

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  // Authorization check (same as getBadges for now, could be simplified if needed)
  if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view this portfolio' });
  }

  const count = await Badge.countDocuments({ portfolioId });
  res.status(200).json({ count });
};

module.exports = { addBadge, getBadges, verifyBadge, deleteBadge, getBadgeCount };