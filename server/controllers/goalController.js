const Goal = require('../models/Goal');
const Portfolio = require('../models/Portfolio');

// @desc    Add a new goal
// @route   POST /api/goal/add
// @access  Private (Student only)
const addGoal = async (req, res) => {
  const { portfolioId, title, category, targetDate, progressPercent, status, notes } = req.body;

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to add goal to this portfolio' });
  }

  const goal = await Goal.create({
    portfolioId,
    title,
    category,
    targetDate,
    progressPercent,
    status,
    notes,
  });

  if (goal) {
    res.status(201).json(goal);
  } else {
    res.status(400).json({ message: 'Invalid goal data' });
  }
};

// @desc    Get all goals for a portfolio
// @route   GET /api/goal/list/:portfolioId
// @access  Private (Student, Teacher, Admin)
const getGoals = async (req, res) => {
  const { portfolioId } = req.params;

  const portfolio = await Portfolio.findById(portfolioId);

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  // Authorization check: Only the owner of the portfolio (student), or a teacher/admin can view
  if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view this portfolio' });
  }

  const goals = await Goal.find({ portfolioId }).sort({ targetDate: 1 });
  res.status(200).json(goals);
};

// @desc    Update goal details
// @route   PUT /api/goal/update/:id
// @access  Private (Student only)
const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, category, targetDate, progressPercent, status, notes } = req.body;

  const goal = await Goal.findById(id);

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  const portfolio = await Portfolio.findById(goal.portfolioId);

  // Ensure student owns the portfolio associated with the goal
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this goal' });
  }

  goal.title = title || goal.title;
  goal.category = category || goal.category;
  goal.targetDate = targetDate || goal.targetDate;
  goal.progressPercent = progressPercent !== undefined ? progressPercent : goal.progressPercent;
  goal.status = status || goal.status;
  goal.notes = notes || goal.notes;

  const updatedGoal = await goal.save();
  res.status(200).json(updatedGoal);
};

// @desc    Delete a goal
// @route   DELETE /api/goal/delete/:id
// @access  Private (Student only)
const deleteGoal = async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findById(id);

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  const portfolio = await Portfolio.findById(goal.portfolioId);

  // Ensure student owns the portfolio associated with the goal
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this goal' });
  }

  await goal.deleteOne();
  res.status(200).json({ message: 'Goal removed' });
};

module.exports = { addGoal, getGoals, updateGoal, deleteGoal };