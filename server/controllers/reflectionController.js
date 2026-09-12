const Reflection = require('../models/Reflection');
const Work = require('../models/Work');
const Portfolio = require('../models/Portfolio');

// @desc    Add a new reflection to a work
// @route   POST /api/reflection/add
// @access  Private (Student only)
const addReflection = async (req, res) => {
  const { workId, whatILearned, whatIdDoDifferently, skillsDemonstrated } = req.body;

  const work = await Work.findById(workId);
  if (!work) {
    return res.status(404).json({ message: 'Work not found' });
  }

  const portfolio = await Portfolio.findById(work.portfolioId);
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to add reflection to this work' });
  }

  const existingReflection = await Reflection.findOne({ workId });
  if (existingReflection) {
    return res.status(400).json({ message: 'A reflection already exists for this work. Please update it instead.' });
  }

  const reflection = await Reflection.create({
    workId,
    portfolioId: portfolio._id,
    whatILearned,
    whatIdDoDifferently,
    skillsDemonstrated: skillsDemonstrated ? skillsDemonstrated.split(',').map(skill => skill.trim()) : [],
  });

  if (reflection) {
    res.status(201).json(reflection);
  } else {
    res.status(400).json({ message: 'Invalid reflection data' });
  }
};

// @desc    Get reflection for a specific work
// @route   GET /api/reflection/work/:workId
// @access  Private (Student, Teacher, Admin)
const getReflectionForWork = async (req, res) => {
  const { workId } = req.params;

  const reflection = await Reflection.findOne({ workId }).populate({
    path: 'workId',
    populate: {
      path: 'portfolioId',
      select: 'userId'
    }
  });

  if (!reflection) {
    return res.status(404).json({ message: 'Reflection not found for this work' });
  }

  // Authorization check: Only the owner of the portfolio (student), or a teacher/admin can view
  if (req.user.role === 'student' && reflection.workId.portfolioId.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view this reflection' });
  }

  res.status(200).json(reflection);
};
// @desc    Get all reflections for a specific portfolio
// @route   GET /api/reflection/list-by-portfolio/:portfolioId
// @access  Private (Student, Teacher, Admin)
const listReflectionsByPortfolio = async (req, res) => {
  const { portfolioId } = req.params;

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }

  // Authorization check: Only the owner of the portfolio (student), or a teacher/admin can view
  if (req.user.role === 'student' && portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to view reflections for this portfolio' });
  }

  const reflections = await Reflection.find({ portfolioId }).populate('workId');
  res.status(200).json(reflections);
};



// @desc    Update reflection details
// @route   PUT /api/reflection/update/:id
// @access  Private (Student only)
const updateReflection = async (req, res) => {
  const { id } = req.params;
  const { whatILearned, whatIdDoDifferently, skillsDemonstrated } = req.body;

  const reflection = await Reflection.findById(id);

  if (!reflection) {
    return res.status(404).json({ message: 'Reflection not found' });
  }

  // Check if the user is the owner of the portfolio associated with this reflection
  const portfolio = await Portfolio.findById(reflection.portfolioId);
  if (!portfolio || portfolio.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this reflection' });
  }

  reflection.whatILearned = whatILearned || reflection.whatILearned;
  reflection.whatIdDoDifferently = whatIdDoDifferently || reflection.whatIdDoDifferently;
  reflection.skillsDemonstrated = skillsDemonstrated ? skillsDemonstrated.split(',').map(skill => skill.trim()) : reflection.skillsDemonstrated;

  const updatedReflection = await reflection.save();
  res.status(200).json(updatedReflection);
};

module.exports = { addReflection, getReflectionForWork, updateReflection, listReflectionsByPortfolio };