const Work = require('../models/Work');
const Portfolio = require('../models/Portfolio');

// @desc    Upload new work sample
// @route   POST /api/work/upload
// @access  Private (Student only)
const uploadWork = async (req, res) => {
  console.log('uploadWork called');
  console.log('body:', req.body);
  console.log('file:', req.file);
  try {


  const { title, description, category, tags } = req.body;

  // Check if portfolio exists for the user
  const portfolio = await Portfolio.findOne({ userId: req.user.id });
  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found for this user' });
  }

  const work = await Work.create({
    portfolioId: portfolio._id,
    title,
    description,
    category,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : '',
    fileType: req.file ? req.file.mimetype : '',
    thumbnailUrl: req.body.thumbnailUrl, // Optional, could be generated later
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
  });

  if (work) {
    res.status(201).json(work);
  } else {
    res.status(400).json({ message: 'Invalid work data' });
  }
  } catch (err) {
    console.error('uploadWork error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all works for a portfolio
// @route   GET /api/work/list/:portfolioId
// @access  Private (Student, Teacher, Admin - ownership/access check needed)
const getWorks = async (req, res) => {
  const { portfolioId } = req.params;

  // Basic check for portfolio ownership for students accessing their own
  // For teachers/admins, a more sophisticated check in the route handler is needed.
  const portfolio = await Portfolio.findById(portfolioId);

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  // Ensure only the owner (student), or authorized teacher/admin can view
  if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view this portfolio' });
  }

  const works = await Work.find({ portfolioId }).sort({ createdAt: -1 });
  res.status(200).json(works);
};

// @desc    Update work details
// @route   PUT /api/work/update/:id
// @access  Private (Student only)
const updateWork = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, tags, thumbnailUrl } = req.body;

  const work = await Work.findById(id);

  if (!work) {
    return res.status(404).json({ message: 'Work not found' });
  }

  const portfolio = await Portfolio.findById(work.portfolioId);

  // Ensure student owns the portfolio associated with the work
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this work' });
  }

  work.title = title || work.title;
  work.description = description || work.description;
  work.category = category || work.category;
  work.tags = tags ? tags.split(',').map(tag => tag.trim()) : work.tags;
  work.thumbnailUrl = thumbnailUrl || work.thumbnailUrl;

  const updatedWork = await work.save();
  res.status(200).json(updatedWork);
};

// @desc    Delete a work sample
// @route   DELETE /api/work/delete/:id
// @access  Private (Student only)
const deleteWork = async (req, res) => {
  const { id } = req.params;

  const work = await Work.findById(id);

  if (!work) {
    return res.status(404).json({ message: 'Work not found' });
  }

  const portfolio = await Portfolio.findById(work.portfolioId);

  // Ensure student owns the portfolio associated with the work
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this work' });
  }

  await work.deleteOne();
  res.status(200).json({ message: 'Work removed' });
};

module.exports = { uploadWork, getWorks, updateWork, deleteWork };