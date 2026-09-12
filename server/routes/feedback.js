const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { addFeedback, getFeedbackForPortfolio, deleteFeedback } = require('../controllers/feedbackController');

router.post('/add', protect, authorizeRoles('student', 'teacher', 'admin'), addFeedback);
router.get('/portfolio/:portfolioId', protect, authorizeRoles('student', 'teacher', 'admin'), getFeedbackForPortfolio);
router.delete('/delete/:id', protect, authorizeRoles('student', 'admin'), deleteFeedback);

module.exports = router;