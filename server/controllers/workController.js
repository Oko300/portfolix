const Work = require('../models/Work');
const Portfolio = require('../models/Portfolio');

const uploadWork = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for this user' });
    }

    // Cloudinary gives us req.file.path as the URL
    let fileUrl = '';
    let fileType = '';
    if (req.file) {
      fileUrl = req.file.path; // Cloudinary URL
      fileType = req.file.mimetype || '';
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

    res.status(201).json(work);
  } catch (err) {
    console.error('uploadWork error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getWorks = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const works = await Work.find({ portfolioId }).sort({ createdAt: -1 });
    res.status(200).json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags } = req.body;
    const work = await Work.findById(id);
    if (!work) return res.status(404).json({ message: 'Work not found' });
    const portfolio = await Portfolio.findById(work.portfolioId);
    if (!portfolio || portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    work.title = title || work.title;
    work.description = description || work.description;
    work.category = category ? category.toLowerCase() : work.category;
    work.tags = tags ? tags.split(',').map(tag => tag.trim()) : work.tags;
    const updatedWork = await work.save();
    res.status(200).json(updatedWork);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id);
    if (!work) return res.status(404).json({ message: 'Work not found' });
    const portfolio = await Portfolio.findById(work.portfolioId);
    if (!portfolio || portfolio.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await work.deleteOne();
    res.status(200).json({ message: 'Work removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadWork, getWorks, updateWork, deleteWork };
