const Work = require('../models/Work');
const Portfolio = require('../models/Portfolio');
const { uploadToCloudinary } = require('../middleware/cloudinary');

const uploadWork = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id || req.user.id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for this user' });
    }

    let fileUrl = '';
    let fileType = '';
    let thumbnailUrl = '';

    if (req.file) {
      // Stream the in-memory buffer to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, {
        public_id: `work_${Date.now()}`,
      });

      fileUrl = result.secure_url;
      fileType = req.file.mimetype || '';

      // For images Cloudinary already gives a usable URL; for others we keep the same URL
      if (fileType.startsWith('image/')) {
        thumbnailUrl = result.secure_url;
      }
    }

    const work = await Work.create({
      portfolioId: portfolio._id,
      title,
      description: description || '',
      category: category.toLowerCase(),
      fileUrl,
      fileType,
      thumbnailUrl,
      tags: tags
        ? (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags)
        : [],
    });

    res.status(201).json(work);
  } catch (err) {
    console.error('uploadWork error:', err);
    res.status(500).json({ message: err.message || 'Failed to upload work' });
  }
};

const getWorks = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    if (req.user.role === 'student' && portfolio.userId.toString() !== (req.user._id || req.user.id).toString()) {
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
    if (!portfolio || portfolio.userId.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    work.title = title || work.title;
    work.description = description !== undefined ? description : work.description;
    work.category = category ? category.toLowerCase() : work.category;
    if (tags !== undefined) {
      work.tags = typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : tags;
    }

    // Optional: allow replacing the file on update
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        public_id: `work_${Date.now()}`,
      });
      work.fileUrl = result.secure_url;
      work.fileType = req.file.mimetype || '';
      work.thumbnailUrl = work.fileType.startsWith('image/') ? result.secure_url : '';
    }

    const updatedWork = await work.save();
    res.status(200).json(updatedWork);
  } catch (err) {
    console.error('updateWork error:', err);
    res.status(500).json({ message: err.message });
  }
};

const deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id);
    if (!work) return res.status(404).json({ message: 'Work not found' });

    const portfolio = await Portfolio.findById(work.portfolioId);
    if (!portfolio || portfolio.userId.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await work.deleteOne();
    res.status(200).json({ message: 'Work removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadWork, getWorks, updateWork, deleteWork };
