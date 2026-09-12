const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

const generateUniqueSlug = async (title) => {
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  let uniqueSlug = slug;
  let counter = 1;
  while (await Portfolio.exists({ publicSlug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

// @desc    Create portfolio for logged-in student
// @route   POST /api/portfolio/create
// @access  Private (Student only)
const createPortfolio = async (req, res) => {
  const { title, summary, isPublic, template } = req.body;

  // Check if user already has a portfolio
  const existingPortfolio = await Portfolio.findOne({ userId: req.user.id });
  if (existingPortfolio) {
    return res.status(400).json({ message: 'User already has a portfolio. Please update instead.' });
  }

  const publicSlug = isPublic ? await generateUniqueSlug(title) : null;

  const portfolio = await Portfolio.create({
    userId: req.user.id,
    title,
    summary,
    isPublic,
    publicSlug,
    template,
  });

  if (portfolio) {
    res.status(201).json(portfolio);
  } else {
    res.status(400).json({ message: 'Invalid portfolio data' });
  }
};

// @desc    Get own portfolio
// @route   GET /api/portfolio/mine
// @access  Private (Student only)
const getMyPortfolio = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id }).populate('userId', 'name email avatar');

  if (portfolio) {
    res.status(200).json(portfolio);
  } else {
    res.status(404).json({ message: 'Portfolio not found' });
  }
};

// @desc    Update portfolio details
// @route   PUT /api/portfolio/update
// @access  Private (Student only)
const updatePortfolio = async (req, res) => {
  const { title, summary, isPublic, template } = req.body;

  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  portfolio.title = title || portfolio.title;
  portfolio.summary = summary || portfolio.summary;
  portfolio.template = template || portfolio.template;

  // Handle isPublic and publicSlug changes
  if (typeof isPublic === 'boolean' && isPublic !== portfolio.isPublic) {
    portfolio.isPublic = isPublic;
    if (isPublic && !portfolio.publicSlug) {
      portfolio.publicSlug = await generateUniqueSlug(portfolio.title);
    } else if (!isPublic) {
      portfolio.publicSlug = null;
    }
  }

  const updatedPortfolio = await portfolio.save();
  res.status(200).json(updatedPortfolio);
};

// @desc    Get public portfolio by slug
// @route   GET /api/portfolio/public/:slug
// @access  Public
const getPublicPortfolio = async (req, res) => {
  const portfolio = await Portfolio.findOne({ publicSlug: req.params.slug, isPublic: true })
    .populate('userId', 'name email avatar institution department level bio linkedIn github website');

  if (portfolio) {
    // Increment view count
    portfolio.views = (portfolio.views || 0) + 1;
    await portfolio.save();
    res.status(200).json(portfolio);
  } else {
    res.status(404).json({ message: 'Public portfolio not found or not available' });
  }
};

// @desc    Get all portfolios (for teacher/admin)
// @route   GET /api/portfolio/all
// @access  Private (Teacher/Admin only)
const getAllPortfolios = async (req, res) => {
  const portfolios = await Portfolio.find({}).populate('userId', 'name email institution department');
  res.status(200).json(portfolios);
};
// @desc    Get portfolio by user ID (for teacher/admin)
// @route   GET /api/portfolio/user/:userId
// @access  Private (Teacher/Admin only)
const getPortfolioByUserId = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.params.userId })
    .populate('userId', 'name email avatar institution department level bio linkedIn github website')
    .populate('works')
    .populate('reflections')
    .populate('goals')
    .populate('badges')
    .populate({
      path: 'feedback',
      populate: { path: 'teacherId', select: 'name' }
    });

  if (portfolio) {
    res.status(200).json(portfolio);
  } else {
    res.status(404).json({ message: 'Portfolio not found for this user' });
  }
};
// @desc    Increment portfolio view count
// @route   PUT /api/portfolio/increment-view/:id
// @access  Public (No auth required)
const incrementPortfolioView = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.viewCount = (portfolio.viewCount || 0) + 1;
    await portfolio.save();

    res.status(200).json({ message: 'View count incremented', viewCount: portfolio.viewCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const togglePortfolioVisibility = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.isPublic = !portfolio.isPublic;
    await portfolio.save();

    res.json({ 
      message: `Portfolio is now ${portfolio.isPublic ? 'public' : 'private'}`,
      isPublic: portfolio.isPublic 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createPortfolio, 
  getMyPortfolio, 
  updatePortfolio, 
  getPublicPortfolio, 
  getAllPortfolios,
  getPortfolioByUserId,
  incrementPortfolioView,
  togglePortfolioVisibility
};