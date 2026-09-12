const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { 
  createPortfolio, 
  getMyPortfolio, 
  updatePortfolio, 
  getPublicPortfolio, 
  getAllPortfolios, 
  getPortfolioByUserId,
  incrementPortfolioView,
  togglePortfolioVisibility
} = require('../controllers/portfolioController');

// Public route
router.get('/public/:slug', getPublicPortfolio);
router.put('/increment-view/:id', incrementPortfolioView);

// Protected routes
router.post('/create', protect, authorizeRoles('student'), createPortfolio);
router.get('/mine', protect, authorizeRoles('student'), getMyPortfolio);
router.put('/update', protect, authorizeRoles('student'), updatePortfolio);
router.put('/visibility/:id', protect, authorizeRoles('student'), togglePortfolioVisibility);
router.get('/all', protect, authorizeRoles('teacher', 'admin'), getAllPortfolios);
router.get('/user/:userId', protect, authorizeRoles('teacher', 'admin'), getPortfolioByUserId);

module.exports = router;