const Work = require('../models/Work');
const Portfolio = require('../models/Portfolio');

// @desc    Upload new work sample
// @route   POST /api/work/upload
// @access  Private (Student only)
const uploadWork = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for this user' });
    }

    // Handle file: memory storage gives buffer, convert to base64 data URL
    let fileUrl = '';
    let fileType = '';
    if (req.file) {
      fileType = req.file.mimetype;
      const base64 = req.file.buffer.toString('base64');
      fileUrl = `data:${fileType};base64,${base64}`;
    }

    const work = await Work.create({
      portfolioId: portfolio._id,
      title,
      description,
      category: category ? category.toLowerCase() : category,
      fileUrl,
      fileType,
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
// @access  Private
const getWorks = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this portfolio' });
    }
    const works = await Work.find({ portfolioId }).sort({ createdAt: -1 });
    res.status(200).json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update work details
// @route   PUT /api/work/update/:id
// @access  Private (Student only)
const updateWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags } = req.body;
    const work = await Work.findById(id);
    if (!work) return res.status(404).json({ message: 'Work not found' });
    const portfolio = await Portfolio.findById(work.portfolioId);
    if (!portfolio || portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this work' });
    }
    work.title = title || work.title;
    work.description = description || work.description;
    work.category = category || work.category;
    work.tags = tags ? tags.split(',').map(tag => tag.trim()) : work.tags;
    const updatedWork = await work.save();
    res.status(200).json(updatedWork);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a work sample
// @route   DELETE /api/work/delete/:id
// @access  Private (Student only)
const deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id);
    if (!work) return res.status(404).json({ message: 'Work not found' });
    const portfolio = await Portfolio.findById(work.portfolioId);
    if (!portfolio || portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this work' });
    }
    await work.deleteOne();
    res.status(200).json({ message: 'Work removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadWork, getWorks, updateWork, deleteWork };

